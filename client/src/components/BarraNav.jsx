import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavLink, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavLink, Button } from "react-bootstrap";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./css/navbar.css";
import logo from "./img/logo2.png";
import qLogo from "./img/LG.png";

const BarraNav = () => {
    const location = useLocation();

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

    const isLinkActive = (pathname) => {
      return pathname === location.pathname ? "active" : "";
    };

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
              <h4>BIENVENIDO AL PORTAL CLIENTES</h4>
            </Navbar.Text>
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
              <h4>Bienvenido al Portal clientes</h4>
            </Navbar.Text>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />


            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto">
              <Nav className="ms-auto">
                <ul className="navbar-nav">
                  <li className={`nav-item ${isLinkActive("/marcas")}`}>
                    <NavLink as={Link} to="/marcas" className="nav-link">
                      Marcas
                    </NavLink>
                  </li>
                  <li className={`nav-item ${isLinkActive("/clientes")}`}>
                    <Nav.Link as={Link} to="/clientes" className="nav-link">
                      Clientes
                    </Nav.Link>
                  </li>
                </ul>
              </Nav>
              <Nav>
                <Button variant="outline-light">
                  <Nav as={Link} to="/log" className="log-btn">
                    Salir
                  </Nav>
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* <div className="cont-linea">
          <img src={linea} className="linea1" alt="" />
        </div> */}

        <section>
          <Outlet></Outlet>
        </section>
      </div>
  );
};


export default BarraNav;
