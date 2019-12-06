import React, {Component} from "react";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {changeSettings} from "../../redux/actions/settings";
import {getSettings} from "../../services/common";
import {ApiService} from "../../services/ApiService";
import {Dropdown, Icon, Menu} from "antd";
import {Link} from 'react-router-dom'
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.state = {}
  }


  handleMenuClick = (event) => {
    localStorage.setItem('facilityKey', event.key);
    this.props.onChangeSettings({
      facilityKey: event.key
    });
  }

  render() {
    const { sideBarCollapsed, facilitiesData = [], facilityKey } = this.props;
    const selectedItem = facilityKey && (facilitiesData || []).find(x=>x.PKey_Facility === Number(facilityKey || '0'));
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {
          facilitiesData.map((d, index) => (
            <Menu.Item key={d.PKey_Facility}>{d.Facility_Name}</Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <React.Fragment>
        <span className={sideBarCollapsed ? 'collapsed' : ''}>{getSettings('copyRightText')}</span>
        <span className="ml-auto">
           <ContextMenuTrigger id="facility-id">
            <Dropdown overlay={menu} trigger={['click']} placement="topLeft" overlayClassName="footer-menu">
              <span className="ant-dropdown-link text-primary cursor-pointer d-flex flex-align-item-center">
                {(selectedItem && selectedItem.Facility_Name) || 'Choose Facility'}{'  '}<Icon type="down"
                                                                                               className="ml-2"/>
              </span>
            </Dropdown>
          </ContextMenuTrigger>
          <ContextMenu id="facility-id">
            <MenuItem data={{foo: 'bar'}}>
              <Link to={'/facility-settings'} className="link-facility">Facility Settings</Link>
            </MenuItem>
          </ContextMenu>
        </span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
  sideBarCollapsed: state.settings.sideBarCollapsed,
  facilitiesData: state.settings.facilitiesData || [],
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DefaultFooter))
