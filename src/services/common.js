
const formatterC3 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 3
});

const formatterC2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

const formatterC0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0
});

export const getAuthHeaders = () => {
  return {
    'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
    'Content-Type': 'application/json'
  }
};

export const toColor = (num) => {
  num >>>= 0;
  let b = num & 0xFF,
    g = (num & 0xFF00) >>> 8,
    r = (num & 0xFF0000) >>> 16,
    a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
  return "rgba(" + [r, g, b, a].join(",") + ")";
}
  
  export const getSettings = (item) => {
  const state = {
    signalRUrl: localStorage.getItem('signalRUrl') || '',
    signalRMethod: localStorage.getItem('signalRMethod') || '',
    apiEndPoint: localStorage.getItem('apiEndPoint') ? localStorage.getItem('apiEndPoint') : 'https://dsapi.dietechsoftware.com/api/',
    reportsApiEndPoint: localStorage.getItem('reportsApiEndPoint') ? localStorage.getItem('reportsApiEndPoint') : 'https://dsapi.dietechsoftware.com/reports/api',
    logoText: localStorage.getItem('logoText') ? localStorage.getItem('logoText') : 'Dietech',
    copyRightText: localStorage.getItem('copyRightText') ? localStorage.getItem('copyRightText') : 'Dietech © 2019.',
    supportUrl: localStorage.getItem('supportUrl') ? localStorage.getItem('supportUrl') : 'https://www.psisupport.com/',
    facilityKey: localStorage.getItem('facilityKey') ? localStorage.getItem('facilityKey') : '',
    isShowHiddenFeatures: localStorage.getItem('isShowHiddenFeatures') ? localStorage.getItem('isShowHiddenFeatures') : '',
  };
  return state[item] || '';
};

export const formatNumber = (value, decimalPoint = 3) => {
  if (decimalPoint === 3) {
    return formatterC3.format(value);
  } else if (decimalPoint === 0) {
    return formatterC0.format(value);
  } else {
    return formatterC2.format(value);
  }
};

export const dateFormat = 'M/D/YYYY';

export const max = (array) => {
  return array.length ? Math.max(...array) : 0;
};

