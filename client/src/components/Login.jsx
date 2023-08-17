import React from "react";
import { useState } from "react";
import axios from "axios";
import "./css/login.css";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cuit, setCuit] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    axios
      .post("http://localhost:8080/signup", {
        username: username,
        password: password,
        cuit: cuit,
      })
      .then((data) => {
        console.log(data);
        setUsername("");
        setPassword("");
        setCuit("");
      });
  };

  return (
    <div>
      <form
        className="mx-auto border-2 p-9 md:p-12 w-72 md:w-96 mt-36 h-84 f-azul"
        onSubmit={submitHandler}
      >
        <h3 className="pb-6 text-2xl text-center text-white">
          Ingrese sus datos
        </h3>

        <label className="block mb-1 text-xl tex-input" htmlForm="username">
          correo
        </label>
        <input
          className="w-full h-8 p-1 mb-6 focus:outline-none"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block mb-1 text-xl tex-input" htmlForm="cuit">
          cuit
        </label>
        <input
          className="w-full h-8 p-1 mb-6 focus:outline-none"
          id="cuit"
          type="cuit"
          value={cuit}
          onChange={(e) => setCuit(e.target.value)}
        />

        <label className="block mb-1 text-xl tex-input" htmlForm="password">
          contraseña
        </label>
        <input
          className="w-full h-8 p-1 mb-6 focus:outline-none"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="px-3 py-1 rounded-sm bot-sub" type="submit">
            Crear
          </button>
          <button className="px-3 py-1 rounded-sm bot-sub" type="submit">
            <Nav as={Link} to="/marcas" className="log">
              Ingresar
            </Nav>
          </button>
          <button className="px-3 py-1 rounded-sm bot-sub" type="submit">
            <Nav as={Link} to="/marcas" className="log">
              login
            </Nav>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
