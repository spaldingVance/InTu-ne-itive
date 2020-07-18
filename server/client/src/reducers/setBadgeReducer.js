import { SET_BADGE } from '../actions/index';

export default function (state={}, action) {
  switch(action.type) {
    case SET_BADGE:
      return action.payload.data
    default:
      return state;
  }  
}