const { request } = require("express");
const redis = require("redis")

module.exports = function (router) {

  router.get("/api/exercise/:level", (request, response, next) => {
    let level = request.params.level;
    let exerciseIntervals = generateMelody(Number(level));
    let cumulativeIntervals = getCumulativeIntervals(exerciseIntervals);
    let abcData = translateToAbc(cumulativeIntervals);
    console.log(exerciseIntervals);
    console.log(abcData);
    const noteLength = "[L:1/4] "
    response.send({ abc: (noteLength + abcData), midi: translateCumulativeToMidi(cumulativeIntervals) });
  })

  router.get("/api/intervals/:interval", (request, response, next) => {
    let interval = Number(request.params.interval);
    console.log(interval);
    let intervalExercise = generateIntervalExercise(interval);
    let abcData = translateIntervalsToAbc(intervalExercise);
    console.log(intervalExercise);
    console.log(abcData);
    const noteLength = "[L:1/4] "
    response.send({ abc: (noteLength + abcData), midi: translateCumulativeToMidi(intervalExercise) });
  })

  router.post("/api/user/:userId", (request, response, next) => {
    let userId = request.params.userId;
    let name = request.body.name;
    console.log("NAME: " + name + " id: " + userId);
    request.redis.set(userId, name, redis.print);
    response.send({name: name, user_id: userId});
  })

  router.get("/api/user/:userId", (request, response, next) => {
    let userId = request.params.userId;
    console.log(userId);
    request.redis.get(userId, function(err, reply) {
      response.send({name: reply, user_id: userId});
    });
  })

  //set interval accuracy
  router.put("/api/user/:userId/intervalAcc/:interval", (request, response, next) => {
    let interval = request.params.interval;
    let acc = request.body.acc;
    let userId = request.params.userId
    let redisPath = `${userId}:${interval}`
    console.log("interval: " + interval);
    console.log("acc: " + acc);
    console.log(request.body)
    console.log("redis path: " + redisPath);
    request.redis.lpush(redisPath, acc, function(err, reply) {
      response.send({length: reply});
    });
  })

  //set note accuracy
  router.put("/api/user/:userId/noteAcc", (request, response, next) => {
    let acc = request.body.acc;
    let userId = request.params.userId;
    let redisPath = `${userId}:noteAcc`;
    request.redis.lpush(redisPath, acc, function(err, reply) {
      response.send({length: reply});
    })
  })

  //set pitch accuracy
  router.put("/api/user/:userId/pitchAcc", (request, response, next) => {
    let acc = request.body.acc;
    let userId = request.params.userId;
    let redisPath = `${userId}:pitchAcc`;
    request.redis.lpush(redisPath, acc, function(err, reply) {
      response.send({length: reply});
    })
  })

  //get interval accuracy
  router.get("/api/user/:userId/intervalAcc/:interval", (request, response, next) => {
    let interval = request.params.interval;
    let userId = request.params.userId
    let redisPath = `${userId}:${interval}`
    request.redis.lrange(redisPath, 0, 100, function(err, reply) {
      response.send({interval: interval, acc: reply})
    })
  })

  router.get("/api/user/:userId/noteAcc", (request, response, next) => {
    let userId = request.params.userId
    let redisPath = `${userId}:noteAcc`;
    request.redis.lrange(redisPath, 0, 100, function(err, reply) {
      response.send(reply)
    })
  })

  router.get("/api/user/:userId/pitchAcc", (request, response, next) => {
    let userId = request.params.userId
    let redisPath = `${userId}:pitchAcc`;
    request.redis.lrange(redisPath, 0, 100, function(err, reply) {
      response.send(reply)
    })
  })
}


function generateIntervalExercise(interval) {
  let midiIntervals = [];
  let cumulative = 0;
  for (let i = 0; i < 7; i++) {
    let rand = Math.round(Math.random());
    if (rand === 1) {
      cumulative += interval;
      midiIntervals.push({ interval: cumulative, acc: 1 })
    } else {
      cumulative -= interval;
      midiIntervals.push({ interval: cumulative, acc: 1 })
    }
  }
  return midiIntervals;
}




function generateMelody(level, key) {
  console.log("LEVEL: " + level);
  let maxInterval = 2;
  let accidentals = false;
  switch (level) {
    case 1:
      break;
    case 2:
      maxInterval = 2;
      accidentals = true;
      break;
    case 3:
      maxInterval = 3;
      break;
    case 4:
      maxInterval = 3;
      accidentals = true;
      break;
    case 5:
      maxInterval = 4;
      break;
    case 6:
      maxInterval = 4;
      accidentals = true;
      break;
    case 7:
      maxInterval = 5;
      break;
    case 8:
      maxInterval = 5;
      accidentals = true;
      break;
    case 9:
      maxInterval = 6;
      break;
    case 10:
      maxInterval = 6;
      accidentals = true;
      break;
    case 11:
      maxInterval = 7;
      break;
    case 12:
      maxInterval = 7;
      accidentals = true;
      break;
    case 13:
      maxInterval = 8;
      break;
    case 14:
      maxInterval = 8;
      accidentals = true;
      break;
    case 15:
      maxInterval = 10;
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
        return { interval: (0 - note), acc: acc };
      } else {
        return { interval: note, acc: acc };
      }
    } else {
      if (Math.round(Math.random())) {
        return { interval: (0 - note), acc: 1 };
      } else {
        return { interval: note, acc: 1 };
      }
    }
  })
  let notesFixedRange = exerciseNotes.slice();
  for (let i = 2; i < exerciseNotes.length; i++) {
    if (exerciseNotes[i - 2].interval < 0 && exerciseNotes[i - 1].interval < 0 && exerciseNotes[i].interval < 0) {
      notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
    } else if (exerciseNotes[i - 2].interval > 0 && exerciseNotes[i - 1].interval > 0 && exerciseNotes[i].interval > 0) {
      notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
    } else if (exerciseNotes[i - 2].interval === 0 && exerciseNotes[i - 1].interval === 0 && exerciseNotes[i].interval === 0) {
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

function getCumulativeIntervals(data) {
  let cumulative = 0;
  let cumulativeIntervals = data.map(data => {
    cumulative += data.interval;
    return { interval: cumulative, acc: data.acc }
  })
  return cumulativeIntervals;
}

function translateToAbc(cumulativeIntervals, key) {
  var myNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  console.log("cumulative below");
  console.log(cumulativeIntervals);
  console.log("midi below");
  console.log(translateCumulativeToMidi(cumulativeIntervals));
  let abcData = cumulativeIntervals.map((myNote, index) => {
    let noteLetter;
    if (myNote.interval < 0) {
      noteLetter = myNotes[cumulativeIntervals.length + myNote.interval] + ',';
    } else {
      noteLetter = myNotes[myNote.interval % myNotes.length];
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

function translateIntervalsToAbc(cumulativeIntervals) {
  var myNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let abcData = cumulativeIntervals.map((myNote, index) => {
    let noteLetter;
    if (myNote.interval < 0) {
      noteLetter = myNotes[cumulativeIntervals.length + myNote.interval] + ',';
    } else {
      noteLetter = myNotes[myNote.interval % myNotes.length];
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

function translateCumulativeToMidi(cumulative) {
  translateObj = {
    "0": 0,
    "1": 2,
    "2": 4,
    "3": 5,
    "4": 7,
    "5": 9,
    "6": 11,
    "7": 12,
    "8": 13,
    "9": 15,
    "10": 17,
    "-1": -1,
    "-2": -3,
    "-3": -5,
    "-4": -7,
    "-5": -8,
    "-6": -10,
    "-7": -12,
    "-8": -13,
    "-9": -15,
    "-10": -17,
  }
  let translated = cumulative.map(interval => {
    if (interval.acc === 1) {
      return translateObj[String(interval.interval)]
    } else if (interval.acc === 2) {
      return translateObj[String(interval.interval)] + 1;
    } else {
      return translateObj[String(interval.interval)] - 1;
    }
  });
  return translated;
}