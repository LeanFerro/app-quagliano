import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, Link, useNavigate } from "react-router-dom";
import "./css/navbar.css";
import logo from "./img/logo_blanco.png";
import qLogo from "./img/LG.png";
import linea from "./img/linea.jpg";
import { logout } from "./helpers/auth";
import { isAuthenticated } from "./helpers/auth";

const BarraNav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/log");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <Navbar
        collapseOnSelect
        expand="lg"
        variant="dark"
        className="color"
        sticky="top"
      >
        <Container fluid>
          {/* Logo para pantallas grandes */}
          {!isMobile && (
            <Navbar.Brand as={Link} to="/">
              <img src={logo} alt="Estudio Quagliano" className="logoqua" />
            </Navbar.Brand>
          )}

          {/* Logo para pantallas pequeñas (modo celular) */}
          {isMobile && (
            <Navbar.Brand as={Link} to="/">
              <img
                src={qLogo}
                alt="Estudio Quagliano Mobile"
                className="logoq"
              />
            </Navbar.Brand>
          )}
          <Navbar.Text>
            <h4 className="titulo-centrado">Bienvenido al portal clientes</h4>
          </Navbar.Text>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse
            id="responsive-navbar-nav"
            className="collapse-custom"
          >
            <Nav className="ml-auto">
              {isAuthenticated() && (
                <Button
                  variant="outline-light"
                  className="btn-h"
                  onClick={handleLogout}
                >
                  Salir
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="cont-linea">
        <img src={linea} alt="linea" className="img-linea" />
      </div>
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
};

export default BarraNav;
