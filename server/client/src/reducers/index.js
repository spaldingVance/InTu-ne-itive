import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";
import userReducer from "./userReducer";
import setIntervalAccReducer from "./setIntervalAccReducer";
import setNoteAccReducer from "./setNoteAccReducer";
import setPitchAccReducer from "./setPitchAccReducer";

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  exerciseMidi: exerciseReducer,
  user: userReducer,
  intervalAccLength: setIntervalAccReducer,
  noteAccLength: setNoteAccReducer,
  pitchAccLength: setPitchAccReducer,
})

export default rootReducer;