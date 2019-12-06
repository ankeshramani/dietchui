import React from "react";
import {Table} from "antd";
import {connect} from "react-redux";

const TableComp = ({children, ...rest}) => {
  const props = {...rest};
  if (rest.tableSize) {
    delete props.tableSize;
    props.size = rest.tableSize;
  }
  if (rest.isTableBordered) {
    delete props.isTableBordered;
    props.bordered = rest.isTableBordered;
  }
  if (!props.scroll) {
    props.scroll= { y: 'calc(100vh - 265px)' };
  }
  if (window.innerWidth < 992) {
    delete props.scroll;
  }

  return <Table {...props} pagination={false} >
    {children}
  </Table>
};
const mapStateToProps = (state) => ({
  tableSize: state.settings.tableSize,
  isTableBordered: state.settings.isTableBordered,
});
export default connect(mapStateToProps, null) (TableComp);
