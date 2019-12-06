import React from 'react';
import './CardItem.scss';

const CardItem = ({onClick = null, children, keyValue, className}) => (
  <div className={`card-item ${className || ''}`} onClick={onClick} key={keyValue}>
    {children}
  </div>
);

export default CardItem;
