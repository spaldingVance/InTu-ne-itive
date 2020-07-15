import React from 'react';
import { connect } from "react-redux";

class Goals extends React.Component {
  constructor(props) {
    super(props)
  }
}


function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc,
    midi: state.exerciseMidi.midi 
  };
}


export default connect(mapStateToProps, null)(Goals);