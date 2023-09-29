const dbconnection = require("../database/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function postSignup(req, res) {
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
}

function verifyCuit(req, res) {
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
}

const getNombre = (cuit, clientes) => {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cuit == cuit) return clientes[i].nombre;
  }
};

const getSecreto = (cuit, clientes) => {
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cuit == cuit) return clientes[i].secreto;
  }
};

const getLogin = function (req, res) {
  const cuit = req.body.cuit;
  const secreto = req.body.password;

  const sqlQuery = `
      SELECT c.nombre, c.cuit, u.secreto
      FROM clientes c 
      LEFT JOIN usuarios u ON c.cuit = u.cuit
      WHERE c.aclaracion LIKE CONCAT(
      (SELECT SUBSTRING(aclaracion, 1, 6) 
       FROM clientes
       WHERE cuit = ?),
      '%'
    );
      
    `; // aclaracion = grupo
  dbconnection.query(sqlQuery, [cuit], (error, clientes) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .send("Error al verificar las credenciales en la base de datos.");
    } else {
      if (clientes.length > 0) {
        console.log(clientes);
        bcrypt.compare(
          secreto,
          getSecreto(cuit, clientes),
          function (err, cliente) {
            console.log(cliente);
            if (cliente) {
              const token = jwt.sign({ cuit: cuit }, process.env.JWT_SECRETO, {
                expiresIn: "1h",
              });
              const nombres = clientes.map((cliente) => cliente.nombre);
              const nombre = getNombre(cuit, clientes);
              console.log("nombre de cliente: ", nombre);
              res.status(200).send({
                message: "Credenciales válidas",
                nombres,
                nombre,
                token: token,
              });
            } else {
              console.log("primero Credenciales incorrectas.");
              res.status(401).send("Credenciales incorrectas.");
            }
          }
        );
      } else {
        console.log(" segundo Credenciales incorrectas.");
        res.status(401).send("Credenciales incorrectas.");
      }
    }
  });
};

module.exports = {
  getLogin,
  postSignup,
  verifyCuit,
};
