import { combineReducers } from "redux";

const initialState = {
  schedules: [],
};

function scheduleReducer(state = initialState, action) {
  switch (action.type) {
    case "ADD_SCHEDULE":
      if (!Array.isArray(state.schedules)) {
        return { ...state, schedules: [] };
      }

      return { ...state, schedules: [...state.schedules, action.payload] };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  schedule: scheduleReducer,
});

export default rootReducer;
