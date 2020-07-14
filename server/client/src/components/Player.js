import React from 'react';
import { Midi } from 'react-abc';
import abcjs from 'abcjs/midi';
import { render } from 'react-dom';

// const notation = 'C ^G, _A, G,| ^E, F, A, G,|';

const midiParams = { qpm: 60 };

export default class Player extends React.Component {
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
    console.log(this.props)
    console.log("COMPONENT DID MOUNT");
    this.setOnClick(this.props.startVisualPlaying);
  }

  render() {
    return (
      <div>
        <Midi notation={this.props.notation} midiParams={midiParams} />
      </div>
    )
  }
}

