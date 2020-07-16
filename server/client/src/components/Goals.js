import React from 'react';
import { connect } from "react-redux";
import { Line, Bar } from 'react-chartjs-2';
import { Row, Container, Col, Image, ProgressBar, Button, Card } from 'react-bootstrap';
import "../styles/goalStyle.css";

import medalicon from "../assets/medalicon.png";

let noteGoalOptions = {
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 100
      }
    }],
    xAxes: [{
      ticks: {
        display: false
      }
    }]
  },
  title: {
    display: true,
    text: "Note Accuracy Goal for Current Level"
  },
  maintainAspectRatio: false,
  responsive: false
}

let noteGoalData = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8],
  datasets: [{
    label: "Note Accuracy",
    data: [50, 60, 70, 70, 80, 77, 83, 85],
    fill: false,
    borderColor: "#f7b307"
  },
  {
    label: "Note Accuracy Goal",
    data: [90, 90, 90, 90, 90, 90, 90, 90],
    fill: false,
    borderColor: "#32a852"
  }]
}

let pitchGoalOptions = {
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 100
      }
    }],
    xAxes: [{
      ticks: {
        display: false
      }
    }]
  },
  title: {
    display: true,
    text: "Pitch Accuracy Goal for Current Level"
  },
  maintainAspectRatio: false,
  responsive: false
}

let pitchGoalData = {
  labels: [1, 2, 3, 4, 5, 6, 7, 8],
  datasets: [{
    label: "Pitch Accuracy",
    data: [50, 60, 55, 73, 60, 55, 70, 75],
    fill: false,
    borderColor: "#f7b307"
  },
  {
    label: "Pitch Accuracy Goal",
    data: [80, 80, 80, 80, 80, 80, 80, 80],
    fill: false,
    borderColor: "#32a852"
  }]
}

let intervalAccuracyData = {
  labels: ["m2", "M2", "m3", "M3", "P4", "TT", "P5", "m6", 'M6', 'm7', 'M7', 'P8'],
  datasets: [{
    label: "Interval Accuracy",
    data: [90, 90, 80, 85, 80, 70, 75, 80, 60, 70, 80, 95],
    backgroundColor: "#32a852"
  }]
}

let intervalAccuracyOptions = {
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 100,
        suggestedMin: 20
      }
    }],
    xAxes: [{
      ticks: {
        display: true
      }
    }]
  },
  title: {
    display: true,
    text: "Interval Accuracy"
  },
  maintainAspectRatio: false,
  responsive: false
}

var noteGoalPercentage = Math.floor(noteGoalData.datasets[0].data[noteGoalData.datasets[0].data.length - 1] / 90 * 100);
var pitchGoalPercentage = Math.floor(pitchGoalData.datasets[0].data[pitchGoalData.datasets[0].data.length - 1] / 80 * 100);
console.log(noteGoalPercentage);

var currentLevel = 2;

class Goals extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showNoteAccGraph: false,
      showPitchAccGraph: false
    }
  }
  render() {
    return (
      <div>
        <Row>
          <Col md={3}>
            <h1>SIDEBAR</h1>
          </Col>
          <Col md={9}>
            <Row>
              <Col md={{ span: 8 }} className="welcome-back">
                <Row>
                  <h1>Welcome Back {this.props.userName}!</h1>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 8 }} className="welcome-back">
                <Row>
                  <Col md={{ span: 3 }}>
                    <Card style={{ width: '100%' }}>
                      <Card.Img variant="top" src={medalicon} />
                      <Card.Body>
                        <Card.Title>Minor Second Proficiency</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <Button variant="primary">Train</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={{ span: 3 }}>
                    <Card style={{ width: '100%' }}>
                      <Card.Img variant="top" src={medalicon} />
                      <Card.Body>
                        <Card.Title>Major Second Proficiency</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <Button variant="primary">Train</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={{ span: 3 }}>
                    <Card style={{ width: '100%' }}>
                      <Card.Img variant="top" src={medalicon} />
                      <Card.Body>
                        <Card.Title>Minor Third Proficiency</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <Button variant="primary">Train</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={{ span: 3 }}>
                    <Card style={{ width: '100%' }}>
                      <Card.Img variant="top" src={medalicon} />
                      <Card.Body>
                        <Card.Title>Major Third Proficiency</Card.Title>
                        <Card.Text>
                        </Card.Text>
                        <Button variant="primary">Train</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col md={{ span: 4 }}>
                <Image src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80" className="micImg"fluid />
              </Col>
            </Row>
            <Row>
              {this.state.showNoteAccGraph ?
                <Col md={{ span: 6 }} className="note-goal-data border rounded border-dark">
                  <Line data={noteGoalData} options={noteGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 6 }} className="note-goal-data border rounded border-dark">
                  <ProgressBar now={noteGoalPercentage} label={`${noteGoalPercentage}%`} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: true })}>View Completeion Percentage</Button>
                </Col>
              }



              {this.state.showPitchAccGraph ?
                <Col md={{ span: 6 }} className="pitch-goal-data border rounded border-dark">
                  <Line data={pitchGoalData} options={pitchGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 6 }} className="pitch-goal-data border rounded border-dark">
                  <ProgressBar now={pitchGoalPercentage} label={`${pitchGoalPercentage}%`} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: true })}>View Completeion Percentage</Button>
                </Col>
              }
            </Row>
            <Row>
              <Col md={{ span: 6 }} className="interval-accuracy-data border rounded border-dark">
                <Bar data={intervalAccuracyData} options={intervalAccuracyOptions} height={300} />
              </Col>
              <Col md={{ span: 6 }} className="interval-accuracy-data border rounded border-dark">
                <Bar data={intervalAccuracyData} options={intervalAccuracyOptions} height={300} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div >

    )
  }
}


function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc,
    midi: state.exerciseMidi.midi,
    userName: state.user.name,
    user_id: state.user.user_id
  };
}


export default connect(mapStateToProps, null)(Goals);