const { request } = require("express");

module.exports = function(router) {
  router.get("/api/exercise", (request, response, next) => {
    let level = request.body.level;
    let exerciseIntervals = generateMelody(Number(level));
    let abcData = translateToAbc(exerciseIntervals);
    console.log(abcData);
    response.send(abcData);
  })
}

function generateMelody(level, key) {
  let maxInterval = 2;
  let accidentals = false;
  switch(level) {
    case 1: 
      break;
    case 2:
      maxInterval = 3;
      break;
    case 3:
      maxInterval = 3;
      accidentals = true;
      break;
    case 4:
      maxInterval = 5;
      accidentals = true;
      break;
    case 5:
      maxInterval = 8;
      accidentals = true;
      break;
    case 6:
      maxInterval = 12;
      accidentals = true;
  }
  let exerciseNotes = [];
  for (let i = 0; i < 7; i++) {
    let note = Math.ceil((Math.random() * (maxInterval - 1)));
    exerciseNotes.push(note);
  }
  exerciseNotes = exerciseNotes.map(note => {
    if (accidentals) {
      let acc = Math.floor((Math.random() * 3))
      if (Math.round(Math.random())) {
        return {interval: (0 - note), acc: acc};
      } else {
        return {interval: note, acc: acc};
      }
    } else {
      if (Math.round(Math.random())) {
        return {interval: (0 - note), acc: 0};
      } else {
        return {interval: note, acc: 0};
      }
    }
  })
  let notesFixedRange = exerciseNotes.slice();
  for (let i = 2; i < exerciseNotes.length; i++) {
    if (exerciseNotes[i-2].interval < 0 && exerciseNotes[i-1].interval < 0 && exerciseNotes[i].interval < 0) {
      notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
    } else if (exerciseNotes[i-2].interval > 0 && exerciseNotes[i-1].interval > 0 && exerciseNotes[i].interval > 0) {
      notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
    } else if (exerciseNotes[i-2].interval === 0 && exerciseNotes[i-1].interval === 0 && exerciseNotes[i].interval === 0) {
      let nonZeroInterval = 0;
      while (nonZeroInterval === 0) {
        nonZeroInterval = Math.ceil((Math.random() * (maxInterval - 1)));
      }
      notesFixedRange[i].interval = nonZeroInterval;
    }
  }
  
  console.log(notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0))
  console.log(typeof notesFixedRange[0].interval)
  while (notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0) <= -6) {
    console.log("YEET")
    let negIndex = notesFixedRange.findIndex(note => note.interval < 0);
    notesFixedRange[negIndex].interval = 0 - notesFixedRange[negIndex].interval;
  }
  while (notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0) >= 6) {
    console.log("YOOT")
    let negIndex = notesFixedRange.findIndex(note => note.interval > 0);
    notesFixedRange[negIndex].interval = 0 - notesFixedRange[negIndex].interval;
  }
  return notesFixedRange;
}

function translateToAbc(data, key) {
  var myNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  console.log("DATA: " + data)
  let cumulative = 0;
  let cumulativeIntervals = data.map(data => {
    cumulative += data.interval;
    return { interval: cumulative, acc: data.acc }
  })
  console.log(cumulativeIntervals);
  let abcData = cumulativeIntervals.map((myNote, index) => {
    let noteLetter;
    if (myNote.interval < 0) {
      noteLetter = myNotes[data.length + myNote.interval - 1] + ',';
    } else {
      noteLetter = myNotes[myNote.interval];
    }
    // return {note: noteLetter, acc: myNote.acc}
    if (myNote.acc === 2) {
      noteLetter = '^' + noteLetter;
    } else if (myNote.acc === 1) {
      noteLetter = noteLetter;
    } else {
      noteLetter = "_" + noteLetter;
    }
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