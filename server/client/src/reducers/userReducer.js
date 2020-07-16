import { SET_USER } from '../actions/index';
console.log(SET_USER)
export default function (state = {}, action) {
  console.log("SHOULD BE set_user: " + action.type);
  switch(action.type) {
    case SET_USER:
      console.log("____ setting user _____")
      console.log("__action.payload is: ");
      console.log(action);
      return action.payload
    default:
      console.log("___ default in user reducer ___")
      console.log("__action.payload is: ");
      console.log(action)
      return state;
  }
}