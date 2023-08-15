const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dbconnection = require("./database");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world :)!!");
});

//TODO mover a headers
app.post("/signup", (req, res) => {
  const username = req.body.correo;
  const password = req.body.password;
  const cuit = req.body.cuit;
//TODO validate cuit. correo
  dbconnection.query(
    "INSERT INTO users (user_name, correo, cuit) VALUES (?, ?, ?)",
    [username, password, cuit],
    (error, result) => {
      if (error) console.log(error);
      else res.send({ username: username });
    }
  );
});

app.get("/clientes", (req, res) => {
  dbconnection.query("SELECT * FROM CLIENTES", (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
});

app.get("/marcas", (req, res) => {
  dbconnection.query("SELECT * FROM MARCAS", (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
