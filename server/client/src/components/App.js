import React from 'react';
import { Nav, Form, FormControl, Button, Container, Col, Row } from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Player from './Player';
import Score from './Score';
import IntervalScore from './IntervalScore'
import PitchDetector from './PitchDetector';
import Goals from './Goals';
import "../styles/appStyle.css";
import { v4 as uuidv4 } from 'uuid';
import { setUser, getUser } from '../actions/index'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route } from "react-router-dom";


let user_id = localStorage.getItem('my_user_id')

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      user_id: localStorage.getItem('my_user_id')
    }
  }

  componentDidMount() {
    if (this.state.user_id) {
      this.props.getUser(this.state.user_id)
    }
  }

  createUser(event) {
    event.preventDefault();
    let id = uuidv4();
    localStorage.setItem('my_user_id', id)
    this.setState({ user_id: id })
    this.props.setUser(this.state.name, id);
    user_id = id;
  }

  addName(event) {
    event.preventDefault();
    let name = event.target.value;
    this.setState({ name: name });
  }
  render() {
    if (user_id && user_id.length > 0) {
      return (
        <Container className="appContainer" fluid>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand className="logo" style={{ color: "skyblue" }} href="/">InTu(ne)itive</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link style={{ color: "skyblue" }} href="/">Home</Nav.Link>
            </Nav>
            <Navbar.Text >
              <span>Signed in as: {this.props.userName}</span> <span style={{ color: "skyblue" }}> Level: {this.props.level} </span>
            </Navbar.Text>

          </Navbar>
          <Switch>
            <Route exact path={"/"} component={Goals} />
            <Route path={"/exercises/level/:level"} component={Score} />
            <Route path={"/exercises/intervals/:interval"} component={IntervalScore} />
          </Switch>
        </Container>
      );
    } else {
      return (
        <Container className="appContainer" fluid>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand className="logo" style={{ color: "skyblue" }} href="/">InTu(ne)itive</Navbar.Brand>
            <Nav className="mr-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
          </Navbar>
          <Row>
            <Col md={{ span: 4, offset: 4 }}>
              <h1>Enter your name to get started</h1>
              <br />
              <Row>
                <Form className="nameForm">
                  <Form.Control placeholder="First Name" onChange={this.addName.bind(this)} />
                </Form>
                <Button type="btn btn-primary" onClick={this.createUser.bind(this)}>Submit</Button>
              </Row>
            </Col>
          </Row>
        </Container>
      )
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setUser, getUser },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    userName: state.user.name,
    user_id: state.user.user_id,
    level: state.user.level,
    intervalAcc: state.intervalAcc,
    pitchAcc: state.pitchAcc,
    noteAcc: state.noteAcc
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);

