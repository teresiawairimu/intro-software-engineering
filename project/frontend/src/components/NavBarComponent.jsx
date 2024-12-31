import React from 'react';
import { Navbar, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth, signOut } from '../firebaseConfig';
import logo from '../assets/images/logo.png';



const NavbarComponent = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Navbar bg="primary" variant="dark" className="mb-4" expand="lg">
      <Container fluid>
        <Navbar.Brand className="fw-bold">
        <img
          src={logo}
          alt="Logo"
          width="50"
          height="50"
          className="d-inline-block align-top"
        />

        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;