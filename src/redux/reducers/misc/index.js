import {STORE_SELECTION} from "../../constants";
const initialState = {}

export default function miscReducer(state = initialState, action) {
  switch (action.type) {
    case STORE_SELECTION: {
      return {
        ...state,
        ...(action.payload),
      };
    }
    default: {
      return state
    }
  }
}
