import React from 'react';
import {Card} from 'antd';
import './ContentCard.scss';

const ContentCard = ({title, count, className, children, loading}) => (
    <Card className={`content-card ${className} ${loading ? 'load' : ''}`} loading={loading || false} title={title}>
      {children}
    </Card>
);

export default ContentCard;
