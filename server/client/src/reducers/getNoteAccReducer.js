import { GET_NOTE_ACC } from "../actions/index"

export default function (state=[], action) {
  switch(action.type) {
    case GET_NOTE_ACC:
      return action.payload.data
    default:
      return state;
  }
}