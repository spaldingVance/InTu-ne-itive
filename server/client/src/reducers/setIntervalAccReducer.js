import { SET_INTERVAL_ACC } from "../actions/index"

export default function (state={}, action) {
  switch(action.type) {
    case SET_INTERVAL_ACC:
      console.log("Set interval acc: ");
      console.log(action.payload.data);
      return action.payload.data
    default:
      return state;
  }
}