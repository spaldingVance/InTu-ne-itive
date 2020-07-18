import axios from 'axios';

export const GET_EXERCISE = "GET_EXERCISE";
export const SET_USER = "SET_USER";
export const GET_USER = "GET_USER";
export const SET_INTERVAL_ACC = "SET_INTERVAL_ACC";
export const SET_PITCH_ACC = "SET_PITCH_ACC";
export const SET_NOTE_ACC = "SET_NOTE_ACC";
export const GET_INTERVAL_ACC = "GET_INTERVAL_ACC";
export const GET_PITCH_ACC = "GET_PITCH_ACC";
export const GET_NOTE_ACC = "GET_NOTE_ACC";
export const GET_BADGES = "GET_BADGES";
export const SET_BADGE = "SET_BADGE";
export const GET_INTERVAL_EXERCISE = "GET_INTERVAL_EXERCISE"
export const LEVEL_UP = "LEVEL_UP";
export const SET_TIMESTAMPS = "SET_TIMESTAMPS"

export function setTimeStamps(timeStamps) {
  return {
    type: SET_TIMESTAMPS,
    payload: timeStamps
  }
}
export function levelUp(user_id, currentLevel) {
  const url = `http://localhost:5000/api/user/${user_id}/levelup/${currentLevel + 1}`
  const request = axios({
    method: 'post',
    url: url
  })

  return {
    type: LEVEL_UP,
    payload: request
  }
}

export function getExercise(level) {
  const url = `http://localhost:5000/api/exercise/${level}`;
  const request = axios.get(url);

  return {
    type: GET_EXERCISE,
    payload: request
  }
}

export function getIntervalExercise(interval) {
  const url = `http://localhost:5000/api/intervals/${interval}`;
  console.log("GETTING INTERVAL EXERCISE")
  const request = axios.get(url);
  return {
    type: GET_INTERVAL_EXERCISE,
    payload: request
  }
}

export function setUser(name, user_id) {
  const url = `http://localhost:5000/api/user/${user_id}`;
  const request = axios({
    method: 'post',
    url: url,
    data: {
      name: name,
    }
  });
  console.log("getting user in actions !")
  console.log("name in action: " + name);
  console.log("id in action: " + user_id);
  console.log(SET_USER)
  return {
    type: SET_USER,
    payload: request
  }
}

export function getUser(user_id) {
  const url = `http://localhost:5000/api/user/${user_id}`;
  const request = axios.get(url);
  console.log("getting user in actions !")
  return {
    type: GET_USER,
    payload: request
  }
}

export function setIntervalAcc(user_id, accuracy, interval) {
  const url = `http://localhost:5000/api/user/${user_id}/intervalAcc/${interval}`;
  const request = axios({
    method: 'put',
    url: url,
    data: {
      acc: Math.abs(accuracy)
    }
  })
  console.log("interval accuracy?????: " + Math.abs(accuracy));
  console.log(interval);
  return {
    type: SET_INTERVAL_ACC,
    payload: request
  }
}

export function setPitchAcc(user_id, accuracy) {
  const url = `http://localhost:5000/api/user/${user_id}/pitchAcc`;
  const request = axios({
    method: 'put',
    url: url,
    data: {
      acc: Math.abs(accuracy)
    }
  })
  return {
    type: SET_PITCH_ACC,
    payload: request
  }
}

export function setNoteAcc(user_id, accuracy) {
  const url = `http://localhost:5000/api/user/${user_id}/noteAcc`;
  const request = axios({
    method: 'put',
    url: url,
    data: {
      acc: accuracy
    }
  })
  return {
    type: SET_NOTE_ACC,
    payload: request
  }
}

export function getIntervalAcc(user_id, interval) {
  const url = `http://localhost:5000/api/user/${user_id}/intervalAcc/${interval}`;
  const request = axios.get(url);
  return {
    type: GET_INTERVAL_ACC,
    payload: request
  }
}

export function getNoteAcc(user_id) {
  const url = `http://localhost:5000/api/user/${user_id}/noteAcc`;
  const request = axios.get(url);
  return {
    type: GET_NOTE_ACC,
    payload: request
  }
}

export function getPitchAcc(user_id) {
  const url = `http://localhost:5000/api/user/${user_id}/pitchAcc`;
  const request = axios.get(url);
  return {
    type: GET_PITCH_ACC,
    payload: request
  }
}

export function getBadges(user_id) {
  const url = `http://localhost:5000/api/user/${user_id}/badges`;
  const request = axios.get(url);
  return {
    type: GET_BADGES,
    payload: request
  }
}

export function setBadge(user_id, badge, badgeStatus) {
  const url = `http://localhost:5000/api/user/${user_id}/badges/${badge}`;
  const request = axios({
    method: 'put',
    url: url,
    data: {
      badgeStatus: badgeStatus
    }
  })
  return {
    type: SET_BADGE,
    payload: request
  }
}

