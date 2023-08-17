import React, { useEffect, useState } from "react";
import "./log.css";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Log = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cuit, setCuit] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Aquí realizas la llamada a tu API para verificar el CUIT en la tabla clientes.
      console.log("Verificando CUIT:", cuit);
      const response = await axios.get(
        `http://localhost:8080/clientes?cuit=${cuit}`
      );
      console.log("Respuesta del servidor:", response.data);

      if (response.data) {
        setNombreCliente(response.data.nombre);
        setMensaje("CUIT verificado con éxito.");

        // Ahora puedes realizar la llamada a tu API de registro.
        await axios.post("http://localhost:8080/signup", {
          password: password,
          correo: correo,
          cuit: cuit,
        });

        // Limpia los campos después del registro exitoso.
        setCorreo("");
        setPassword("");
        setCuit("");
      } else {
        setMensaje("El CUIT ingresado no coincide con nuestros registros.");
      }
    } catch (error) {
      setMensaje("Error al verificar el CUIT.");
    }
  };

  useEffect(() => {
    const handleButtonClick = (showLoginForm) => {
      const formLogin = document.querySelector(".login");
      const formRegister = document.querySelector(".register");
      formLogin.classList.toggle("hide", !showLoginForm);
      formRegister.classList.toggle("hide", showLoginForm);
    };

    const btnSignIn = document.getElementById("sign-in");
    const btnSignUp = document.getElementById("sign-up");

    if (btnSignIn && btnSignUp) {
      btnSignIn.addEventListener("click", () => handleButtonClick(true));
      btnSignUp.addEventListener("click", () => handleButtonClick(false));
    }

    handleButtonClick(true);

    return () => {
      if (btnSignIn && btnSignUp) {
        btnSignIn.removeEventListener("click", () => handleButtonClick(true));
        btnSignUp.removeEventListener("click", () => handleButtonClick(false));
      }
    };
  }, []);

  const handleCUITChange = (event) => {
    setCuit(event.target.value);
  };

  return (
    <div className="cont-search">
      <div className="formbody">
        <div className="container-form login hide">
          <div className="information">
            <div className="info-childs">
              <h2>Bienvenido nuevamente!</h2>
              <p>Sin aún no tenés una cuenta por favor registrate</p>
              <input type="button" value="Registrarse" id="sign-up" />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Iniciar Sesión</h2>
              <form className="form">
                <label>
                  <i className="bx bx-envelope"></i>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    required
                  />
                </label>
                <label>
                  <i className="bx bx-lock-alt"></i>
                  <input type="password" placeholder="Contraseña" required />
                </label>
                <button type="submit">
                  <Nav as={Link} to="/marcas" className="log">
                    Iniciar Sesion
                  </Nav>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="container-form register">
          <div className="information">
            <div className="info-childs">
              <h2>Bienvenido</h2>
              <p>
                Para acceder a tu cuenta por favor inicia sesión con tus datos
              </p>
              <input type="button" value="Iniciar Sesión" id="sign-in" />
            </div>
          </div>
          <div className="form-information">
            <div className="form-information-childs">
              <h2>Crear una cuenta</h2>
              <form className="form" onSubmit={handleSubmit}>
                <label htmlFor="cuit">
                  <i className="bx bx-building"></i>
                  <input
                    id="cuit"
                    type="text"
                    value={cuit}
                    onChange={handleCUITChange}
                    placeholder="CUIT"
                  />
                </label>
                <h3>{nombreCliente}</h3>
                <p>{mensaje}</p>
                <label htmlFor="username">
                  <i className="bx bx-envelope"></i>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    id="username"
                    required
                  />
                </label>
                <label htmlFor="password">
                  <i className="bx bx-lock-alt"></i>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    required
                  />
                </label>

                <button type="submit">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Log;
