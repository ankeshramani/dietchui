import React from "react";
import {Radio} from "antd";

const RadioGroup = Radio.Group;

const reportTypes = [
  { name: 'By Cold/Hot', value: 0},
  { name: 'By Meal', value: 1},
  { name: 'By Resident', value: 2},
  { name: 'By Set', value: 3},
  { name: 'Total', value: 4},
];


const ReportType = ({selectedValue, ...rest}) => (
  <RadioGroup value={selectedValue || ''} {...rest}>
    {
      reportTypes.map(x => <Radio value={x.value}>{x.name}</Radio>)
    }
  </RadioGroup>
);

export default ReportType;
