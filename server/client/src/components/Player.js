import React from 'react';
import { Midi } from 'react-abc';

// const notation = 'C ^G, _A, G,| ^E, F, A, G,|';

const midiParams = {qpm: 60};

export default function Player(props) {
  console.log("PLAYER PROPS: " + props)
  return <Midi notation={props.notation} midiParams={midiParams} />
}

// export default ({ Player }) => <Midi notation={notation} />;
