import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setIntervalAcc, setNoteAcc, setPitchAcc } from '../actions/index'
import { Row, Button } from 'react-bootstrap';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var mediaStreamSource = null;


var pitchArr = [];

var isPlaying = false;

var updatePitchInterval;

let findOctavePitches = [];


class PitchDetector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startingNote: 60,
      audioFilters: "false"
    }
    this.startLiveInput = this.startLiveInput.bind(this);
    this.matchOctave = this.matchOctave.bind(this);
    this.setOctave = this.setOctave.bind(this);
    this.getTimeWindowPitches = this.getTimeWindowPitches.bind(this);
    this.toggleOscillator = this.toggleOscillator.bind(this);
  }

  matchOctave() {
    findOctavePitches = [];

    audioContext = new AudioContext();
    if (isPlaying) {
      //stop playing and return
      sourceNode.stop(0);
      sourceNode = null;
      analyser = null;
      isPlaying = false;
    }
    getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": "true",
            "googNoiseSuppression": "true",
            "googHighpassFilter": "true"
          },
          "optional": []
        },
      }, gotStream);
    var myInterval = setInterval(updateOctavePitches, 5);
    setTimeout(() => clearTimeout(myInterval), 3000);
    setTimeout(() => this.setOctave(), 3000);
  }

  startLiveInput() {
    audioContext = new AudioContext();
    if (isPlaying) {
      //stop playing and return
      sourceNode.stop(0);
      sourceNode = null;
      analyser = null;
      isPlaying = false;
    }
    getUserMedia(
      {
        "audio": {
          "mandatory": {
            "googEchoCancellation": "false",
            "googAutoGainControl": this.state.audioFilters,
            "googNoiseSuppression": this.state.audioFilters,
            "googHighpassFilter": this.state.audioFilters
          },
          "optional": []
        },
      }, gotStream);
    updatePitchInterval = setInterval(updatePitch, 5);
  }

  setOctave() {
    let avg = findOctavePitches.reduce((acc, cur) => acc += cur) / findOctavePitches.length;
    let note = noteFromPitch(avg);
    let startingNote = Math.round(note / 12) * 12;
    this.setState({ startingNote: startingNote })
    if (startingNote / 12 <= 5) {
      this.setState({ audioFilters: "true" })
    } else {
      this.setState({ audioFilters: "false" })
    }
  }

  getTimeWindowPitches() {
    clearTimeout(updatePitchInterval);

    let midiNotes = this.props.midi.map(midi => midi + this.state.startingNote);
    midiNotes.unshift(this.state.startingNote);
    let myWindow = this.props.timeStamps;
    let window1 = pitchArr.filter(pitch => pitch.time > myWindow[0] && pitch.time < myWindow[1]);
    let window2 = pitchArr.filter(pitch => pitch.time > myWindow[1] + 400 && pitch.time < myWindow[2]);
    let window3 = pitchArr.filter(pitch => pitch.time > myWindow[2] + 400 && pitch.time < myWindow[3]);
    let window4 = pitchArr.filter(pitch => pitch.time > myWindow[3] + 400 && pitch.time < myWindow[4]);
    let window5 = pitchArr.filter(pitch => pitch.time > myWindow[4] + 400 && pitch.time < myWindow[5]);
    let window6 = pitchArr.filter(pitch => pitch.time > myWindow[5] + 400 && pitch.time < myWindow[6]);
    let window7 = pitchArr.filter(pitch => pitch.time > myWindow[6] + 400 && pitch.time < myWindow[7]);
    let window8 = pitchArr.filter(pitch => pitch.time > myWindow[7] + 400 && pitch.time < myWindow[7] + 1000);

    window1 = window1.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[0] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[0] + 4)))
    window2 = window2.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[1] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[1] + 4)))
    window3 = window3.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[2] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[2] + 4)))
    window4 = window4.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[3] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[3] + 4)))
    window5 = window5.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[4] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[4] + 4)))
    window6 = window6.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[5] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[5] + 4)))
    window7 = window7.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[6] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[6] + 4)))
    window8 = window8.filter(pitch => (pitch.pitch > frequencyFromNoteNumber(midiNotes[7] - 4)) && (pitch.pitch < frequencyFromNoteNumber(midiNotes[7] + 4)))
    let averages = [];

    if (window1.length === 0 || window2.length === 0 || window3.length === 0 || window4.length === 0) {
      alert("Not enough audio collected. Try moving closer to the mic.")
    } else if (window5.length === 0 || window6.length === 0 || window7.length === 0 || window8.length === 0) {
      alert("Not enough audio collected. Try moving closer to the mic.")
    } else {



      let avg1 = window1.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window1.length;
      let avg2 = window2.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window2.length;
      let avg3 = window3.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window3.length;
      let avg4 = window4.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window4.length;
      let avg5 = window5.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window5.length;
      let avg6 = window6.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window6.length;
      let avg7 = window7.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window7.length;
      let avg8 = window8.map(pitch => pitch.pitch).reduce((acc, cur) => acc + cur) / window8.length;

      averages.push(avg1, avg2, avg3, avg4, avg5, avg6, avg7, avg8);

      let avgCentsOff = midiNotes.map((note, index) => centsOffFromPitch(averages[index], note)).reduce((acc, cur) => acc += Math.abs(cur)) / averages.length;
      let pitchAccuracy = 100 - avgCentsOff;
      if (!this.props.intervalEx) {
        this.props.setPitchAcc(this.props.user_id, pitchAccuracy)
      }
      let centsOffPerNote = midiNotes.map((note, index) => centsOffFromPitch(averages[index], note));

      for (let i = 0; i < 8; i++) {
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
        if (centsOffPerNote[i] >= 25) {
          document.getElementsByClassName("abcjs-n" + noteIndex)[measureIndex].style.fill = "orangered";
        } else if (centsOffPerNote[i] <= -25) {
          document.getElementsByClassName("abcjs-n" + noteIndex)[measureIndex].style.fill = "royalblue";
        } else {
          document.getElementsByClassName("abcjs-n" + noteIndex)[measureIndex].style.fill = "lawngreen";
        }
      }

      let noteAccuracy = centsOffPerNote.filter(centsOffNote => centsOffNote < 50 && centsOffNote > -50).length / centsOffPerNote.length * 100;
      if (!this.props.intervalEx) {
        this.props.setNoteAcc(this.props.user_id, noteAccuracy);
      }

      if (this.props.intervalEx) {
        let intervals = [];
        for (let i = 1; i < midiNotes.length; i++) {
          intervals.push(midiNotes[i] - midiNotes[i - 1]);
        }

        let intervalAccuracy = intervals.map((interval, index) => { return { interval: interval, centsOff: (centsOffFromPitch(averages[index + 1], midiNotes[index + 1]) - centsOffPerNote[0]) } })
        intervalAccuracy.forEach(interval => {
          let accuracy = (100 - Math.abs(interval.centsOff)) % 100;
          this.props.setIntervalAcc(this.props.user_id, accuracy, interval.interval)
        })

      }
      alert(`Note Accuracy: ${noteAccuracy}   Pitch Accuracy: ${pitchAccuracy}`);
    }
  }


  toggleOscillator() {
    let audioContext = new AudioContext();
    if (isPlaying) {
      //stop playing and return
      sourceNode.stop(0);
      sourceNode = null;
      analyser = null;
      isPlaying = false;
      return "play oscillator";
    }
    sourceNode = audioContext.createOscillator();
    let frequency = frequencyFromNoteNumber(this.state.startingNote)

    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    sourceNode.frequency.setValueAtTime(frequency, audioContext.currentTime);
    sourceNode.start(0);
    isPlaying = true;

    return "stop";
  }

  render() {
    return (
      <div className="pitch-detector-div">
        <Row style={{ textAlign: "center" }}>
          <h5>Starting Note: C{this.state.startingNote / 12 - 1}</h5>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Button className="sidebar-button" onClick={this.toggleOscillator}>Play Starting Note</Button>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Button className="sidebar-button" onClick={this.matchOctave}>Match Octave</Button>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Button className="sidebar-button" onClick={this.startLiveInput}>Start Live Input</Button>
        </Row>
        <Row style={{ textAlign: "center" }}>
          <Button className="sidebar-button" onClick={this.getTimeWindowPitches}>Get Results</Button>
        </Row>

      </div>
    )
  }
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
  // Create an AudioNode from the stream.
  mediaStreamSource = audioContext.createMediaStreamSource(stream);

  // Connect it to the destination.
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  mediaStreamSource.connect(analyser);
}

function error() {
  alert('Stream generation failed.');
}

var buflen = 1024;
var buf = new Float32Array(buflen);



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
    return cents;
  } else if (avgCentsOff < 0 && avgCentsOff < -5) {
    return cents;
  } else {
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
    correlations[offset] = correlation;
    if ((correlation > GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
      foundGoodCorrelation = true;
      if (correlation > best_correlation) {
        best_correlation = correlation;
        best_offset = offset;
      }
    } else if (foundGoodCorrelation) {
      var shift = (correlations[best_offset + 1] - correlations[best_offset - 1]) / correlations[best_offset];
      return sampleRate / (best_offset + (8 * shift));
    }
    lastCorrelation = correlation;
  }
  if (best_correlation > 0.01) {
    return sampleRate / best_offset;
  }
  return -1;
}

const MaxPitch = 2000;
const MinPitch = 98;

function updatePitch(time) {
  if (analyser) {
    analyser.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioContext.sampleRate);
    if (ac == -1) {

    } else {
      let pitch = ac;
      if (pitch > MinPitch && pitch < MaxPitch) {
        pitchArr.push({ pitch: pitch, time: performance.now() });
      }
    }
  }
}

function updateOctavePitches() {
  if (analyser) {
    analyser.getFloatTimeDomainData(buf);
    var ac = autoCorrelate(buf, audioContext.sampleRate);
    if (ac == -1) {
    } else {
      let pitch = ac;
      if (pitch > MinPitch && pitch < MaxPitch) {
        findOctavePitches.push(pitch);
      }
    }
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { setIntervalAcc, setPitchAcc, setNoteAcc },
    dispatch
  );
}

function mapStateToProps(state) {
  return {
    exercise: state.exercise.abc,
    midi: state.exerciseMidi.midi,
    user_id: state.user.user_id,
    timeStamps: state.timeStamps

  };
}


export default connect(mapStateToProps, mapDispatchToProps)(PitchDetector);