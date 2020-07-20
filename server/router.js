const { request } = require("express");
const redis = require("redis")

module.exports = function (router) {

  router.get("/api/exercise/:level", (request, response, next) => {
    let level = Number(request.params.level);
    let returnObj = generateNaturalMidi(level);
    response.send(returnObj);
  })

  router.get("/api/intervals/:interval", (request, response, next) => {
    let interval = Number(request.params.interval);
    let midiIntervals = generateIntervalExercise(interval);
    let cumulative = getCumulativeIntervals(midiIntervals);
    let abcData = translateIntervalsToAbc(cumulative);
    const noteLength = "[L:1/4] "
    response.send({ abc: (noteLength + abcData), midi: cumulative });
  })

  router.post("/api/user/:userId", (request, response, next) => {
    let userId = request.params.userId;
    let name = request.body.name;
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
    request.redis.hgetall(redisPath, function (err, reply) {
      response.send(reply);
    })
  })

  router.put("/api/user/:userId/badges/:badge", (request, response, next) => {
    let userId = request.params.userId;
    let badge = request.params.badge;
    let badgeStatus = request.body.badgeStatus;
    let redisPath = `${userId}:badges`;
    request.redis.hset(redisPath, badge, badgeStatus, function (err, reply) {
      response.send({ response: reply });
    })
  })

  router.post("/api/user/:userId/levelup/:targetLevel", (request, response, next) => {
    let userId = request.params.userId;
    let targetLevel = Number(request.params.targetLevel);
    let preReqs = findPrereqs(targetLevel);
    preReqs.forEach(preReq => {
      request.redis.hset(`${userId}:badges`, preReq, "unlocked")
    })
    let redisPath = `${userId}:level`;
    request.redis.set(redisPath, targetLevel, function (err, level) {
      request.redis.del(`${userId}:pitchAcc`, `${userId}:noteAcc`, function (err, reply) {
        response.send({ level: level })
      });
    });

  })
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

function getCumulativeIntervals(midiIntervals) {
  let cumulative = 0;
  let cumulativeIntervals = midiIntervals.map(interval => {
    if (cumulative + interval > 9 || cumulative + interval < -9) {
      return cumulative -= interval
    } else {
      return cumulative += interval
    }
  })
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
    if ((index + 2) % 4 === 0) {
      noteLetter = noteLetter + "|";
    }
    return noteLetter;
  })
  abcData.unshift('=C');
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

function generateNaturalMidi(maxInterval) {
  let abcToMidiObj = {
    "0": 0,
    "1": 2,
    "2": 4,
    "3": 5,
    "4": 7,
    "5": 9,
    "6": 11,
    "7": 12,
    "-1": -1,
    "-2": -3,
    "-3": -5,
    "-4": -7,
    "-5": -8,
    '-6': -10,
    '-7': -12
  }
  let abcObj = {
    "0": 'C',
    "1": 'D',
    "2": 'E',
    "3": 'F',
    "4": 'G',
    "5": 'A',
    "6": 'B',
    "7": 'C',
    "-1": 'B,',
    "-2": 'A,',
    "-3": 'G,',
    "-4": 'F,',
    "-5": 'E,',
    '-6': 'D,',
    '-7': "C,"


  }
  let abcData = [];
  let cumulativeNotes = [];
  let cumulative = 0;
  for (let i = 0; i < 7; i++) {
    let interval = Math.ceil((Math.random() * (maxInterval)));
    let up = Math.round(Math.random());

    if ((cumulative - interval) < -7) {
      cumulative += interval;
    } else if ((cumulative + interval) > 7) {
      cumulative -= interval;
    } else if (up) {
      cumulative += interval;
    } else {
      cumulative -= interval;
    }
    cumulativeNotes.push(cumulative)
    abcData.push(abcObj[String(cumulative)])
  }
  abcData = abcData.map((note, index) => {
    if ((index + 2) % 4 === 0) {
      return note = note + "|";
    } else {
      return note
    }
  })
  abcData.unshift("C")
  let midiFromCumulative = cumulativeNotes.map(note => {
    return abcToMidiObj[String(note)];
  })
  console.log(midiFromCumulative);
  const noteLength = "[L:1/4] "
  return { abc: (noteLength + abcData.join(" ")), midi: midiFromCumulative }

}