import { GET_EXERCISE } from '../actions/index';

export default function (state = "", action) {
  console.log("ACTION TYPE: " + action.type)
  console.log(GET_EXERCISE)
  switch(action.type) {
    case GET_EXERCISE:
      console.log(action.payload)
      console.log(action.payload.data)
      return action.payload.data
    default:
      console.log("DEFAULT")
      return state;
  }
}