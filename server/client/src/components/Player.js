import React from 'react';
import { Midi } from 'react-abc';
import abcjs from 'abcjs/midi';
import { render } from 'react-dom';
import { connect } from "react-redux";

// const notation = 'C ^G, _A, G,| ^E, F, A, G,|';

const midiParams = { qpm: 60 };

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.setOnClick = this.setOnClick.bind(this);
  }

  setOnClick = (startVisualPlaying) => {
    console.log(this.props);
    let button = document.getElementsByClassName('abcjs-midi-start')[0];
    console.log('button ' + button);
    if (button) {
      console.log("ADDING EVENT LISTENER")
      button.addEventListener('click', startVisualPlaying)
    }
  }

  componentDidMount() {
    console.log("COMPONENT DID MOUNT");
    this.setOnClick(this.props.startVisualPlaying);
  }

  componentDidUpdate() {
    console.log("COMPONENT DID UPDATE");
    this.setOnClick(this.props.startVisualPlaying);
  }

  render() {
    console.log(this.props.exercise);
    return (
      <div>
        <Midi key={this.props.exercise} notation={this.props.exercise} midiParams={midiParams} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc
  };
}

// function mapDispatchToProps(dispatch) {
// return bindActionCreators(
//   { getExercise },
//   dispatch
// );
// }

export default connect(mapStateToProps, null)(Player);

