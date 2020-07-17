import React from 'react';
import { connect } from "react-redux";
import { Line, Bar } from 'react-chartjs-2';
import { Row, Container, Col, Image, ProgressBar, Button, Card } from 'react-bootstrap';
import "../styles/goalStyle.css";
import { bindActionCreators } from "redux";
import { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser } from '../actions/index'
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
        suggestedMin: 0,
        
      }
    }],
    xAxes: [{
      ticks: {
        display: true,
        // maxTicksLimit: 21,
        autoSkip: false
      }
    }]
  },
  title: {
    display: true,
    text: "Interval Accuracy"
  },
  maintainAspectRatio: false,
  responsive: true
}

var noteAccuracyData = [];




var currentLevel = 2;

class Goals extends React.Component {
  constructor(props) {
    super(props)
    noteAccuracyData = this.props.noteAcc.slice();
    this.state = {
      showNoteAccGraph: false,
      showPitchAccGraph: false,
      user_id: localStorage.getItem('my_user_id')
    }
    this.buildPitchGoalData = this.buildPitchGoalData.bind(this);
    this.buildNoteGoalData = this.buildNoteGoalData.bind(this);
    this.buildIntervalGoalData = this.buildIntervalGoalData.bind(this);
  }

  buildNoteGoalData() {
    console.log(this.props.noteAcc)
    let noteGoalData = {
      labels: this.props.noteAcc.map((note, index) => index),
      datasets: [{
        label: "Note Accuracy",
        data: this.props.noteAcc,
        fill: false,
        borderColor: "#f7b307"
      },
      {
        label: "Note Accuracy Goal",
        data: this.props.noteAcc.map(note => 90),
        fill: false,
        borderColor: "#32a852"
      }]
    }
    return noteGoalData;
  }

  buildPitchGoalData() {
    console.log(this.props.pitchAcc);
    let pitchGoalData = {
      labels: this.props.pitchAcc.map((pitch, index) => index),
      datasets: [{
        label: "Pitch Accuracy",
        data: this.props.pitchAcc,
        fill: false,
        borderColor: "#f7b307"
      },
      {
        label: "Pitch Accuracy Goal",
        data: this.props.pitchAcc.map(pitch => 80),
        fill: false,
        borderColor: "#32a852"
      }]
    }
    return pitchGoalData;
  }

  buildIntervalGoalData() {
    if(Object.keys(this.props.intervalAcc).length === 0) return {};
    console.log(this.props.intervalAcc);
    let sortedIntervalAcc = Object.keys(this.props.intervalAcc).sort((a, b) => Number(a) - Number(b));
    console.log(sortedIntervalAcc)
    // sortedIntervalAcc = sortedIntervalAcc.forEach(key => {{key}: this.props.intervalAcc[key]});
    let intervalGoalDataset = sortedIntervalAcc.filter(key => key !== 0).map(key => {
      // console.log("key")
      // console.log(key);
      // console.log(typeof key);
      switch (key) {
        case "-12":
          return { "-P8": this.props.intervalAcc[key] };
          break;
        case "-11":
          return { "-M7": this.props.intervalAcc[key] };
          break;
        case "-10":
          return { "-m7": this.props.intervalAcc[key] }
          break;
        case "-9":
          return { "-M6": this.props.intervalAcc[key] }
          break;
        case "-8":
          return { "-m6": this.props.intervalAcc[key] }
          break;
        case "-7":
          return { "-P5": this.props.intervalAcc[key] }
          break;
        case "-6":
          return { "-TT": this.props.intervalAcc[key] }
          break;
        case "-5":
          return { "-P4": this.props.intervalAcc[key] }
          break;
        case "-4":
          return { "-M3": this.props.intervalAcc[key] }
          break;
        case "-3":
          return { "-m3": this.props.intervalAcc[key] }
          break;
        case "-2":
          return { "-M2": this.props.intervalAcc[key] }
          break;
        case "-1":
          return { "-m2": this.props.intervalAcc[key] }
          break;
        case "12":
          return { "P8": this.props.intervalAcc[key] };
          break;
        case "11":
          return { "M7": this.props.intervalAcc[key] };
          break;
        case "10":
          return { "m7": this.props.intervalAcc[key] }
          break;
        case "9":
          return { "M6": this.props.intervalAcc[key] }
          break;
        case "8":
          return { "m6": this.props.intervalAcc[key] }
          break;
        case "7":
          return { "P5": this.props.intervalAcc[key] }
          break;
        case "6":
          return { "TT": this.props.intervalAcc[key] }
          break;
        case "5":
          return { "P4": this.props.intervalAcc[key] }
          break;
        case "4":
          return { "-M3": this.props.intervalAcc[key] }
          break;
        case "3":
          return { "-m3": this.props.intervalAcc[key] }
          break;
        case "2":
          return { "-M2": this.props.intervalAcc[key] }
          break;
        case "1":
          return { "-m2": this.props.intervalAcc[key] }
          break;
        default:
          return { "0": null }
      }
    })
    console.log(intervalGoalDataset)
    let labels = intervalGoalDataset.map(data => Object.keys(data)[0]);
    let data = intervalGoalDataset.map(data => data[Object.keys(data)[0]])
    console.log(data);
    data = data.map(dataArr => {
      if (dataArr && dataArr.length > 0) {
        console.log(dataArr);
        return dataArr.reduce((acc, cur) => acc += Number(cur), 0) / dataArr.length;
      } else {
        return 0;
      }
    });
    console.log("interval goal dataset");
    console.log(labels);
    console.log(data);
    let intervalAccuracyData = {
      labels: labels,
      datasets: [{
        label: "Interval Accuracy",
        data: data,
        backgroundColor: "#32a852"
      }]
    }
    return intervalAccuracyData;
  }

  componentDidMount() {
    console.log(this.state.user_id);

    this.props.getNoteAcc(this.state.user_id)
    this.props.getPitchAcc(this.state.user_id);
    console.log("PROPS");
    console.log(this.props);
    for (let i = -12; i < 13; i++) {
      this.props.getIntervalAcc(this.state.user_id, i);
    }
    console.log(this.props.intervalAcc);
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
                <Image src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80" className="micImg" fluid />
              </Col>
            </Row>
            <Row>
              {this.state.showNoteAccGraph ?
                <Col md={{ span: 6 }} className="note-goal-data border rounded border-dark">
                  <Line data={this.buildNoteGoalData()} options={noteGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 6 }} className="note-goal-data border rounded border-dark">
                  <ProgressBar now={Math.floor(this.props.noteAcc[this.props.noteAcc.length - 1] / 90 * 100)} label={`${Math.floor(this.props.noteAcc[this.props.noteAcc.length - 1] / 90 * 100)}%`} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: true })}>View Completeion Percentage</Button>
                </Col>
              }



              {this.state.showPitchAccGraph ?
                <Col md={{ span: 6 }} className="pitch-goal-data border rounded border-dark">
                  <Line data={this.buildPitchGoalData()} options={pitchGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 6 }} className="pitch-goal-data border rounded border-dark">
                  <ProgressBar now={Math.floor(this.props.pitchAcc[this.props.pitchAcc.length - 1] / 90 * 100)} label={`${Math.floor(this.props.pitchAcc[this.props.pitchAcc.length - 1] / 90 * 100)}%`} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: true })}>View Completeion Percentage</Button>
                </Col>
              }
            </Row>
            <Row>
              <Col md={{ span: 12 }} className="interval-accuracy-data border rounded border-dark">
                <Bar data={this.buildIntervalGoalData()} options={intervalAccuracyOptions} width={1000} height={400}/>
              </Col>
            </Row>
          </Col>
        </Row>
        <button onClick={this.buildIntervalGoalData}>interval goal data</button>
      </div >

    )
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser },
    dispatch
  );
}


function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc,
    midi: state.exerciseMidi.midi,
    userName: state.user.name,
    user_id: state.user.user_id,
    intervalAcc: state.intervalAcc,
    noteAcc: state.noteAcc,
    pitchAcc: state.pitchAcc
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Goals);