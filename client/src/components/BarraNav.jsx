import React from "react";
import { Container, Nav, Navbar, NavDropdown, NavLink } from "react-bootstrap";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./css/navbar.css";

const BarraNav = () => {
  const location = useLocation();

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
          <Navbar.Brand as={Link} to="/">
            ESTUDIO QUAGLIANO
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
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
                <li className={`nav-item ${isLinkActive("/oposiciones")}`}>
                  <Nav.Link as={Link} to="/oposiciones" className="nav-link">
                    Oposiciones
                  </Nav.Link>
                </li>
              </ul>
              <NavDropdown title="Alertas" id="collasible-nav-dropdown">
                <NavDropdown.Item>Vencimientos</NavDropdown.Item>

                <NavDropdown.Item href="#action/3.3">Vistas</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Dominios</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">Perfil</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Salir
              </Nav.Link>
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
