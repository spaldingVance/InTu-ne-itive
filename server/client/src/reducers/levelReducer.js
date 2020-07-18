import { LEVEL_UP } from "../actions/index"

export default function (state={}, action) {
  switch(action.type) {
    case LEVEL_UP:
      return action.payload.data
    default:
      return state;
  }
}