import {CHANGE_SETTINGS, TOGGLE_SIDEBAR} from "../../constants";

const getDisplaySettings = () => {
  let settings = {};
  if (localStorage.getItem('displaySettings')) {
    try {
      settings = JSON.parse(localStorage.getItem('displaySettings'));
    } catch(err) {
      console.log(err);
    }
  }
  return settings;
}
const initialState = {
  sideBarCollapsed: false,
  facilityKey: localStorage.getItem('facilityKey'),
  ...(getDisplaySettings())
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      return {
        ...state,
        sideBarCollapsed: action.payload || action.payload === false ? action.payload : !state.sideBarCollapsed,
      }
    }

    case CHANGE_SETTINGS: {
      const newState = {
        ...state,
        ...(action.payload),
      };
      const settings = {
        theme: newState.theme || 'light',
        sideBarCollapsed: newState.sideBarCollapsed,
        isTableBordered: newState.isTableBordered,
        headerColor: newState.headerColor,
        headerBGColor: newState.headerBGColor,
        datePickerSize: newState.datePickerSize || 'default',
        bodyColor: newState.bodyColor,
        bodyBGColor: newState.bodyBGColor,
        evenRowBgColor: newState.evenRowBgColor,
        buttonBGColor: newState.buttonBGColor,
        buttonTextColor: newState.buttonTextColor,
        menuIconColor: newState.menuIconColor,
        menuTextColor: newState.menuTextColor,
        menuBGColor: newState.menuBGColor,
        menuBorderColor: newState.menuBorderColor,
        sectionTextColor: newState.sectionTextColor,
        sectionBGColor: newState.sectionBGColor,
        rowHoverBGColor: newState.rowHoverBGColor,
        rowHoverColor: newState.rowHoverColor,
        tableSize: newState.tableSize || 'small',
        tabSize: newState.tabSize || 'default',
        isShowFilterRow: newState.isShowFilterRow || false,
        deptChartColor: newState.deptChartColor || '',
        monthChartColor: newState.monthChartColor || '',
      };
      localStorage.setItem('displaySettings', JSON.stringify(settings));
      return newState;
    }
    default: {
      return state
    }
  }
}
