function generateMidi(maxInterval=4, maxIntervalSharp=false) {
  let exerciseNotes = [];
  for (let i = 0; i < 7; i++) {
    let note = Math.ceil((Math.random() * (maxInterval)));
    if(Math.round(Math.random())) {
      exerciseNotes.push(note);
    } else {
      exerciseNotes.push(0-note)
    }
  }
  console.log(exerciseNotes);
  let cumulative = 0;
  let cumulativeIntervals = exerciseNotes.map(interval => {
    if(cumulative + interval > 8) {
      return cumulative -= interval
    } else {
      return cumulative += interval
    }
  })
  console.log('cumulative');
  console.log(cumulativeIntervals);
  translateIntervalsToAbc(cumulativeIntervals)
}

function translateIntervalsToAbc(cumulativeIntervals) {
  var myNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let abcData = cumulativeIntervals.map((myNote, index) => {
    let noteLetter;
    if (myNote < 0) {
      noteLetter = myNotes[myNotes.length + myNote] + ',';
    } else {
      noteLetter = myNotes[myNote % myNotes.length];
    }
    // return {note: noteLetter, acc: myNote.acc}
    if ((index + 2) % 4 === 0) {
      noteLetter = noteLetter + "|";
    }
    return noteLetter;
  })
  abcData.unshift('C');
  console.log(abcData.join(" "));
  let notationString = abcData.join(" ");
  return notationString;
}

generateMidi();