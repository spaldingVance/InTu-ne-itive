import React from 'react';
import { Notation } from 'react-abc';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Player from './Player';
import PitchDetector from './PitchDetector';

import { getExercise, getIntervalExercise, setTimeStamps } from "../actions/index"
import { Row, Container, Col } from 'react-bootstrap';

const notation = 'C D E F  | G A B c|';
const engraverParams = { add_classes: true }

let timeStamps = [];

class IntervalScore extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notation: "",
      level: this.props.match.params.interval
    }

    this.loadExercise = this.loadExercise.bind(this);
    this.startVisualPlaying = this.startVisualPlaying.bind(this);
  }
  startVisualPlaying(collectPitches = false) {
    if(collectPitches) timeStamps = [];
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
        if(collectPitches) {
          timeStamps.push(performance.now());
          console.log('pushing timestamp')
          console.log(timeStamps)
  
        }
      }
      clearInterval(timedInterval);
      timedInterval = setInterval(change, 1000);
    })();
    console.log("TIMESTAMPS_________")
    console.log(timeStamps);
    if(collectPitches) this.props.setTimeStamps(timeStamps);
  }

  loadExercise(level) {
    this.props.getIntervalExercise(level);
    console.log(this.props.exercise);
  }

  componentDidMount() {
    this.props.getIntervalExercise(this.state.level)
  }
  render() {
    if (this.props.exercise) {
      console.log(this.props.exercise);
      return (
        <Container fluid>
          <h1>Interval Score</h1>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Notation notation={this.props.exercise} engraverParams={engraverParams} />
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <Player startVisualPlaying={this.startVisualPlaying} />
              <Button onClick={() => this.startVisualPlaying(true)}>Start</Button>
              <Button onClick={() => this.loadExercise(this.state.level)}>Load Exercise</Button>
            </Col>
          </Row>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <PitchDetector intervalEx={true}/>
            </Col>
          </Row>
        </Container>


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
    { getIntervalExercise, setTimeStamps },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(IntervalScore);