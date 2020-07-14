import { combineReducers } from "redux";
import exerciseReducer from "./exerciseReducer";

const rootReducer = combineReducers({
  exercise: exerciseReducer
})

export default rootReducer;