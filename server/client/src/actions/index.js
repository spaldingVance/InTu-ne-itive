import axios from 'axios';

export const GET_EXERCISE = "GET_EXERCISE";
export const SET_USER = "SET_USER";
export const GET_USER = "GET_USER";

export function getExercise(level) {
  const url = `http://localhost:5000/api/exercise/${level}`;
  const request = axios.get(url);

  return {
    type: GET_EXERCISE,
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