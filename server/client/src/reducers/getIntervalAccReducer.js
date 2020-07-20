import { GET_INTERVAL_ACC } from "../actions/index"

export default function (state = {}, action) {
  switch (action.type) {
    case GET_INTERVAL_ACC:
      if (!Object.keys(action.payload.data).includes("interval")) {
        console.log("returning state in interval acc reducer");
        console.log(state);
        console.log("payload");
        console.log(action.payload);
        return state;
      }
      let interval = action.payload.data.interval
      return Object.assign(
        {},
        state,
        {
          [interval]: action.payload.data.acc,
        }
      )
    default:
      return state;
  }
}
