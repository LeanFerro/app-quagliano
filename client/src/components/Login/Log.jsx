import React, { useEffect, useState } from "react";
import "./log.css";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const Log = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/signup", {
        username: username,
        password: password,
      })
      .then((data) => {
        console.log(data);
        setUsername("");
        setPassword("");
      });
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
              <form className="form" onSubmit={submitHandler}>
                <label htmlForm="username">
                  <i className="bx bx-building"></i>
                  <input type="number" placeholder="CUIT" />
                </label>
                <label>
                  <i className="bx bx-envelope"></i>
                  <input
                    type="email"
                    placeholder="Correo Electrónico"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    required
                  />
                </label>
                <label htmlForm="password">
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

                <button type="submit">
                  <Nav as={Link} className="log">
                    Resgistrarse
                  </Nav>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Log;
