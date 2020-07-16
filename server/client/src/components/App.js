import React from 'react';
import { Nav, Form, FormControl, Button, Container, Col, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Player from './Player';
import Score from './Score';
import PitchDetector from './PitchDetector';
import Goals from './Goals';
import "../styles/appStyle.css";
import { v4 as uuidv4 } from 'uuid';
import { setUser } from '../actions/index'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const userId = localStorage.getItem('my_user_id')

class App extends React.Component {
  constructor(props) {
    super(props)
    // this.createUser = this.createUser.bind(this);
    console.log(this.props);
  }

  createUser() {
    console.log("creating a user _________")
    let id = uuidv4();
    localStorage.setItem('my_user_id', id)
    // this.setState({user_id: id})
    console.log("USER ID: " + id);
    console.log(this.state.name);
    this.props.setUser(this.state.name, id);
  }

  addName(event) {
    event.preventDefault();
    let name = event.target.value;
    if (name.length > 0 && name) {
      console.log("NAME: " + name);
      this.setState({ name: name }, () => console.log(this.state.name));
    } else {
      console.log("name; " + name)
    }
  }
  render() {
    if (userId && 1 === 2) {
      console.log("USER HAS ID: " + userId)
      console.log("USER HAS NAME: " + this.state.name)
      return (
        <Container className="appContainer" fluid>
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
                Signed in as: <a href="#login">{this.state.name}</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          {/* <Score /> */}
          <Goals />
        </Container>
      );
    } else {
      return (
        <Container className="appContainer" fluid>
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
          </Navbar>
          <h1>{this.props.userName}  {this.props.user_id}</h1>
          <Row>
            <Col md={{ span: 4, offset: 4 }}>
              <Form className="nameForm">
                <Form.Control placeholder="First Name" onChange={this.addName.bind(this)} />
                <Button type="btn btn-primary" onClick={this.createUser.bind(this)}>Submit</Button>
              </Form>
            </Col>

          </Row>
          {/* <Score /> */}
          {/* <Goals /> */}
        </Container>
      )
    }
  }
}

function mapDispatchToProps(dispatch) {
  console.log("dispatching ---0")
  return bindActionCreators(
    { setUser },
    dispatch
  );
}

function mapStateToProps(state) {
  console.log(state);
  return {
    userName: state.user.name,
    user_id: state.user.user_id
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

