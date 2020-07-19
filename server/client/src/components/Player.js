import React from 'react';
import { Midi } from 'react-abc';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getExercise } from "../actions/index"


const midiParams = { qpm: 60 };

class Player extends React.Component {
  constructor(props) {
    super(props)
    this.setOnClick = this.setOnClick.bind(this);
  }

  setOnClick = (startVisualPlaying) => {
    let button = document.getElementsByClassName('abcjs-midi-start')[0];
    if (button) {
      button.addEventListener('click', startVisualPlaying)
    }
  }

  componentDidMount() {
    this.setOnClick(this.props.startVisualPlaying);
  }

  componentDidUpdate() {
    this.setOnClick(this.props.startVisualPlaying);
  }

  render() {
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { getExercise },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);

