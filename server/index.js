const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const dbconnection = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
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
    console.log(results);
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .send("Error al verificar las credenciales en la base de datos.");
    } else {
      if (results.length > 0) {
        bcrypt.compare(secreto, results[0].secreto, (err, result) => {
          if (result) {
            const token = jwt.sign({ cuit: cuit }, process.env.JWT_SECRETO, {
              expiresIn: "1h",
            });
            const nombresClientes = results.map((result) => result.nombre);
            console.log("Nombres Clientes: ", nombresClientes);
            const nombreCliente = pepe(cuit, results);
            console.log("nombre cliente: ", nombreCliente);
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

// Configura el transportador de nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fesin81@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

app.post("/password-recovery", (req, res) => {
  const correo = req.body.email;
  const token = crypto.randomBytes(20).toString("hex");
  console.log(correo);

  // Primero, obtén el id_usuario usando el correo
  const sqlQuery = "SELECT id_usuario FROM usuarios WHERE correo = ?";

  dbconnection.query(sqlQuery, [correo], (error, results) => {
    console.log(correo);
    if (error) {
      console.log("Error al ejecutar la consulta:", error);
      res
        .status(500)
        .send("Error al procesar la solicitud de recuperación de contraseña.");
    } else {
      if (results.length > 0) {
        const id_usuario = results[0].id_usuario;

        // Luego, actualiza el token de recuperación de contraseña usando el id_usuario
        const sqlUpdateQuery =
          "UPDATE usuarios SET resetPasswordToken = ? WHERE id_usuario = ?";

        dbconnection.query(
          sqlUpdateQuery,
          [token, id_usuario],
          (error, result) => {
            if (error) {
              console.log("Error al ejecutar la consulta:", error);
              res;
              res.status(500).send({
                success: false,
                message:
                  "Error al procesar la solicitud de recuperación de contraseña.",
              });
            } else {
              // Configura las opciones del correo electrónico
              let mailOptions = {
                from: "fesin81@gmail.com",
                to: correo,
                subject: "Password Recovery",
                text:
                  "Click on this link to recover your password: http://localhost:3000/reset?token=" +
                  token,
              };

              // Envía el correo electrónico
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                  res;
                  res.status(500).send({
                    success: false,
                    message:
                      "Error al enviar el correo de recuperación de contraseña.",
                  });
                } else {
                  console.log("Email sent: " + info.response);
                  res.status(200).send({
                    success: true,
                    message:
                      "Se ha enviado un correo de recuperación a " +
                      correo +
                      ".",
                  });
                }
              });
            }
          }
        );
      } else {
        res
          .status(404)
          .send("No se encontró un usuario con ese correo electrónico.");
      }
    }
  });
});

app.post("/reset-password", (req, res) => {
  const correo = req.body.correo;
  const token = req.body.token;
  const secreto = req.body.newPassword;

  // Primero, obtén el id_usuario usando el correo
  const sqlQuery = "SELECT id_usuario FROM usuarios WHERE correo = ?";

  dbconnection.query(sqlQuery, [correo], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      res.status(500).send("Error al cambiar la contraseña.");
    } else {
      if (results.length > 0) {
        const id_usuario = results[0].id_usuario;

        // Luego, verifica el token y actualiza la contraseña usando el id_usuario
        const sqlUpdateQuery =
          "SELECT * FROM usuarios WHERE id_usuario = ? AND resetPasswordToken = ?";

        dbconnection.query(
          sqlUpdateQuery,
          [id_usuario, token],
          (error, results) => {
            if (error) {
              console.error("Error al ejecutar la consulta:", error);
              res.status(500).send("Error al cambiar la contraseña.");
            } else {
              if (results.length > 0) {
                // Genera el hash de la nueva contraseña
                bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(secreto, salt, (err, hash) => {
                    if (err) {
                      console.error(
                        "Error al generar el hash de la contraseña:",
                        err
                      );
                      res.status(500).send({
                        success: false,
                        message: "Error al cambiar la contraseña.",
                      });
                    } else {
                      // Consulta SQL para actualizar la contraseña
                      const sqlUpdatePasswordQuery =
                        "UPDATE usuarios SET secreto = ?, resetPasswordToken = NULL WHERE id_usuario = ?";

                      dbconnection.query(
                        sqlUpdatePasswordQuery,
                        [hash, id_usuario],
                        (error, result) => {
                          if (error) {
                            console.error(
                              "Error al ejecutar la consulta:",
                              error
                            );
                            res.status(500).send({
                              success: false,
                              message: "Error al cambiar la contraseña.",
                            });
                          } else {
                            res;
                            res.status(200).send({
                              success: true,
                              message:
                                "La contraseña ha sido cambiada exitosamente.",
                            });
                          }
                        }
                      );
                    }
                  });
                });
              } else {
                res.status(401).send("Token inválido.");
              }
            }
          }
        );
      } else {
        res
          .status(404)
          .send("No se encontró un usuario con ese correo electrónico.");
      }
    }
  });
});

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
