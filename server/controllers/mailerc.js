const dbconnection = require("../database/database");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fesin81@gmail.com",
    pass: process.env.MAIL_PASSWORD,
  },
});

function passRecover(req, res) {
  const correo = req.body.email;
  const token = crypto.randomBytes(20).toString("hex");

  // Primero, obtén el id_usuario usando el correo
  const sqlQuery = "SELECT id_usuario FROM usuarios WHERE correo = ?";

  dbconnection.query(sqlQuery, [correo], (error, results) => {
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
                subject: "Reseteo de contraseña",
                text:
                  "Haz clic en el link para resetear su contraseña: http://localhost:3000/reset?token=" +
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
}

async function passReset(req, res) {
  const { correo, token, newPassword: secreto } = req.body;

  try {
    // Primero, obtén el id_usuario usando el correo
    dbconnection.query(
      "SELECT id_usuario FROM usuarios WHERE correo = ?",
      [correo],
      async (error, results) => {
        if (error) {
          console.error("Error al ejecutar la consulta:", error);
          return res.status(500).send({
            success: false,
            message: "Error al cambiar la contraseña.",
          });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .send("No se encontró un usuario con ese correo electrónico.");
        }

        const id_usuario = results[0].id_usuario;

        // Luego, verifica el token y actualiza la contraseña usando el id_usuario
        dbconnection.query(
          "SELECT * FROM usuarios WHERE id_usuario = ? AND resetPasswordToken = ?",
          [id_usuario, token],
          async (error, userResults) => {
            if (error) {
              console.error("Error al ejecutar la consulta:", error);
              return res.status(500).send({
                success: false,
                message: "Error al cambiar la contraseña.",
              });
            }

            if (userResults.length === 0) {
              return res.status(401).send("Token inválido.");
            }

            // Genera el hash de la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(secreto, salt);

            // Consulta SQL para actualizar la contraseña
            dbconnection.query(
              "UPDATE usuarios SET secreto = ?, resetPasswordToken = NULL WHERE id_usuario = ?",
              [hash, id_usuario],
              (error, updateResults) => {
                if (error) {
                  console.error("Error al ejecutar la consulta:", error);
                  return res.status(500).send({
                    success: false,
                    message: "Error al cambiar la contraseña.",
                  });
                }

                res.status(200).send({
                  success: true,
                  message: "La contraseña ha sido cambiada exitosamente.",
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    res.status(500).send({
      success: false,
      message: "Error al cambiar la contraseña.",
    });
  }
}

module.exports = {
  passRecover,
  passReset,
};
