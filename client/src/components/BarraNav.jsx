import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Outlet, Link } from "react-router-dom";
import "./css/navbar.css";
import logo from "./img/logo2.png";
import qLogo from "./img/LG.png";

const BarraNav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
            <h4>Bienvenido al portal clientes</h4>
          </Navbar.Text>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />

          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="ml-auto">
              <Button variant="outline-light">
                <Nav as={Link} to="/log" className="log-btn">
                  Salir
                </Nav>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
};

export default BarraNav;
