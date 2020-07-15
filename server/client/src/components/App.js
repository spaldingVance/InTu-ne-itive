import React from 'react';
import { Nav, Form, FormControl, Button } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Player from './Player';
import Score from './Score';
import PitchDetector from './PitchDetector';

function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">EnTune</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">Goals</Nav.Link>
          <Nav.Link href="#">Sight Reading</Nav.Link>
          <Nav.Link href="#">Pitch Matching</Nav.Link>
          <Nav.Link href="#">Interval Training</Nav.Link>
          <Nav.Link href="#">Login</Nav.Link>
        </Nav>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: <a href="#login">Spalding</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Score />
    </div>
  );
}

export default App;
