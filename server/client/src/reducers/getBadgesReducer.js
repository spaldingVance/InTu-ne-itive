import { GET_BADGES } from '../actions/index';

export default function (state={}, action) {
  switch(action.type) {
    case GET_BADGES:
      return action.payload.data
    default:
      return state;
  }
}