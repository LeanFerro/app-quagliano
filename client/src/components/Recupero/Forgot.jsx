import React from "react";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./forgot.css";
import { sendPasswordRecoveryRequest } from "../helpers/api";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const sendRequest = async () => {
    try {
      const response = await sendPasswordRecoveryRequest(email);
      if (response.success) {
        setShowModal(true);
      } else {
        setMessage("Mail incorrecto.");
      }
    } catch (error) {
      setMessage("Error al enviar la solicitud de recuperación de contraseña.");
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
              {message && <p>{message}</p>}
              <button type="submit" className="btn-forgot">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Envio Exitoso!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center ">
            <p className="p-modal">
              Se ha enviado un correo de recuperación a {email}.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Forgot;
