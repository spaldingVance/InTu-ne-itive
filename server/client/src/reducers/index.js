import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";
import userReducer from "./userReducer";
import setIntervalAccReducer from "./setIntervalAccReducer";
import setNoteAccReducer from "./setNoteAccReducer";
import setPitchAccReducer from "./setPitchAccReducer";
import getIntervalAccReducer from "./getIntervalAccReducer";
import getNoteAccReducer from "./getNoteAccReducer";
import getPitchAccReducer from "./getPitchAccReducer";

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  exerciseMidi: exerciseReducer,
  user: userReducer,
  intervalAccLength: setIntervalAccReducer,
  noteAccLength: setNoteAccReducer,
  pitchAccLength: setPitchAccReducer,
  intervalAcc: getIntervalAccReducer,
  noteAcc: getNoteAccReducer,
  pitchAcc: getPitchAccReducer
})

export default rootReducer;