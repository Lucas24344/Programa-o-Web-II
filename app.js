//Equipe: Micael Barros de Sousa, Lucas de Sousa Gomes

import mysql from "mysql2";
import express, { json } from "express";
import { engine } from "express-handlebars";

const rotas = express.Router();

var porta = 3000;
var app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })

);

app.use(express.static("public"));


async function listBooks() {
  const promisse = new Promise((resolve, reject) => {
      const query = 'SELECT * FROM books';
  
      conn.query(query, function(err, data) {
          if (err) reject([]);
  
          resolve(data);
      });
  }).then(books => books)
  .catch(err => err);

  return await promisse;
}

async function listUsers(user) {
  const promisse = new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users';
  
      conn.query(query, function(err, data) {
          if (err) reject([]);
  
          resolve(data);
      });
  }).then(users => users)
  .catch(err => err);

  return await promisse;
}

function createBook(book){
  const query = `INSERT INTO books (title, pages, idusers, status) VALUES ('${book.title}', '${book.pages}', '${book.idusers}', '${book.status}')`;

  conn.query(query, function(err) {
      if (err) {
          console.log(err);
      }
  });
}

app.post("/insertuser", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const query = `INSERT INTO users (email, password) VALUES ('${email}', '${password}')`;

  conn.query("SELECT * FROM users WHERE email = ?",[email], function (err,result) {
    if (err) {
      res.send(err);
    }
    if(result.length == 0){
      conn.query(query,(err,result)=>{
        if(err){
          res.send(err);
        }
        res.redirect("/");
      });
    }
    else{
      res.send("E-mail já em uso");
    }
    
  });
});

app.post('/loginuser', async (req, res) => {
  const { email, password } = req.body;
  const users = await listUsers();

  const user = users.filter(
      user => user.email == email && user.password == password
  )[0];

  if (user != null) {
      res.redirect(`/home/${user.idusers}`);
  } else {
      res.render('login', {
          title: "Login",
          error: "Email ou senha inválidos"
      }); 
  }

});

app.get ("/", (req, res)=>{
  
  res.render("login");
})

app.get("/cadastro.handlebars", (req, res)=>{
  res.render("Cadastro")
})

app.get('/home/:idusers?', async (req, res) => {
  const { idusers } = req.params;
  const users = await listUsers();
  const books = await listBooks();

  const user = users.filter(user => user.idusers == idusers)[0];
  const booksUser = books.filter(
      book => book.idusers == idusers
  );

  res.render('home', { booksUser, title: 'Controle de Livros', user });
});

app.post("/home/insert", (req, res) => {
     const { title, pages, idusers} = req.body;
     const status = '';

    const book = {
        title,
        pages,
        idusers,
        status
    }
    createBook(book);
    res.redirect(`/home/${idusers}`);
});

app.get("/delete/:idbooks/:idusers", function (req, res) {
  const { idbooks } = req.params;
  const {idusers} = req.params;


  const query = "DELETE FROM books WHERE idbooks = ?";

  conn.query(query, idbooks, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect(`/home/${idusers}`);
  });
});

app.get("/edit/:idbooks?", (req, res) => {
  const { idbooks } = req.params;
  const query = `SELECT * FROM books WHERE idbooks = '${idbooks}'`;

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    const book = data;

    res.render("edit", { book: book });
  });
});
app.get("/edit", (req, res) => {
  res.render("edit", { book: book });
});
app.post("/edit", (req, res) => {
  const idbooks = req.body.idbooks;
  const title = req.body.title;
  const pages = req.body.pages;
  const status = req.body.status;
  const {idusers}= req.body;

  const query = `UPDATE books SET title = '${title}', pages = '${pages}', status = '${status}' WHERE idbooks = '${idbooks}'`;

  conn.query(query, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect(`/home/${idusers}`);
  });
});

//conectar ao mysql
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pudimazul123",
  database: "sql1",
});

conn.connect(function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Conectado ao MySQL");

  app.listen(porta);
});