import mysql from 'mysql2';


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

export default {
    conn,

    listBooks,

    listUsers,
}