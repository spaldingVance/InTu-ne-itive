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
    // this.createUser = this.createUser.bind(this);
    console.log(this.props);
  }

  componentDidMount() {
    console.log("COMPONENET DID Mount-")
    console.log(this.props.user_id);
    if (this.state.user_id) {
      console.log("USER ID IS " + this.state.user_id)
      this.props.getUser(this.state.user_id)
    }
  }

  // componentDidUpdate() {
  //   console.log("COMPONENET DID UPDATE-")
  //   if (this.state.user_id && !this.props.userName) {
  //     console.log("component updating");
  //     console.log(this.props.userName)
  //     console.log("USER id IS: " + this.state.user_id)
  //     this.props.getUser(this.state.user_id)
  //   }
  // }

  createUser(event) {
    event.preventDefault();
    let id = uuidv4();
    localStorage.setItem('my_user_id', id)
    this.setState({ user_id: id })
    console.log(this.state.name);
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
                Signed in as: {this.props.userName} Level: {this.props.level}
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Route exact path={"/"} component={Goals} />
            <Route path={"/exercises/level/:level"} component={Score} />
            <Route path={"/exercises/intervals/:interval"} component={IntervalScore} />
          </Switch>
          {/* <Score /> */}
          {/* <Goals /> */}
        </Container>
      );
    } else {
      console.log(user_id)
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

