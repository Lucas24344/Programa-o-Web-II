import mysql from "mysql2";
import express from "express";
import { engine } from "express-handlebars";
var porta = 3000;

var app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("public"));

app.post("/insert", (req, res) => {
  const title = req.body.title;
  const pages = req.body.pages;

  const query = `INSERT INTO books (title, pages) VALUES ('${title}', '${pages}')`;

  conn.query(query, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  const query = "SELECT * FROM books";

  conn.query(query, function (err, data) {
    if (err) {
      console.log(err);
      return;
    }

    const books = data;

    res.render("home", { books });
  });
});

app.get("/delete/:idbooks", function (req, res) {
  const { idbooks } = req.params;

  const query = "DELETE FROM books WHERE idbooks = ?";

  conn.query(query, idbooks, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
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

  const query = `UPDATE books SET title = '${title}', pages = '${pages}' WHERE idbooks = '${idbooks}'`;

  conn.query(query, function (err) {
    if (err) {
      console.log(err);
    }

    res.redirect("/");
  });
});

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodemysql2",
});

conn.connect(function (err) {
  if (err) {
    console.log(err);
  }

  console.log("Conectado ao MySQL");

  app.listen(porta);
});
