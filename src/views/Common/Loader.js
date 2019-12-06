import React from 'react';
import { PropagateLoader } from 'react-spinners';

const Loader = ({className}) => (
  <div className={`loading ${className || ''}`}>{' '}<PropagateLoader color={'#165d93'} /></div>
);

export default Loader;
