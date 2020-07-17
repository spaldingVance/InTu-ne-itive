import { GET_INTERVAL_ACC } from "../actions/index"

export default function (state = {}, action) {
  switch (action.type) {
    case GET_INTERVAL_ACC:
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
