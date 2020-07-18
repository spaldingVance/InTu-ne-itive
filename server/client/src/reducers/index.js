import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";
import userReducer from "./userReducer";
import setIntervalAccReducer from "./setIntervalAccReducer";
import setNoteAccReducer from "./setNoteAccReducer";
import setPitchAccReducer from "./setPitchAccReducer";
import getIntervalAccReducer from "./getIntervalAccReducer";
import getNoteAccReducer from "./getNoteAccReducer";
import getPitchAccReducer from "./getPitchAccReducer";
import getBadgesReducer from "./getBadgesReducer";
import setBadgeReducer from "./setBadgeReducer";
import levelReducer from "./levelReducer"
import timeStampsReducer from "./timeStampsReducer"

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  exerciseMidi: exerciseReducer,
  user: userReducer,
  intervalAccLength: setIntervalAccReducer,
  noteAccLength: setNoteAccReducer,
  pitchAccLength: setPitchAccReducer,
  intervalAcc: getIntervalAccReducer,
  noteAcc: getNoteAccReducer,
  pitchAcc: getPitchAccReducer,
  badges: getBadgesReducer,
  setBadge: setBadgeReducer,
  level: levelReducer,
  timeStamps: timeStampsReducer
})

export default rootReducer;