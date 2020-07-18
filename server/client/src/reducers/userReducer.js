import { SET_USER, GET_USER } from '../actions/index';
console.log(SET_USER)
export default function (state = {}, action) {
  switch(action.type) {
    case SET_USER:
      return action.payload.data
    case GET_USER:
      return action.payload.data
    default:
      console.log(action)
      return state;
  }
}