import axios from 'axios';

export const GET_EXERCISE = "GET_EXERCISE";

export default function getExercise(level) {
  const url = 'http://localhost:5000/api/exercise';
  const request = axios({
    method: "get",
    url: url,
    data: {
      level: level
    }
  })
  return {
    type: GET_EXERCISE,
    payload: request
  }
}