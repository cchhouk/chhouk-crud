const express = require("express");
const path = require("path");
const { Pool } = require("pg");

// dotenv requirement.
require('dotenv').config();

// Creating the Express server
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL="postgres://tzeqxjvewtrogc:439faec6f57b9efc87a9ba905eaca28d09ac5fbe9730f74bca3e6c86cb72f470@ec2-34-197-84-74.compute-1.amazonaws.com:5432/dfh8ta6gelkasp",
  ssl: {
    rejectUnauthorized: false
  }
});  

// Starting the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Hello world...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    titre: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

// GET /books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title";
  pool.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: result.rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
  const book = [req.body.title, req.body.author, req.body.comments];
  pool.query(sql, book, (err, result) => {
    // if (err) ...
    res.redirect("/books");
  });
});

// // GET /create
// app.get("/create", (req, res) => {
//   const book = {
//     Author: "Victor Hugo"
//   }
//   res.render("create", { model: book });
// });

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    // if (err) ...
    res.render("edit", { model: result.rows[0] });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.title, req.body.author, req.body.comments, id];
  const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
  pool.query(sql, book, (err, result) => {
    // if (err) ...
    res.redirect("/books");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    // if (err) ...
    res.render("delete", { model: result.rows[0] });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Books WHERE Book_ID = $1";
  pool.query(sql, [id], (err, result) => {
    // if (err) ...
    res.redirect("/books");
  });
});

// GET /SQL
// app.get("/books", (req, res) => {
//   const sql = "SELECT * FROM Books ORDER BY Title"
//   pool.query(sql, [], (err, result) => {
//     if (err) {
//       return console.error(err.message);
//     }
//     res.render("books", { model: result.rows });
//   });
// });









