import React from "react";
import {Tabs} from "antd";
import {connect} from "react-redux";

const TabsComp = ({children, ...rest}) => {
  const props = {...rest};
  if (rest.tabSize) {
    delete props.tabSize;
    props.size = rest.tabSize;
  }
  return <Tabs animated={false} {...props}>
          {children}
        </Tabs>
};
const mapStateToProps = (state) => ({
  tabSize: state.settings.tabSize,
});
export default connect(mapStateToProps, null) (TabsComp);
