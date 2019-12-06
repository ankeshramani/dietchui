import {STORE_SELECTION} from "../../constants";

export const storeSelection = (state) => ({
  type: STORE_SELECTION,
  payload: state
});
