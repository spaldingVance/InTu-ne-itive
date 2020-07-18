import { GET_BADGES } from '../actions/index';

export default function (state={}, action) {
  switch(action.type) {
    case GET_BADGES:
      console.log("get badges in reducer 00000000")
      console.log(action.payload.data)
      return action.payload.data
    default:
      return state;
  }
}