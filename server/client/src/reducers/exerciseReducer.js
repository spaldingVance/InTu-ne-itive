import { GET_EXERCISE, GET_INTERVAL_EXERCISE } from '../actions/index';

export default function (state = {}, action) {
  switch(action.type) {
    case GET_EXERCISE:
      console.log(action.payload)
      console.log(action.payload.data)
      return action.payload.data
    case GET_INTERVAL_EXERCISE:
      return action.payload.data
    default:
      return state;
  }
}