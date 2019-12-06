import {combineReducers} from "redux";
import settingsReducer from "./settings";
import miscReducer from "./misc";

export const allReducers = combineReducers({
  settings: settingsReducer,
  misc: miscReducer,
});

