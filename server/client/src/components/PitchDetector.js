import React from 'react';
import { connect } from "react-redux";

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var detectorElem,
  canvasElem,
  waveCanvas,
  pitchElem,
  noteElem,
  detuneElem,
  detuneAmount;

var pitchArr = [];

var stop = false;

class PitchDetector extends React.Component {
  constructor(props) {
    super(props)
    console.log("pitch detector props: " + this.props);

  }

  componentDidMount() {
    audioContext = new AudioContext();

  }

  componentDidUpdate() {
    let pitches = this.props.exercise.split(' ').slice(1).map(pitch => pitch[0]);
    console.log(pitches);
  
  }
  render() {
    return (
      <div>
        <h1>Pitch Detector</h1>
        <button onClick={toggleLiveInput}>toggle live input</button>
        <button onClick={stopLiveInput}>stop live input</button>
        <button onClick={viewPitchArr}>View Pitch Arr</button>
        <h1>{this.props.exercise}</h1>
      </div>
    )
  }
}

function toggleLiveInput() {
  getUserMedia(
    {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, gotStream);
}

function stopLiveInput() {
  stop = true;
  getUserMedia(
    {
      "audio": {
        "mandatory": {
          "googEchoCancellation": "false",
          "googAutoGainControl": "false",
          "googNoiseSuppression": "false",
          "googHighpassFilter": "false"
        },
        "optional": []
      },
    }, gotStream);
  setTimeout(collectPitches, 2000)
}

function collectPitches() {
  var myInterval = setInterval(updatePitch, 16);
  setTimeout(() => clearTimeout(myInterval), 10000);
}

function getUserMedia(dictionary, callback) {
  try {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;
    navigator.getUserMedia(dictionary, callback, error);
  } catch (e) {
    alert('getUserMedia threw exception :' + e);
  }
}

function gotStream(stream) {
  console.log("GOT STREAM");
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to the destination.
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  mediaStreamSource.connect(analyser);
  // for (let i = 0; i < 2000; i++) {
  //   updatePitch();
  // }
  console.log("DONE");
}

function error() {
  alert('Stream generation failed.');
}

var rafID = null;
var tracks = null;
var buflen = 1024;
var buf = new Float32Array(buflen);

var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function noteFromPitch(frequency) {
  var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function frequencyFromNoteNumber(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

var centsCollection = [];
var avgCentsCollection = [];

function centsOffFromPitch(frequency, note) {
  let cents = Math.floor(1200 * Math.log(frequency / frequencyFromNoteNumber(note)) / Math.log(2));
  centsCollection.unshift(cents);
  var avgLength = 20;
  if (centsCollection.length < 20) {
    avgLength = centsCollection.length;
  }
  let avgCentsOff = centsCollection.slice(0, 20).reduce((acc, cur) => acc + cur) / avgLength;
  avgCentsCollection.push(avgCentsOff);
  if (avgCentsOff >= 5 && avgCentsOff > 0) {
    // document.getElementById('sharp-notifier').style.color = "red";
    // document.getElementById('flat-notifier').style.color = "white";
    return cents;
  } else if (avgCentsOff < 0 && avgCentsOff < -5) {
    // document.getElementById('flat-notifier').style.color = "red";
    // document.getElementById('sharp-notifier').style.color = "white";
    return cents;
  } else {
    // document.getElementById('flat-notifier').style.color = "white";
    // document.getElementById('sharp-notifier').style.color = "white";
    return cents;
  }
}

var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

function autoCorrelate(buf, sampleRate) {
  console.log("SAMPLE RATE: " + sampleRate)
  var SIZE = buf.length;
  var MAX_SAMPLES = Math.floor(SIZE / 2);
  var best_offset = -1;
  var best_correlation = 0;
  var rms = 0;
  var foundGoodCorrelation = false;
  var correlations = new Array(MAX_SAMPLES);

  for (var i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) // not enough signal
    return -1;

  var lastCorrelation = 1;
  for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
    var correlation = 0;

    for (var i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs((buf[i]) - (buf[i + offset]));
    }
    correlation = 1 - (correlation / MAX_SAMPLES);
    correlations[offset] = correlation; // store it, for the tweaking we need to do below.
    if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
      // Now we need to tweak the offset - by interpolating between the values to the left and right of the
      // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
      // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
      // (anti-aliased) offset.

      // we know best_offset >=1, 
      // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and 
      // we can't drop into this clause until the following pass (else if).
      var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
      return sampleRate / (best_offset + (8 * shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    // console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
    return sampleRate / best_offset;
  }
  return -1;
  //	var best_frequency = sampleRate/best_offset;
}

const MaxPitch = 659;
const MinPitch = 98;

function updatePitch(time) {
  analyser.getFloatTimeDomainData(buf);
  var ac = autoCorrelate(buf, audioContext.sampleRate);
  if (ac == -1) {

  } else {
    let pitch = ac;
    pitchArr.push({ pitch: pitch, time: performance.now() });
    var note = noteFromPitch(pitch);
    findNextPitch(noteStrings[note % 12]);
    var detune = centsOffFromPitch(pitch, note);
  }
}

function filterOutliers(someArray) {

  if (someArray.length < 4)
    return someArray;

  let values, q1, q3, iqr, maxValue, minValue;

  values = someArray.slice().sort((a, b) => a - b);//copy array fast and sort

  if ((values.length / 4) % 1 === 0) {//find quartiles
    q1 = 1 / 2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
    q3 = 1 / 2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
  } else {
    q1 = values[Math.floor(values.length / 4 + 1)];
    q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
  }

  iqr = q3 - q1;
  maxValue = q3 + iqr * 1.5;
  minValue = q1 - iqr * 1.5;

  return values.filter((x) => (x >= minValue) && (x <= maxValue));
}

function findConsistentBlock(note, myPitchArr) {
  let myPitch = 0;
  for (let i = 5; i < myPitchArr.length - 5; i++) {
    let block = myPitchArr.slice(i - 5, i + 5).map(pitch => pitch.pitch);
    let avg = block.reduce((acc, cur) => acc + cur) / block.length;
    console.log(avg);
    var myNote = noteFromPitch(avg);
    myPitch = frequencyFromNoteNumber(myNote)
    console.log(myNote);
    console.log(noteStrings[myNote % 12]);
    if (noteStrings[myNote % 12] === note) {
      console.log("BLOCK: " + block);
      console.log("AVG: " + avg);
      console.log(i - 5);
      let upperIndex = findUpperIndex(i + 5, note, myPitchArr)
      let lowerIndex = findLowerIndex(i - 5, upperIndex, note, myPitchArr);
      let unmappedBlock = myPitchArr.slice(lowerIndex, upperIndex);
      block = unmappedBlock.map(pitch => pitch.pitch)
      avg = block.reduce((acc, cur) => acc + cur) / block.length;
      console.log(avg);
      console.log(block.length);
      console.log(block[block.length - 1]);
      console.log(block);
      console.log(myPitchArr[upperIndex + 1] + " " + myPitchArr[upperIndex + 2] + " " + myPitchArr[upperIndex + 3])
      findTimeWindow(lowerIndex, upperIndex, pitchArr);
      return { upperIndex: upperIndex, block: unmappedBlock };
    }
  }
}

function findUpperIndex(upper, note, myPitchArr) {
  let lower = upper - 10;
  let upperIndex = upper;
  let avg;
  let myPitch = 0;
  for (let i = upper; i < myPitchArr.length; i++) {
    let block = myPitchArr.slice(lower, i).map(pitch => pitch.pitch);
    if (myPitch > 0 && myPitchArr[i].pitch > myPitch * 1.05 || myPitchArr[i].pitch < myPitch * 0.95) {
      // console.log(myPitchArr[i-1].pitch);
      // console.log(myPitchArr[i].pitch);
      // console.log(myPitchArr[i+1].pitch);
      // console.log(myPitchArr[i+2].pitch);
      console.log("BAH up");
      break;
    }
    avg = block.reduce((acc, cur) => acc + cur) / block.length;
    console.log(avg);
    var myNote = noteFromPitch(avg);
    myPitch = frequencyFromNoteNumber(myNote)
    if (noteStrings[myNote % 12] === note) {
      upperIndex = i;
    } else {
      break;
    }
  }
  return upperIndex;
}

function findLowerIndex(lower, upper, note, myPitchArr) {
  let lowerIndex = lower;
  let avg;
  let myPitch = 0;
  for (let i = lower; i > 0; i--) {
    let block = myPitchArr.slice(i, upper).map(pitch => pitch.pitch);
    if (myPitch > 0 && myPitchArr[i].pitch < myPitch * 0.95 || myPitchArr[i].pitch > myPitch * 1.05) {
      // console.log(myPitchArr[i + 1].pitch);
      // console.log(myPitchArr[i].pitch);
      // console.log(myPitchArr[i-1].pitch);
      // console.log(myPitchArr[i-2].pitch);
      console.log("BAH down");
      break;
    }
    avg = block.reduce((acc, cur) => acc + cur) / block.length;
    console.log(avg);
    var myNote = noteFromPitch(avg);
    myPitch = frequencyFromNoteNumber(myNote);
    if (noteStrings[myNote % 12] === note) {
      lowerIndex = i;
    } else {
      break;
    }
  }
  return lowerIndex;
}

function findTimeWindow(lower, upper, myPitchArr) {
  let windowStart = myPitchArr[lower].time
  let windowEnd = myPitchArr[upper].time
  let timeTotal = windowEnd - windowStart;
  console.log("TOTAL TIME: " + timeTotal);
}

var noteArr = [];

var noteTimes = [
  { note: 'C', playTime: 480 },
  { note: 'D', playTime: 480 },
  { note: 'E', playTime: 960 },
  { note: 'G', playTime: 480 },
  { note: 'E', playTime: 480 },
  { note: 'C', playTime: 960 },
  { note: 'D', playTime: 720 },
  { note: 'E', playTime: 240 },
  { note: 'D', playTime: 720 },
  { note: 'C', playTime: 240 },
  { note: 'C', playTime: 1823 }
]

function findNotes() {
  let myPitchArr = pitchArr.slice();
  noteTimes.forEach(note => {
    let obj = findConsistentBlock(note.note, myPitchArr);
    let block = [];
    if (obj && Object.keys(obj).includes("block")) {
      block = obj.block;
      let upperIndex = obj.upperIndex;
      let timeWindow = block[block.length - 1].time - block[0].time;
      let windowStart = block[0].time;
      let windowEnd = block[block.length - 1].time
      noteArr.push({ note: note.note, block: block, timeWindow: timeWindow, start: windowStart, end: windowEnd })
      myPitchArr = myPitchArr.slice(upperIndex);
    }
  })
  console.log(noteArr);
  let adjustedTimeWindows = [];
  noteArr.forEach((note, index) => {
    if (index != noteArr.length - 1) {
      let myWindow = noteArr[index + 1].start - noteArr[index].start;
      adjustedTimeWindows.push(myWindow);
    }
  })
  console.log(adjustedTimeWindows)
  let myStartIndex = pitchArr.findIndex(pitch => pitch.time === noteArr[0].start);
  let myEndIndex = pitchArr.findIndex(pitch => pitch.time === noteArr[noteArr.length - 1].end);
  console.log(myStartIndex);
  console.log(myEndIndex);

  let firstTimeWindow = noteArr[1].timeWindow;
  let firstArrLength = noteArr[1].block.length;
  let relativeTimes = noteArr.map(note => note.timeWindow / firstTimeWindow);
  let relativeLengths = noteArr.map(note => note.block.length / firstArrLength);
  console.log(relativeTimes);
  console.log(relativeLengths);
  let combined = relativeTimes.map((time, index) => (time + relativeLengths[index]) / 2)
  console.log(combined);
  let reducedCombined = combined.map(time => Math.round(time * 2) / 2)
  console.log(reducedCombined);
}

let myPitches = ['A', 'B', 'C', 'D', 'E'];

function findNextPitch(note) {
  if (myPitches[0] === note) {
    console.log("found pitch " + myPitches[0] + " from " + myPitches);
    myPitches.shift();
  }

}

function viewPitchArr() {
  console.log(pitchArr);
}


function mapStateToProps(state) {
  return {
    exercise: state.exercise
  };
}


export default connect(mapStateToProps, null)(PitchDetector);