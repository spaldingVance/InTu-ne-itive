import React from 'react';
import { Notation } from 'react-abc';
import { Button } from 'react-bootstrap';
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Player from './Player';

import getExercise from "../actions/index"

const notation = 'C D E F  | G A B c|';
const engraverParams = { add_classes: true }

class Score extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      notation: ""
    }

    this.loadExercise = this.loadExercise.bind(this);
  }

  loadExercise(level) {
    this.props.getExercise(level);
    console.log(this.props.exercise);
  }
  render() {
    if (this.props.exercise !== "") {
      console.log(this.props.exercise);
    return (
      <div>
        <Notation notation={this.props.exercise} engraverParams={engraverParams} />
        <Button onClick={startVisualPlaying}>Start</Button>
        <Button onClick={() => this.loadExercise(2)}>Load Exercise</Button>
        <Player notation={this.props.exercise} startVisualPlaying={startVisualPlaying}/>
      </div>

    )
    } else {
      return (
        <div>
          <Button onClick={() => this.loadExercise(2)}>Load Exercise</Button>
        </div>
  
      )
    }
  }
}



let myData = [{ "interval": -2, "acc": 2 }, { "interval": 1, "acc": 0 }, { "interval": -1, "acc": 1 }, { "interval": -2, "acc": 2 }, { "interval": 1, "acc": 1 }, { "interval": 2, "acc": 1 }, { "interval": -1, "acc": 1 }];


function startVisualPlaying() {
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
    }
    clearInterval(timedInterval);
    timedInterval = setInterval(change, 1000);
  })();
}


function mapStateToProps(state) {
    return {
      exercise: state.exercise
    };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getExercise },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Score);