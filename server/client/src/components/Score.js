import React from 'react';
import { Notation } from 'react-abc';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Player from './Player';
import PitchDetector from './PitchDetector';

import { getExercise, setTimeStamps } from "../actions/index"
import { Row, Col } from 'react-bootstrap';
import "../styles/scoreStyle.css";

const engraverParams = { add_classes: true, responsive: "resize", staffwidth: "300" }

let timeStamps = [];

let isPlaying = false;

class Score extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notation: "",
      level: this.props.match.params.level
    }

    this.loadExercise = this.loadExercise.bind(this);
    this.startVisualPlaying = this.startVisualPlaying.bind(this);
  }

  startVisualPlaying(collectPitches = false) {
    if (isPlaying) {
      isPlaying = false;
      for (let i = 0; i < 4; i++) {
        let notes = document.getElementsByClassName("abcjs-n" + i);
        notes[0].style.fill = "black";
        notes[1].style.fill = "black";
      }
      return null;


    }
    isPlaying = true;
    if (collectPitches) timeStamps = [];
    var i = 0;
    let timedInterval;
    (function change() {
      if (!isPlaying) {
        isPlaying = false;
        for (let i = 0; i < 4; i++) {
          let notes = document.getElementsByClassName("abcjs-n" + i);
          notes[0].style.fill = "black";
          notes[1].style.fill = "black";
          clearInterval(timedInterval);
          return null;
        }
      }

      let measureIndex = 0;
      let noteIndex = i;
      if (i > 3) {
        measureIndex = Math.floor((i + 1) / 4);
        noteIndex = (i + 1) % 4 - 1;
        if (noteIndex === -1) {
          noteIndex = 3;
        }
      }
      if (noteIndex === 3 && measureIndex > 0) {
        measureIndex -= 1;
      }
      if (i === 8) {
        document.getElementsByClassName("abcjs-n3")[1].style.fill = "black";
        clearInterval(timedInterval);
        isPlaying = false;
        return null;
      } else {
        document.getElementsByClassName("abcjs-n" + noteIndex)[measureIndex].style.fill = "red";

        if (noteIndex > 0) {
          document.getElementsByClassName("abcjs-n" + (noteIndex - 1))[measureIndex].style.fill = "black";
        } else if (noteIndex === 0 && measureIndex > 0) {
          document.getElementsByClassName("abcjs-n" + (noteIndex + 3))[measureIndex - 1].style.fill = "black";
        }
        i++;
        if (collectPitches) {
          timeStamps.push(performance.now());
        }
      }
      clearInterval(timedInterval);
      timedInterval = setInterval(change, 1000);
    })();
    if (collectPitches) this.props.setTimeStamps(timeStamps);
  }

  loadExercise(level) {
    this.props.getExercise(level);
  }

  componentDidMount() {
    this.props.getExercise(this.state.level)
  }
  render() {
    if (this.props.exercise) {
      return (
        <div style={{ textAlign: "center" }} className="score-div">
          <Row>
            <Col md={{ span: 2 }} >
              <PitchDetector intervalEx={false} />
              <br/>
              <h5>To Get Started: </h5>
              <ul style={{textAlign: "left"}}>
                <li>Play the starting pitch</li>
                <li>If you would like to use a different octave, press "Match Octave" and sing/whistle the starting note back in the octave of your choice</li>
                <li>Press "Start Live Input" and then "Start Exercise" when you're ready to begin</li>
                <li>When you're done, press "Get Results"</li>
                <li>If you would like to switch our the exercise for another one, press "Load New Exercise"</li>
              </ul>
            </Col>
            <Col md={{ span: 10 }}>


              <Row style={{ textAlign: "center" }}>
                <Col md={{ span: 12 }} className="title-container">
                  <h1>Exercise: Level {this.state.level}</h1>
                  <h4>All Intervals will be less than </h4>
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 10, offset: 1 }} >
                  <Notation notation={this.props.exercise} engraverParams={engraverParams} className="notation-container" />
                </Col>
              </Row>
              <Row>
                <Col md={{ span: 10, offset: 1 }}>
                  <Player startVisualPlaying={this.startVisualPlaying} />
                  <Row>
                    <Col md={{ span: 6 }}>
                      <Button className="visual-playing-button" onClick={this.startVisualPlaying}>Start Exercise</Button>
                    </Col>
                    <Col md={{ span: 6 }}>
                      <Button className="exercise-button" onClick={() => this.loadExercise(this.state.level)}>Load New Exercise</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row >
        </div >


      )
    } else {
      return (
        <div>
          <Row>
            <Col md={{ span: 4, offset: 4 }}>
              <Button onClick={() => this.loadExercise(this.state.level)}>Load Exercise</Button>
            </Col>
          </Row>
        </div>
      )
    }
  }
}


function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc,
    level: state.user.level
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getExercise, setTimeStamps },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Score);