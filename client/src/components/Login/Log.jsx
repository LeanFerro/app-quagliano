import React, { useEffect, useState } from "react";
import "./log.css";
import { Modal, Button, NavLink } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import chk from "./check.png";

const Log = () => {
  const [showModal, setShowModal] = useState(false);
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [cuit, setCuit] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [nombresClientes, setNombresClientes] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (cuit.length !== 11 || !/^\d+$/.test(cuit)) {
      setMensaje("El CUIT debe contener 11 números válidos.");
      return;
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(correo)) {
      setMensaje("El correo electrónico ingresado no es válido.");
      return;
    }

    // if (password.length < 8) {
    //   setMensaje("La contraseña debe tener al menos 8 caracteres.");
    //   return;
    // }

    try {
      console.log("Verificando CUIT:", cuit);
      const response = await axios.get(
        `http://localhost:8080/verificar-cuit?cuit=${cuit}`
      );
      console.log("Respuesta del servidor:", response.data);

      if (response.status === 200) {
        if (response.data.existe) {
          setMensaje("Este CUIT ya ha sido utilizado.");
        } else {
          setNombreCliente(response.data.nombre);
          setMensaje("CUIT verificado con éxito.");

          const idCliente = response.data.id_cliente;
          console.log("Verificando id cliente:", response.data.id_cliente);
          // Ahora puedes realizar la llamada a tu API de registro.
          await axios.post("http://localhost:8080/signup", {
            idCliente,
            password,
            correo,
            cuit,
          });

          // Limpia los campos después del registro exitoso.
          setCorreo("");
          setPassword("");
          setCuit("");

          setShowModal(true);
        }
      } else {
        setMensaje(response.data);
      }
    } catch (error) {
      setMensaje("Error al verificar el CUIT.");
    }
  };

  // Login

  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/login", {
        cuit,
        password,
      });

      if (response.status === 200) {
        // Guarda el token en el estado
        const token = response.data.token;
        setToken(response.data.token);
        localStorage.setItem("token", token);
        console.log(response.data.token);
        // Obtiene el nombre del cliente
        const nombreCliente = response.data.nombreCliente;
        setNombreCliente(nombreCliente);
        // Obtiene el nombres del clientes
        const indaloClientes = response.data.nombresClientes;
        setNombresClientes(nombresClientes);

        // Redirige al componente deseado
        navigate("/marcas", { state: { nombreCliente, indaloClientes } });
      } else {
        console.log("Credenciales incorrectas.");
        setErrorMensaje("Las credenciales ingresadas no son válidas.");
      }
    } catch (error) {
      setMensaje("Error al verificar las credenciales.");
      setErrorMensaje("Error al verificar las credenciales.");
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
    const inputValue = event.target.value.replace(/\D/g, "");
    setCuit(inputValue);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload();
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
              <form className="form" onSubmit={handleLogin}>
                <label>
                  <i className="bx bx-building"></i>
                  <input
                    type="number"
                    value={cuit}
                    onChange={(e) => setCuit(e.target.value)}
                    placeholder="CUIT"
                    required
                  />
                </label>
                <label>
                  <i className="bx bx-lock-alt"></i>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                  />
                </label>
                <p>{errorMensaje}</p>
                <button type="submit">Iniciar Sesion</button>
              </form>
            </div>
            <div className="cont-olvido">
              <NavLink as={Link} to="/olvido" className="olvido">
                Olvido su contraseña?
              </NavLink>
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
                    type="number"
                    value={cuit}
                    onChange={handleCUITChange}
                    placeholder="CUIT"
                  />
                </label>

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
                <p>{mensaje}</p>
                <button type="submit">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de registro exitoso */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registro Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center ">
            <img src={chk} alt="" className="chk" />
            <h4 className="nomb-modal">{nombreCliente}</h4>
          </div>
          <p className="p-modal">¡El usuario ha sido registrado con éxito!</p>
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

export default Log;
