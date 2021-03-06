import React from 'react';
import { connect } from "react-redux";
import { Line, Bar, defaults } from 'react-chartjs-2';
import { merge } from 'lodash';
import { Row, Container, Col, Image, ProgressBar, Button, Card, Carousel } from 'react-bootstrap';
import "../styles/goalStyle.css";
import { bindActionCreators } from "redux";
import { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser, getBadges, setBadge, levelUp } from '../actions/index'
import medalicon from "../assets/medalicon.png";
import medaliconDark from "../assets/medalicon-dark.png";
import medaliconUnlocked from "../assets/medal-icon-unlocked.png";
import { Link } from "react-router-dom";

merge(defaults, {
  global: {
    animation: false,
    line: {
      borderColor: '#343a40',
    },
    defaultFontColor: '#343a40',
    title: {
      fontSize: "18"
    },
    elements: {
      point: {
        borderColor: '#343a40'
      }
    }
  },
});

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
        suggestedMax: 100,
        suggestedMind: 20
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
  maintainAspectRatio: true,
  responsive: true
}


let pitchGoalOptions = {
  scales: {
    yAxes: [{
      ticks: {
        suggestedMax: 100,
        suggestedMin: 20
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
  maintainAspectRatio: true,
  responsive: true,
  defaultFontColor: "black"

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
    this.getNoteGoalPercentage = this.getNoteGoalPercentage.bind(this);
    this.getPitchGoalPercentage = this.getPitchGoalPercentage.bind(this);
  }


  buildNoteGoalData() {
    let noteAcc = this.props.noteAcc.slice().reverse();

    let noteGoalData = {
      labels: noteAcc.map((note, index) => index),
      datasets: [{
        label: "Note Accuracy",
        data: noteAcc,
        fill: false,
        borderColor: "#f7b307"
      },
      {
        label: "Note Accuracy Goal",
        data: noteAcc.map(note => 85),
        fill: false,
        borderColor: "#32a852"
      }]
    }
    return noteGoalData;
  }

  buildPitchGoalData() {
    let pitchAcc = this.props.pitchAcc.slice().reverse();
    let pitchGoalData = {
      labels: pitchAcc.map((pitch, index) => index),
      datasets: [{
        label: "Pitch Accuracy",
        data: pitchAcc,
        fill: false,
        borderColor: "#f7b307"
      },
      {
        label: "Pitch Accuracy Goal",
        data: pitchAcc.map(pitch => 70),
        fill: false,
        borderColor: "#32a852"
      }]
    }
    return pitchGoalData;
  }

  buildIntervalGoalData() {
    console.log(this.props.intervalAcc);
    if (Object.keys(this.props.intervalAcc).length === 0) return {};
    let sortedIntervalAcc = Object.keys(this.props.intervalAcc).sort((a, b) => Number(a) - Number(b));
    let intervalGoalDataset = sortedIntervalAcc.filter(key => key !== 0).map(key => {
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
    let labels = intervalGoalDataset.map(data => Object.keys(data)[0]);
    let data = intervalGoalDataset.map(data => data[Object.keys(data)[0]])
    data = data.map(dataArr => {
      if (dataArr && dataArr.length > 0) {
        return dataArr.reduce((acc, cur) => acc += Number(cur), 0) / dataArr.length;
      } else {
        return 0;
      }
    });
    let intervalAccuracyData = {
      labels: labels,
      datasets: [{
        label: "Interval Accuracy",
        data: data,
        backgroundColor: "mediumseagreen"
      }]
    }
    console.log("interval accuracy data");
    console.log(intervalAccuracyData);
    return intervalAccuracyData;
  }

  componentDidMount() {
    this.props.getBadges(this.state.user_id);
    this.props.getNoteAcc(this.state.user_id)
    this.props.getPitchAcc(this.state.user_id);
    for (let i = -12; i < 13; i++) {
      this.props.getIntervalAcc(this.state.user_id, i);
    }
  }

  componentDidUpdate() {
    console.log("pitch acc");
    console.log(this.props.pitchAcc);
    console.log("note acc");
    console.log(this.props.noteAcc);
    if (this.props.noteAcc.length >= 10 && this.getNoteGoalPercentage() > 85 && !this.state.noteAccGoalReached) {
      this.setState({ noteAccGoalReached: true })
    }

    if (this.props.pitchAcc.length >= 10 && this.getPitchGoalPercentage() > 70 && !this.state.pitchAccGoalReached) {
      this.setState({ pitchAccGoalReached: true })
    }

    let unlockedBadges = Object.entries(this.props.badges).filter(badge => badge[1] === "unlocked")

    let numUnlockedBadges = unlockedBadges.length;
    if (this.state.pitchAccGoalReached && this.state.noteAccGoalReached && numUnlockedBadges === 0) {
      this.props.levelUp(this.state.user_id, this.props.level);
    }

    let intervalBadges = unlockedBadges.map(badge => badgeIntervals[badge[0]])

    intervalBadges.forEach(interval => {
      if (this.props.intervalAcc[interval] && this.props.intervalAcc[0 - interval]) {
        let intervalAcc = this.props.intervalAcc[interval].slice();
        let negIntervalAcc = this.props.intervalAcc[0 - interval].slice();
        if (intervalAcc.length >= 5 || negIntervalAcc.length >= 5) {


          intervalAcc = intervalAcc.slice(intervalAcc.length - 5);

          negIntervalAcc = negIntervalAcc.slice(negIntervalAcc.length - 5);
          intervalAcc = intervalAcc.concat(negIntervalAcc)
          if ((intervalAcc.reduce((acc, cur) => acc += cur) / 10) >= 70) {
            let badgeForInterval = Object.entries(badgeIntervals).find(badgeInterval => badgeInterval[1] === interval)[0];
            this.props.setBadge(this.props.user_id, badgeForInterval, "completed");
          }
        }
      }
    })
  }

  getNoteGoalPercentage() {
    let length = this.props.noteAcc.length;
    if (length === 0) {
      return "0"
    }
    let lastEntries = []
    if (length > 10) {
      lastEntries = this.props.noteAcc.slice(0, 10).map(percent => Number(percent))
    } else {
      lastEntries = this.props.noteAcc.slice().map(percent => Number(percent));
    }
    let avg = lastEntries.reduce((acc, cur) => acc += cur) / lastEntries.length;
    return avg;
  }

  getPitchGoalPercentage() {
    let length = this.props.pitchAcc.length;
    if (length === 0) {
      return "0"
    }
    let lastEntries = []
    if (length > 10) {
      lastEntries = this.props.pitchAcc.slice(0, 10).map(percent => Number(percent))
    } else {
      lastEntries = this.props.pitchAcc.slice().map(percent => Number(percent));
    }
    console.log("last entries");
    console.log(lastEntries);
    let avg = lastEntries.reduce((acc, cur) => acc += cur) / lastEntries.length;
    return avg;
  }

  render() {
    return (
      <div>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Row>
              <Col md={{ span: 12 }} className="welcome-back">
                <h1 style={{ color: "#343a40" }}>Welcome Back {this.props.userName}!</h1>
              </Col>
            </Row>
            <Row>
              <Col md={{ span: 12 }} className="badge-carousel">

                <div className="goal-data-container rounded">
                  <Carousel>
                    <Carousel.Item className="badge-carousel-item" style={{ textAlign: "center" }}>
                      <Carousel.Caption style={{ color: "#343a40" }}><h2>Unlocked Badges</h2></Carousel.Caption>
                      <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                          <Row>
                            {Object.entries(this.props.badges).filter(badge => badge[1] === "unlocked").length > 0 ?
                              Object.entries(this.props.badges).filter(badge => badge[1] === "unlocked").map(badge => {
                                return (
                                  <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                    <Card.Img variant="top" src={medaliconDark} className="badge-img" />
                                    <Card.Body className="badge-card-body" style={{ padding: "5px" }}>
                                      <Card.Title className="font-weight-bold">{badgeNames[badge[0]]}</Card.Title>
                                      <Link to={`/exercises/intervals/${badgeIntervals[badge[0]]}`}><Button variant="primary">Train</Button></Link>
                                    </Card.Body>
                                  </Card>
                                )
                              }) :
                              <Col md={{ span: 12 }} style={{ textAlign: "center" }}>
                                <h1>You've completed all your unlocked badges! Level up to unlock more!</h1>
                              </Col>
                            }
                          </Row>
                        </Col>
                      </Row>
                    </Carousel.Item>
                    <Carousel.Item className="badge-carousel-item" style={{ textAlign: "center" }}>
                      <Carousel.Caption style={{ color: "#343a40" }}><h2>Locked Badges</h2></Carousel.Caption>
                      <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                          <Row>
                            {Object.entries(this.props.badges).filter(badge => badge[1] === "locked").map(badge => {
                              return (
                                <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                  <Card.Img variant="top" src={medaliconUnlocked} className="badge-img" />
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
                      <Carousel.Caption style={{ color: "#343a40" }}><h2>Completed Badges</h2></Carousel.Caption>
                      <Row>
                        <Col md={{ span: 8, offset: 2 }}>
                          <Row>
                            {Object.entries(this.props.badges).filter(badge => badge[1] === "completed").length > 0 ?
                              Object.entries(this.props.badges).filter(badge => badge[1] === "completed").map(badge => {
                                return (
                                  <Card style={{ width: '12%' }} className="border rounded border-dark badge-card mx-auto">
                                    <Card.Img variant="top" src={medalicon} className="badge-img" />
                                    <Card.Body className="badge-card-body" style={{ padding: "5px" }}>
                                      <Card.Title className="font-weight-bold">{badgeNames[badge[0]]}</Card.Title>
                                      <Link to={`/exercises/intervals/${badgeIntervals[badge[0]]}`}><Button variant="primary">Train</Button></Link>
                                    </Card.Body>
                                  </Card>
                                )
                              }) :
                              <Col md={{ span: 12 }} style={{ textAlign: "center" }}>
                                <h1>You don't have any completed badges yet, <br/> starting training your unlocked badges to complete them!</h1>
                              </Col>
                            }
                          </Row>
                        </Col>
                      </Row>
                    </Carousel.Item>
                  </Carousel>
                </div>
              </Col>
            </Row>
            <Row>
              {this.state.showNoteAccGraph ?

                <Col md={{ span: 4 }} className="note-goal-data">
                  <div className="goal-data-container rounded">
                    <h4 style={{ color: "mediumseagreen" }}>Note Accuracy</h4>
                    <br />
                    <Line data={this.buildNoteGoalData()} options={noteGoalOptions} height={300} />
                    <br />
                    <Button className="dash-button-bottom" onClick={() => this.setState({ showNoteAccGraph: false })}>View Completion Percentage</Button>
                  </div>
                </Col> :

                <Col md={{ span: 4 }} className="note-goal-data">
                  <div className="goal-data-container rounded">
                    <h4 style={{ color: "mediumseagreen" }}>Note Accuracy: {Math.round(this.getNoteGoalPercentage())}%</h4>
                    <br />
                    <h5>Target: 85%</h5>
                    <br />
                    <ProgressBar now={this.getNoteGoalPercentage() / 85 * 100} label={Math.round(this.getNoteGoalPercentage() / 85 * 100) + "%"} />
                    <br />
                    <h6>Number of Exercises: {this.props.noteAcc.length}</h6>
                    <h6>10 Needed to Level Up</h6>
                    <br />
                    {this.state.noteAccGoalReached ? <h5>Completed!</h5> : ""}
                    <Button className="dash-button-bottom" onClick={() => this.setState({ showNoteAccGraph: true })}>View Progress Over Time</Button>
                  </div>
                </Col>
              }
              <Col md={{ span: 4 }} className="train-level">
                <div className="goal-data-container rounded">
                  <h4 style={{ textAlign: "center", color: "mediumseagreen" }}>To Level Up:</h4>
                  <br />
                  <ul>
                    <li>Receive an Average Note Accuracy Score of at Least 85% on Your Last 10 Exercises</li>
                    <li>Receive an Average Pitch Accuracy Score of at Least 70% on Your Last 10 Exercises</li>
                    <li>Complete All Unlocked Badges: Badges Need an Interval Accuracy of at Least 70% after at least 3 Exercises </li>
                  </ul>
                  <div style={{ textAlign: "center" }}>
                    <Link to={`/exercises/level/${this.props.level}`} ><Button className="dash-button-bottom" >Train Level {this.props.level}</Button></Link>
                  </div>
                </div>
              </Col>



              {this.state.showPitchAccGraph ?
                <Col md={{ span: 4 }} className="pitch-goal-data">
                  <div className="goal-data-container rounded">
                    <h4 style={{ color: "mediumseagreen" }}>Pitch Accuracy: {Math.round(this.getPitchGoalPercentage())}%</h4>
                    <br />
                    <Line data={this.buildPitchGoalData()} options={pitchGoalOptions} height={300} />
                    <br />
                    <Button className="dash-button-bottom" onClick={() => this.setState({ showPitchAccGraph: false })}>View Completion Percentage</Button>
                  </div>
                </Col> :
                <Col md={{ span: 4 }} className="pitch-goal-data">
                  <div className="goal-data-container rounded">
                    <h4 style={{ color: "mediumseagreen" }}>Pitch Accuracy: {Math.round(this.getPitchGoalPercentage())}%</h4>
                    <br />
                    <h5>Target: 70%</h5>
                    <br />
                    <ProgressBar now={this.getPitchGoalPercentage() / 70 * 100} label={Math.round(this.getPitchGoalPercentage() / 70 * 100) + "%"} />
                    <br />
                    <h6>Number of Exercises: {this.props.pitchAcc.length}</h6>
                    <h6>10 Needed to Level Up</h6>
                    <br />
                    {this.state.pitchAccGoalReached ? <h5>Completed!</h5> : ""}
                    <Button className="dash-button-bottom" onClick={() => this.setState({ showPitchAccGraph: true })}>View Progress Over Time</Button>
                  </div>
                </Col>
              }
            </Row>
            <Row>
              <Col md={{ span: 12 }} className="interval-accuracy-data">
                <div className="goal-data-container rounded">
                  {
                  Object.values(this.props.intervalAcc).filter(arr => arr.length > 0).length > 0 ?
                    <Bar data={this.buildIntervalGoalData()} options={intervalAccuracyOptions} width={1000} height={400} />
                    : <h1 style={{textAlign: "center"}}> <br/> You don't have any interval accuracy data yet, <br/> start training interval badges to see your interval accuracy data!</h1>
                  }
                </div>
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
    { getIntervalAcc, getNoteAcc, getPitchAcc, setUser, getUser, getBadges, setBadge, levelUp },
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