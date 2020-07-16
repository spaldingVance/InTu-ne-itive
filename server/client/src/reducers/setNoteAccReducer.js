import { SET_NOTE_ACC } from "../actions/index"

export default function (state=0, action) {
  switch(action.type) {
    case SET_NOTE_ACC:
      return action.payload.data
    default:
      return state;
  }
}