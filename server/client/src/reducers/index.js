import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";

const rootReducer = combineReducers({
  exercise: exerciseReducer,
  exerciseMidi: exerciseReducer
})

export default rootReducer;