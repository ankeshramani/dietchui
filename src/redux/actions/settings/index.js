import { TOGGLE_SIDEBAR,CHANGE_SETTINGS } from '../../constants';

export const toggleSideBar = (state) => ({
  type: TOGGLE_SIDEBAR,
  payload: state
});

export const changeSettings = (state) => ({
  type: CHANGE_SETTINGS,
  payload: state
});
