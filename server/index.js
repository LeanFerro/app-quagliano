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
  const correo = req.body.correo;
  const secreto = req.body.password;

  //TODO validate cuit. correo
  dbconnection.query(
    "INSERT INTO usuarios (secreto, correo) VALUES (?, ?)",
    [correo, secreto],
    (error, result) => {
      if (error) console.log(error);
      else res.send({ correo: correo });
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
