import { GET_PITCH_ACC } from "../actions/index"

export default function (state=[], action) {
  switch(action.type) {
    case GET_PITCH_ACC:
      return action.payload.data
    default:
      return state;
  }
}