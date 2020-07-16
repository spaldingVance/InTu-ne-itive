import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  exerciseMidi: exerciseReducer,
  user: userReducer
})

export default rootReducer;