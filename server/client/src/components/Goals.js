import React from 'react';
import { connect } from "react-redux";
import { Line, Bar } from 'react-chartjs-2';
import { Row, Container, Col, Image, ProgressBar, Button, Card, Carousel } from 'react-bootstrap';
import "../styles/goalStyle.css";
import { bindActionCreators } from "redux";
import { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser, getBadges, setBadge } from '../actions/index'
import medalicon from "../assets/medalicon.png";
import check from "../assets/check.png";
import { Link } from "react-router-dom";

const badgeNames = {
  "badge1": "Minor 2nd Badge",
  "badge2": "Major 2nd Badge",
  "badge3": "Minor 3rd Badge",
  "badge4": "Major 3rd Badge",
  "badge5": "Perfect 4th Badge",
  "badge6": "Tritone Badge",
  "badge7": "Perfect 5th Badge",
  "badge8": "Minor 6th Badge",
  "badge9": "Major 6th Badge",
  "badge10": "Minor 7th Badge",
  "badge11": "Major 7th Badge",
  "badge12": "Octave Badge"
}

const badgeIntervals = {
  "badge1": 1,
  "badge2": 2,
  "badge3": 3,
  "badge4": 4,
  "badge5": 5,
  "badge6": 6,
  "badge7": 7,
  "badge8": 8,
  "badge9": 9,
  "badge10": 10,
  "badge11": 11,
  "badge12": 12
}

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
      user_id: localStorage.getItem('my_user_id'),
      noteAccGoalReached: false,
      pitchAccGoalReached: false
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
    if (Object.keys(this.props.intervalAcc).length === 0) return {};
    // console.log(this.props.intervalAcc);
    let sortedIntervalAcc = Object.keys(this.props.intervalAcc).sort((a, b) => Number(a) - Number(b));
    // console.log(sortedIntervalAcc)
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
    // console.log(intervalGoalDataset)
    let labels = intervalGoalDataset.map(data => Object.keys(data)[0]);
    let data = intervalGoalDataset.map(data => data[Object.keys(data)[0]])
    // console.log(data);
    data = data.map(dataArr => {
      if (dataArr && dataArr.length > 0) {
        console.log(dataArr);
        return dataArr.reduce((acc, cur) => acc += Number(cur), 0) / dataArr.length;
      } else {
        return 0;
      }
    });
    // console.log("interval goal dataset");
    // console.log(labels);
    // console.log(data);
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
    // console.log(this.state.user_id);
    this.props.getBadges(this.state.user_id);

    this.props.getNoteAcc(this.state.user_id)
    this.props.getPitchAcc(this.state.user_id);
    // console.log("PROPS");
    // console.log(this.props);
    for (let i = -12; i < 13; i++) {
      this.props.getIntervalAcc(this.state.user_id, i);
    }
    // console.log(this.props.intervalAcc);
    console.log("**** badges ****")
    console.log(this.props.badges);
  }

  componentDidUpdate() {
    if(this.props.noteAcc.length > 10) {
      let noteAcc = this.props.noteAcc.slice(this.props.noteAcc.length - 10);
      if((noteAcc.reduce((acc, cur) => acc += cur) / 10) > 90) {
        this.setState({noteAccGoalReached: true})
      }
    }

    if(this.props.pitchAcc.length > 10) {
      let pitchAcc = this.props.pitchAcc.slice(this.props.pitchAcc.length - 10);
      if((pitchAcc.reduce((acc, cur) => acc += cur) / 10) > 60) {
        this.setState({pitchAccGoalReached: true})
      }
    }
    if(this.state.pitchAccGoalReached && this.state.noteAccGoalReached) {
      
    }
  }

  render() {
    return (
      <div>
        <Row>

          <Col md={{ span: 10, offset: 1 }}>
            <Row>
              <Col md={{ span: 12 }} className="welcome-back">
                <h1>Welcome Back {this.props.userName}!</h1>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 12 }} className="badge-carousel">
                {/* <Row>
                  <h3>Unlocked Badges</h3>
                </Row>
                <Row>
                  {Object.entries(this.props.badges).filter(badge => badge[1] === "unlocked").map(badge => {
                    return (
                      <Card style={{ width: '25%' }} className="border rounded border-dark">
                        <Card.Img variant="top" src={medalicon} />
                        <Card.Body>
                          <Card.Title>{badgeNames[badge[0]]}</Card.Title>
                          <Button variant="primary">Train</Button>
                        </Card.Body>
                      </Card>
                    )
                  })}
                </Row> */}
                <Carousel>
                  <Carousel.Item className="badge-carousel-item" style={{ textAlign: "center" }}>
                    <Carousel.Caption>Unlocked Badges</Carousel.Caption>
                    <Row>
                      <Col md={{ span: 8, offset: 2 }}>
                        <Row>
                          {Object.entries(this.props.badges).filter(badge => badge[1] === "unlocked").map(badge => {
                            return (
                              <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                <Card.Img variant="top" src={medalicon} className="badge-img" />
                                <Card.Body className="badge-card-body" style={{ padding: "5px" }}>
                                  <Card.Title className="font-weight-bold">{badgeNames[badge[0]]}</Card.Title>
                                  <Link to={`/exercises/intervals/${badgeIntervals[badge[0]]}`}><Button variant="primary">Train</Button></Link>
                                </Card.Body>
                              </Card>
                            )
                          })}
                        </Row>
                      </Col>
                    </Row>
                  </Carousel.Item>
                  <Carousel.Item className="badge-carousel-item" style={{ textAlign: "center" }}>
                    <Carousel.Caption>Locked Badges</Carousel.Caption>
                    <Row>
                      <Col md={{ span: 8, offset: 2 }}>
                        <Row>
                          {Object.entries(this.props.badges).filter(badge => badge[1] === "locked").map(badge => {
                            return (
                              <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                <Card.Img variant="top" src={medalicon} className="badge-img" />
                                <Card.Body className="badge-card-body" style={{ padding: "5px", fontSize: "12px" }}>
                                  <Card.Title className="font-weight-bold">{badgeNames[badge[0]]}</Card.Title>
                                </Card.Body>
                              </Card>
                            )
                          })}
                        </Row>
                      </Col>
                    </Row>
                  </Carousel.Item>
                  <Carousel.Item className="badge-carousel-item" style={{ textAlign: "center" }}>
                    <Carousel.Caption>Completed Badges</Carousel.Caption>
                    <Row>
                      <Col md={{ span: 8, offset: 2 }}>
                        <Row>
                          {Object.entries(this.props.badges).filter(badge => badge[1] === "completed").map(badge => {
                            return (
                              <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                <Card.Img variant="top" src={medalicon} className="badge-img" />
                                <Card.Body className="badge-card-body" style={{ padding: "5px" }}>
                                  <Card.Title className="font-weight-bold">{badgeNames[badge[0]]}</Card.Title>
                                </Card.Body>
                              </Card>
                            )
                          })}
                        </Row>
                      </Col>
                    </Row>
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
            <Row>
              {this.state.showNoteAccGraph ?
                <Col md={{ span: 4 }} className="note-goal-data border rounded border-dark">
                  <h4>Note Accuracy</h4>
                  <br/>
                  <Line data={this.buildNoteGoalData()} options={noteGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 4 }} className="note-goal-data border rounded border-dark">
                  <h4>Note Accuracy</h4>
                  <br/>
                  {this.state.noteAccGoalReached ? <Image src={check}></Image> : ""}
                  <ProgressBar now={Math.floor(this.props.noteAcc[this.props.noteAcc.length - 1] / 90 * 100)} label={Math.floor(this.props.noteAcc[this.props.noteAcc.length - 1] / 90 * 100) ? `${Math.floor(this.props.noteAcc[this.props.noteAcc.length - 1] / 90 * 100)}%` : ""} />
                  <br />
                  <Button onClick={() => this.setState({ showNoteAccGraph: true })}>View Completion Percentage</Button>
                </Col>
              }
              <Col md={{ span: 4 }} className="border rounded border-dark train-level">
                <h2>Level: {this.props.level}</h2>
                <Link to={`/exercises/level/${this.props.level}`}><Button variant="primary">Train</Button></Link>
              </Col>



              {this.state.showPitchAccGraph ?
                <Col md={{ span: 4 }} className="pitch-goal-data border rounded border-dark">
                  <h4>Pitch Accuracy</h4>
                  <br />
                  <Line data={this.buildPitchGoalData()} options={pitchGoalOptions} height={300} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: false })}>View Progress Over Time</Button>
                </Col> :
                <Col md={{ span: 4 }} className="pitch-goal-data border rounded border-dark">
                  <h4>Pitch Accuracy</h4>
                  <br/>
                  {this.state.pitchAccGoalReached ? <Image src={check}></Image> : ""}
                  <ProgressBar now={Math.floor(this.props.pitchAcc[this.props.pitchAcc.length - 1] / 90 * 100)} label={Math.floor(this.props.pitchAcc[this.props.pitchAcc.length - 1] / 90 * 100) ? `${Math.floor(this.props.pitchAcc[this.props.pitchAcc.length - 1] / 90 * 100)}%` : ""} />
                  <br />
                  <Button onClick={() => this.setState({ showPitchAccGraph: true })}>View Completion Percentage</Button>
                </Col>
              }
            </Row>
            <Row>
              <Col md={{ span: 12 }} className="interval-accuracy-data border rounded border-dark">
                <Bar data={this.buildIntervalGoalData()} options={intervalAccuracyOptions} width={1000} height={400} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div >

    )
  }
}



function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser, getBadges, setBadge },
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
    pitchAcc: state.pitchAcc,
    badges: state.badges,
    level: state.user.level,
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Goals);