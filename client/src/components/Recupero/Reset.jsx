import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

const Reset = () => {
  const [correo, setCorreo] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    setToken(token);
  }, [location]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/login");
    window.location.reload();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword();
  };

  const handleCorreoChange = (e) => {
    setCorreo(e.target.value);
  };

  const handleNewPassword = (e) => {
    setNewPassword(e.target.value);
  };

  const resetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/reset-password",
        { correo, token, newPassword }
      );

      if (response.data.success) {
        setShowModal(true);
      } else {
        setMessage("Hay un problema al cambiar la contraseña");
      }
    } catch (error) {
      setMessage("Hubo un problema al cambiar la contraseña");
    }
  };

  return (
    <div className="cont-search">
      <div className="container-form-forgot">
        <div className="form-information-forgot">
          <div className="form-information-childs">
            <h2>Reiniciar contraseña</h2>
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="email">
                <i className="bx bx-envelope"></i>
                <input
                  type="text"
                  id="correo"
                  placeholder="Ingrese su mail"
                  value={correo}
                  onChange={handleCorreoChange}
                  required
                />
              </label>

              <label htmlFor="email">
                <i className="bx bx-lock-alt"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingrese su nueva contraseña"
                  value={newPassword}
                  onChange={handleNewPassword}
                  required
                />
              </label>
              <p>{message}</p>
              <button type="submit" className="btn-forgot">
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cambio de contraseña Exitosa!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center ">
            <p className="p-modal">
              Se ha logrado cambiar la contraseña de forma exitosa
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

export default Reset;
