import React from "react";
import axios from "axios";
import { useState } from "react";
import "./forgot.css";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendPasswordRecoveryRequest();
  };

  const sendPasswordRecoveryRequest = async () => {
    try {
      const response = await axios.post("/api/password-recovery", { email });

      if (response.data.success) {
        setMessage(`Se ha enviado un correo de recuperación a ${email}.`);
      } else {
        setMessage(
          "Hubo un problema al procesar la solicitud de recuperación de contraseña."
        );
      }
    } catch (error) {
      setMessage(
        "Hubo un error al enviar la solicitud de recuperación de contraseña."
      );
    }
  };

  return (
    <div className="cont-search">
      <div className="container-form-forgot">
        <div className="form-information-forgot">
          <div className="form-information-childs">
            <h2>Recuperar contraseña</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="email">
                <i className="bx bx-envelope"></i>
                <input
                  type="email"
                  id="email"
                  placeholder="Ingrese su correo electrónico"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </label>
              <button type="submit" className="btn-forgot">
                Enviar
              </button>
            </form>
            {message && <p>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
