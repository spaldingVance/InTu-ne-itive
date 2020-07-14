import React from 'react';
import { Midi } from 'react-abc';

const notation = 'C ^G, _A, G,| ^E, F, A, G,|';

export default ({ Player }) => <Midi notation={notation} />;
