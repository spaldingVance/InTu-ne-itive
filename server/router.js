const { request } = require("express");
const redis = require("redis")

module.exports = function (router) {

  router.get("/api/exercise/:level", (request, response, next) => {
    let level = Number(request.params.level);
    let maxInterval = findMaxInterval(level);
    let midiIntervals = generateMidi(maxInterval);
    let cumulative = getCumulativeIntervals(midiIntervals)
    let abcData = translateIntervalsToAbc(cumulative);
    const noteLength = "[L:1/4] "
    console.log("cmulative for level exercise");
    console.log(cumulative)
    response.send({ abc: (noteLength + abcData), midi: cumulative });
  })

  router.get("/api/intervals/:interval", (request, response, next) => {
    let interval = Number(request.params.interval);
    console.log("exercise interval ---")
    console.log(interval);
    let midiIntervals = generateIntervalExercise(interval);
    console.log(midiIntervals);
    let cumulative = getCumulativeIntervals(midiIntervals);
    console.log(cumulative);
    let abcData = translateIntervalsToAbc(cumulative);
    console.log(abcData);
    const noteLength = "[L:1/4] "
    response.send({ abc: (noteLength + abcData), midi: cumulative });
  })

  router.post("/api/user/:userId", (request, response, next) => {
    let userId = request.params.userId;
    let name = request.body.name;
    console.log("NAME: " + name + " id: " + userId);
    request.redis.set(userId, name, redis.print);
    request.redis.set(`${userId}:level`, 1, redis.print);
    request.redis.hset(`${userId}:badges`, "badge1", "unlocked", "badge2", "unlocked", "badge3", "locked");
    request.redis.hset(`${userId}:badges`, "badge4", "locked", "badge5", "locked", "badge6", "locked");
    request.redis.hset(`${userId}:badges`, "badge7", "locked", "badge8", "locked", "badge9", "locked");
    request.redis.hset(`${userId}:badges`, "badge10", "locked", "badge11", "locked", "badge12", "locked");
    response.send({ name: name, user_id: userId, level: 1 });
  })

  router.get("/api/user/:userId", (request, response, next) => {
    let userId = request.params.userId;
    console.log(userId);
    request.redis.get(userId, function (err, name) {
      request.redis.get(`${userId}:level`, function (err, level) {
        response.send({ name: name, user_id: userId, level: level });
      })

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
    request.redis.lpush(redisPath, acc, function (err, reply) {
      response.send({ length: reply });
    });
  })

  //set note accuracy
  router.put("/api/user/:userId/noteAcc", (request, response, next) => {
    let acc = request.body.acc;
    let userId = request.params.userId;
    let redisPath = `${userId}:noteAcc`;
    request.redis.lpush(redisPath, acc, function (err, reply) {
      response.send({ length: reply });
    })
  })

  //set pitch accuracy
  router.put("/api/user/:userId/pitchAcc", (request, response, next) => {
    let acc = request.body.acc;
    let userId = request.params.userId;
    let redisPath = `${userId}:pitchAcc`;
    request.redis.lpush(redisPath, acc, function (err, reply) {
      response.send({ length: reply });
    })
  })

  //get interval accuracy
  router.get("/api/user/:userId/intervalAcc/:interval", (request, response, next) => {
    let interval = request.params.interval;
    let userId = request.params.userId
    let redisPath = `${userId}:${interval}`
    request.redis.lrange(redisPath, 0, 100, function (err, reply) {
      response.send({ interval: interval, acc: reply })
    })
  })

  router.get("/api/user/:userId/noteAcc", (request, response, next) => {
    let userId = request.params.userId
    let redisPath = `${userId}:noteAcc`;
    request.redis.lrange(redisPath, 0, 100, function (err, reply) {
      response.send(reply)
    })
  })

  router.get("/api/user/:userId/pitchAcc", (request, response, next) => {
    let userId = request.params.userId
    let redisPath = `${userId}:pitchAcc`;
    request.redis.lrange(redisPath, 0, 100, function (err, reply) {
      response.send(reply)
    })
  })

  router.get("/api/user/:userId/badges", (request, response, next) => {
    let userId = request.params.userId
    let redisPath = `${userId}:badges`;
    request.redis.hgetall(redisPath, function(err, reply) {
      let badges = {};
      response.send(reply);
    })
  })

  router.put("/api/user/:userId/badges/:badge", (request, response, next) => {
    let userId = request.params.userId;
    let badge = request.params.badge;
    let badgeStatus = request.body.badgeStatus;
    let redisPath = `${userId}:badges`;
    request.redis.hset(redisPath, badge, badgeStatus, function(err, reply) {
      response.send({response: reply});
    })
  })

  router.post("/api/user/:userId/levelup/:targetLevel", (request, response, next) => {
    let userId = request.params.userId;
    let targetLevel = Number(request.params.targetLevel);
    let preReqs = findPrereqs(targetLevel);
    preReqs.forEach(preReq => {
      request.redis.set(`${userId}:${preReq}`, "unlocked")
    })
    let redisPath = `${userId}:level`;
    request.redis.set(redisPath, targetLevel, function(err, level) {
      request.redis.del(`${userId}:pitchAcc`, `${userId}:noteAcc`, function(err, reply) {
        response.send({level: level})
      });
    });
    
  })
}

function findMaxInterval(level) {
  let maxInterval = 0;
  switch (level) {
    case 1:
      //prereqs: interval1, interval2
      maxInterval = 2;
      break;
    case 2:
      // interval3, interval4
      maxInterval = 4;
      break;
    case 3:
      // interval5
      maxInterval = 5;
      break;
    case 4:
      //interval 6
      maxInterval = 6;
      break;
    case 5:
      //interval 7
      maxInterval = 7;
      break;
    case 6:
      //interval8 interval9
      maxInterval = 9;
      break;
    case 7:
      //interval10 interval11
      maxInterval = 11;
      break;
    case 8:
      //interval 12
      maxInterval = 12;
      break;
  }
  return maxInterval;
}

function findPrereqs(level) {
  switch (level) {
    case 2:
      return ['badge3', 'badge4']
      break;
    case 3:
      return ['badge5']
      break;
    case 4:
      return ['badge6']
      break;
    case 5:
      return ['badge7']
      break;
    case 6:
      //interval8 interval9
      return ['badge8', 'badge9']
      break;
    case 7:
      //interval10 interval11
      return ['badge10', 'badge11']
      break;
    case 8:
      return ['badge12']
      break;
    default:
      return []
      break;
  }
}

function generateMidi(maxInterval) {
  let midiIntervals = [];
  for (let i = 0; i < 7; i++) {
    let note = Math.ceil((Math.random() * (maxInterval)));
    if (Math.round(Math.random())) {
      midiIntervals.push(note);
    } else {
      midiIntervals.push(0 - note)
    }
  }
  console.log(midiIntervals);
  return midiIntervals;
}

function getCumulativeIntervals(midiIntervals) {
  let cumulative = 0;
  let cumulativeIntervals = midiIntervals.map(interval => {
    if (cumulative + interval > 9 || cumulative + interval < -9) {
      return cumulative -= interval
    } else {
      return cumulative += interval
    }
  })
  console.log('cumulative');
  console.log(cumulativeIntervals);
  return cumulativeIntervals;

}

function translateIntervalsToAbc(cumulativeIntervals) {
  var myNotesSharp = ['=C', '^C', '=D', '^D', '=E', '=F', '^F', '=G', '^G', '=A', '^A', '=B'];
  var myNotesFlat = ['=C', '_D', '=D', '_E', '=E', '=F', '_G', '=G', '_A', '=A', '_B', '=B']
  let abcData = cumulativeIntervals.map((myNote, index) => {
    let noteLetter;
    if (myNote < 0) {
      noteLetter = myNotesFlat[myNotesFlat.length + myNote] + ',';
    } else {
      noteLetter = myNotesSharp[myNote % myNotesSharp.length];
    }
    // return {note: noteLetter, acc: myNote.acc}
    if ((index + 2) % 4 === 0) {
      noteLetter = noteLetter + "|";
    }
    return noteLetter;
  })
  abcData.unshift('=C');
  // let adjusted = [];
  // for (let i = 2; i < 8; i++) {
  //   let measureSoFar = abcData.split(0, i);
  //   if (i > 3) {
  //     measureSoFar = abcData.split(3);
  //   }
  //   if (abcData[i][0] === '=') {

  //     measureSoFar.forEach(note => {
  //       if (note[1] === abcData[i] && note[0] !== '=') {
  //         adjusted.push(abcData[i])
  //       } else {
  //         adjusted.push(abcData[i].slice(1));
  //       }
  //     })
  //   } else {

  //   }
  // }
  // let naturalsRemoved = [];
  // for (let i = 0; i < 8; i++) {
  //   if (i === 7 || i === 0) {
  //     naturalsRemoved.push(abcData[i])
  //   } else if (abcData[i][1] !== abcData[i+1][1]) {
  //     naturalsRemoved.push(abcData[i].slice(1))
  //   } else {
  //     naturalsRemoved.push(abcData[i])
  //   }
  // }
  console.log(abcData.join(" "));
  let notationString = abcData.join(" ");
  return notationString;
}

function generateIntervalExercise(interval) {
  let midiIntervals = [];
  for (let i = 0; i < 7; i++) {
    if (Math.round(Math.random())) {
      midiIntervals.push(interval)
    } else {
      midiIntervals.push(0 - interval)
    }
  }
  return midiIntervals;
}


// function generateIntervalExercise(interval) {
//   let midiIntervals = [];
//   let cumulative = 0;
//   for (let i = 0; i < 7; i++) {
//     let rand = Math.round(Math.random());
//     if (rand === 1) {
//       cumulative += interval;
//       midiIntervals.push({ interval: cumulative, acc: 1 })
//     } else {
//       cumulative -= interval;
//       midiIntervals.push({ interval: cumulative, acc: 1 })
//     }
//   }
//   return midiIntervals;
// }

// levels 
// 1- interval1, interval2,
// 2- interval3, interval4,
// 3- interval5
// 4- interval6
// 5- interval7
// 6- interval8, interval9
// 7- interval10, interval11,
// 8- interval 12




// function generateMelody(level, key) {
//   console.log("LEVEL: " + level);
//   let maxInterval = 2;
//   let accidentals = false;
//   let maxIntervalSharp = false;
//   switch (level) {
//     case 1:
//       //prereqs: interval1, interval2
//       maxInterval = 2;
//       accidentals = true;
//       maxIntervalSharp = false;
//       break;
//     case 2:
//       // interval3, interval4
//       maxInterval = 3;
//       maxIntervalSharp = false;
//       accidentals = true;
//       break;
//     case 3:
//       // interval5
//       maxInterval = 4;
//       accidentlas = true;
//       maxIntervalSharp = false;
//       break;
//     case 4:
//       //interval 6
//       maxInterval = 4;
//       accidentals = true;
//       maxIntervalSharp = true;
//       break;
//     case 5:
//       //interval 7
//       maxInterval = 5;
//       accidentals = true;
//       maxIntervalSharp = false;
//       break;
//     case 6:
//       //interval8 interval9
//       maxInterval = 6;
//       accidentals = true;
//       maxIntervalSharp = false;
//       break;
//     case 7:
//       //interval10 interval11
//       maxInterval = 7;
//       accidentals = true;
//       maxIntervalSharp = true;
//       break;
//     case 8:
//       //interval 12
//       maxInterval = 8;
//       accidentals = true;
//       maxIntervalSharp = false;
//       break;
//   }
//   let exerciseNotes = [];
//   for (let i = 0; i < 7; i++) {
//     let note = Math.ceil((Math.random() * (maxInterval - 1)));
//     exerciseNotes.push(note);
//   }
//   exerciseNotes = exerciseNotes.map(note => {
//     if (accidentals) {
//       let acc = Math.floor((Math.random() * 3))
//       let intervalDown = Math.round(Math.random());
//       if (intervalDown && !maxIntervalSharp && note === (maxInterval - 1)) {
//         acc = Math.floor((Math.random() * 2))
//         return { interval: (0 - note), acc: acc };
//       } else if (intervalDown) {
//         return { interval: (0 - note), acc: acc };
//       } else {
//         return { interval: note, acc: acc };
//       }
//     } else {
//       if (Math.round(Math.random())) {
//         return { interval: (0 - note), acc: 1 };
//       } else {
//         return { interval: note, acc: 1 };
//       }
//     }
//   })
//   let notesFixedRange = exerciseNotes.slice();
//   for (let i = 2; i < exerciseNotes.length; i++) {
//     if (exerciseNotes[i - 2].interval < 0 && exerciseNotes[i - 1].interval < 0 && exerciseNotes[i].interval < 0) {
//       notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
//     } else if (exerciseNotes[i - 2].interval > 0 && exerciseNotes[i - 1].interval > 0 && exerciseNotes[i].interval > 0) {
//       notesFixedRange[i].interval = 0 - exerciseNotes[i].interval
//     } else if (exerciseNotes[i - 2].interval === 0 && exerciseNotes[i - 1].interval === 0 && exerciseNotes[i].interval === 0) {
//       let nonZeroInterval = 0;
//       while (nonZeroInterval === 0) {
//         nonZeroInterval = Math.ceil((Math.random() * (maxInterval - 1)));
//       }
//       notesFixedRange[i].interval = nonZeroInterval;
//     }
//   }

//   console.log(notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0))
//   console.log(typeof notesFixedRange[0].interval)
//   while (notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0) <= -6) {
//     console.log("YEET")
//     let negIndex = notesFixedRange.findIndex(note => note.interval < 0);
//     notesFixedRange[negIndex].interval = 0 - notesFixedRange[negIndex].interval;
//   }
//   while (notesFixedRange.reduce((acc, cur) => acc = Number(acc) + cur.interval, 0) >= 6) {
//     console.log("YOOT")
//     let negIndex = notesFixedRange.findIndex(note => note.interval > 0);
//     notesFixedRange[negIndex].interval = 0 - notesFixedRange[negIndex].interval;
//   }
//   return notesFixedRange;
// }

// function getCumulativeIntervals(data) {
//   let cumulative = 0;
//   let cumulativeIntervals = data.map(data => {
//     cumulative += data.interval;
//     return { interval: cumulative, acc: data.acc }
//   })
//   return cumulativeIntervals;
// }

// function translateToAbc(cumulativeIntervals, key) {
//   var myNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
//   console.log("cumulative below");
//   console.log(cumulativeIntervals);
//   console.log("midi below");
//   console.log(translateCumulativeToMidi(cumulativeIntervals));
//   let abcData = cumulativeIntervals.map((myNote, index) => {
//     let noteLetter;
//     if (myNote.interval < 0) {
//       noteLetter = myNotes[cumulativeIntervals.length + myNote.interval] + ',';
//     } else {
//       noteLetter = myNotes[myNote.interval % myNotes.length];
//     }
//     // return {note: noteLetter, acc: myNote.acc}
//     if (myNote.acc === 2) {
//       noteLetter = '^' + noteLetter;
//     } else if (myNote.acc === 1) {
//       noteLetter = noteLetter;
//     } else {
//       noteLetter = "_" + noteLetter;
//     }
//     if ((index + 2) % 4 === 0) {
//       noteLetter = noteLetter + "|";
//     }
//     return noteLetter;
//   })
//   abcData.unshift('C');
//   console.log(abcData.join(" "));
//   let notationString = abcData.join(" ");
//   return notationString;
// }

// function translateIntervalsToAbc(cumulativeIntervals) {
//   var myNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
//   let abcData = cumulativeIntervals.map((myNote, index) => {
//     let noteLetter;
//     if (myNote.interval < 0) {
//       noteLetter = myNotes[cumulativeIntervals.length + myNote.interval] + ',';
//     } else {
//       noteLetter = myNotes[myNote.interval % myNotes.length];
//     }
//     // return {note: noteLetter, acc: myNote.acc}
//     if ((index + 2) % 4 === 0) {
//       noteLetter = noteLetter + "|";
//     }
//     return noteLetter;
//   })
//   abcData.unshift('C');
//   console.log(abcData.join(" "));
//   let notationString = abcData.join(" ");
//   return notationString;
// }

// function translateCumulativeToMidi(cumulative) {
//   translateObj = {
//     "0": 0,
//     "1": 2,
//     "2": 4,
//     "3": 5,
//     "4": 7,
//     "5": 9,
//     "6": 11,
//     "7": 12,
//     "8": 13,
//     "9": 15,
//     "10": 17,
//     "-1": -1,
//     "-2": -3,
//     "-3": -5,
//     "-4": -7,
//     "-5": -8,
//     "-6": -10,
//     "-7": -12,
//     "-8": -13,
//     "-9": -15,
//     "-10": -17,
//   }
//   let translated = cumulative.map(interval => {
//     if (interval.acc === 1) {
//       return translateObj[String(interval.interval)]
//     } else if (interval.acc === 2) {
//       return translateObj[String(interval.interval)] + 1;
//     } else {
//       return translateObj[String(interval.interval)] - 1;
//     }
//   });
//   return translated;
// }

