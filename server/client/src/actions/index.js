import axios from 'axios';

export const GET_EXERCISE = "GET_EXERCISE";
export const SET_USER = "SET_USER";

export function getExercise(level) {
  const url = `http://localhost:5000/api/exercise/${level}`;
  const request = axios.get(url);

  return {
    type: GET_EXERCISE,
    payload: request
  }
}

export function setUser(name, user_id) {
  console.log("name in action: " + name);
  console.log("id in action: " + user_id);
  console.log(SET_USER)
  return {
    type: SET_USER,
    payload: {name, user_id}
  }
}