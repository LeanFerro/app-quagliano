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

  const cuit = req.body.cuit;
  const id_cliente = req.body.idCliente;
  //TODO validate cuit. correo
  dbconnection.query(
    "INSERT INTO usuarios (secreto, correo, cuit, id_cliente) VALUES (?, ?, ?, ?)",
    [secreto, correo, cuit, id_cliente],

    (error, result) => {
      if (error) console.log(error);
      else res.send({ correo: correo });
    }
  );
});

app.get("/verificar-cuit", (req, res) => {
  const cuit = req.query.cuit; // Obtén el CUIT del parámetro de consulta

  // Consulta SQL para verificar si el CUIT existe en la base de datos
  const sqlQuery = `SELECT * FROM clientes where cuit = ?`;
  dbconnection.query(sqlQuery, [cuit], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res.status(500).send("Error al verificar el CUIT en la base de datos.");
    } else {
      if (results.length > 0) {
        console.log("El CUIT está en la base de datos:", results);
        // Devuelve un objeto con los datos del cliente
        res.status(200).json(results[0]);
      } else {
        console.log("El CUIT no está en la base de datos.");
        res
          .status(404)
          .send("El CUIT ingresado no coincide con nuestros registros.");
      }
    }
  });
});

app.post("/login", (req, res) => {
  const cuit = req.body.cuit;
  const secreto = req.body.password;

  console.log("Cuit y contraseña:", cuit, secreto);

  // Realiza la consulta SQL para verificar las credenciales en la base de datos
  const sqlQuery = `
    SELECT usuarios.*, clientes.nombre 
    FROM usuarios 
    INNER JOIN clientes ON usuarios.id_cliente = clientes.id_cliente 
    WHERE usuarios.cuit = ? AND usuarios.secreto = ?
  `;
  dbconnection.query(sqlQuery, [cuit, secreto], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .send("Error al verificar las credenciales en la base de datos.");
    } else {
      if (results.length > 0) {
        console.log("Credenciales válidas:", results);
        // Enviar el nombre del cliente junto con el mensaje de éxito
        res
          .status(200)
          .send({
            message: "Credenciales válidas",
            nombreCliente: results[0].nombre,
          });
      } else {
        console.log("Credenciales incorrectas.");
        res.status(401).send("Credenciales incorrectas.");
      }
    }
  });
});

//nombre cliente

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
