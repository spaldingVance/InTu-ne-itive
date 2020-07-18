import { SET_TIMESTAMPS} from '../actions/index';

export default function (state=[], action) {
  switch(action.type) {
    case SET_TIMESTAMPS:
      return action.payload
    default:
      return state;
  }
}