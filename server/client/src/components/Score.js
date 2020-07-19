import React from 'react';
import { Notation } from 'react-abc';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Player from './Player';
import PitchDetector from './PitchDetector';

import { getExercise, setTimeStamps } from "../actions/index"
import { Row, Container, Col } from 'react-bootstrap';

const engraverParams = { add_classes: true }

let timeStamps = [];

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
    if (collectPitches) timeStamps = [];
    console.log("Collect pitches is: " + collectPitches)
    console.log("STARTED");
    var i = 0;
    let timedInterval;
    (function change() {

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
      console.log("noteIndex " + noteIndex)
      console.log("measureIndex " + measureIndex)
      if (i === 8) {
        // setTimeout(() => document.getElementsByClassName("abcjs-p" + (i-1))[0].style.fill = "black", 1000)
        document.getElementsByClassName("abcjs-n3")[1].style.fill = "black";
        clearInterval(timedInterval);
        return null;
      } else {
        console.log(i);

        console.log("abcjs-n" + noteIndex);
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
    console.log("TIMESTAMPS_________")
    console.log(timeStamps);
    if (collectPitches) this.props.setTimeStamps(timeStamps);
  }

  loadExercise(level) {
    this.props.getExercise(level);
    console.log(this.props.exercise);
  }

  componentDidMount() {
    this.props.getExercise(this.state.level)
  }
  render() {
    if (this.props.exercise) {
      console.log(this.props.exercise);
      return (
        <div style={{textAlign: "center"}}>
            <h1>Exercise: Level {this.state.level}</h1>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
            <Button onClick={() => this.loadExercise(this.state.level)}>Load New Exercise</Button>
              <Notation notation={this.props.exercise} engraverParams={engraverParams}/>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Player startVisualPlaying={this.startVisualPlaying} />
              <Button onClick={this.startVisualPlaying}>Start Exercise</Button>
              
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <PitchDetector intervalEx={false}/>
            </Col>
          </Row>
        </div>


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

let myData = [{ "interval": -2, "acc": 2 }, { "interval": 1, "acc": 0 }, { "interval": -1, "acc": 1 }, { "interval": -2, "acc": 2 }, { "interval": 1, "acc": 1 }, { "interval": 2, "acc": 1 }, { "interval": -1, "acc": 1 }];



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