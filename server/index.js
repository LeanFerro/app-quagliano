const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dbconnection = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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

  // Generar el hash de la contraseña utilizando bcryptjs
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(secreto, salt, (err, hash) => {
      if (err) {
        console.error("Error al generar el hash de la contraseña:", err);
        res.status(500).send("Error al registrar el usuario.");
      } else {
        // Guardar el usuario en la base de datos con la contraseña hasheada
        dbconnection.query(
          "INSERT INTO app.usuarios (secreto, correo, cuit, id_cliente) VALUES (?, ?, ?, ?)",
          [hash, correo, cuit, id_cliente],
          (error, result) => {
            if (error) {
              console.error("Error al ejecutar la consulta:", error);
              res.status(500).send("Error al registrar el usuario.");
            } else {
              res.send({ correo: correo });
            }
          }
        );
      }
    });
  });
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

const pepe = (cuit, results) => {
  for (let i = 0; i < results.length; i++) {
    if (results[i].cuit == cuit) return results[i].nombre;

    console.log(results[i].nombre);
  }
};

app.post("/login", (req, res) => {
  const cuit = req.body.cuit;
  const secreto = req.body.password;

  const sqlQuery = `
  SELECT c.nombre, c.cuit, u.secreto 
  FROM clientes c
  JOIN usuarios u on c.cuit = u.cuit
  WHERE c.aclaracion LIKE
    concat(
      (SELECT SUBSTRING(clientes.aclaracion, 1, 6)
      FROM clientes 
      WHERE clientes.cuit = ?) , "%"
      );
  
`; // aclaracion = grupo

  dbconnection.query(sqlQuery, [cuit], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .send("Error al verificar las credenciales en la base de datos.");
    } else {
      if (results.length > 0) {
        bcrypt.compare(secreto, results[0].secreto, (err, result) => {
          if (result) {
            console.log(result);
            const token = jwt.sign({ cuit: cuit }, process.env.JWT_SECRETO, {
              expiresIn: "1h",
            });
            console.log(token);
            const nombresClientes = results.map((result) => result.nombre);
            const nombreCliente = pepe(cuit, results);

            res.status(200).send({
              message: "Credenciales válidas",
              nombresClientes,
              nombreCliente,
              token: token,
            });
          } else {
            console.log(" primero Credenciales incorrectas.");
            res.status(401).send("Credenciales incorrectas.");
          }
        });
      } else {
        console.log(" segundo Credenciales incorrectas.");
        res.status(401).send("Credenciales incorrectas.");
      }
    }
  });
});

const verifyToken = (req, res, next) => {
  const accessToken = req.headers["authorization"];
  if (typeof accessToken !== "undefined") {
    const bearer = accessToken.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    jwt.verify(bearerToken, process.env.JWT_SECRETO, (err, authData) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.authData = authData;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

app.get("/clientes", (req, res) => {
  dbconnection.query("SELECT * FROM CLIENTES", (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
});

app.get("/marcas", (req, res) => {
  const nombreCliente = req.query.nombreCliente;
  const sqlQuery = `
    SELECT marcas.* 
    FROM marcas 
    INNER JOIN clientes_marcas ON marcas.id_marca = clientes_marcas.id_marca 
    INNER JOIN clientes ON clientes_marcas.id_cliente = clientes.id_cliente 
    WHERE clientes.nombre = ?
  `;
  dbconnection.query(sqlQuery, [nombreCliente], (error, result) => {
    if (error) return res.json(error);
    else return res.json(result);
  });
});

app.listen(8080, () => {
  console.log("server listening on port 8080");
});
