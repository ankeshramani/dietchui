import React, { Component } from 'react';
import { PropagateLoader } from 'react-spinners';

class Callback extends Component {
  render() {
    return (
      <div className="loading">{' '}<PropagateLoader color={'#165d93'} /></div>
    );
  }
}

export default Callback;
