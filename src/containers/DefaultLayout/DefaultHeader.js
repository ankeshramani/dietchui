import React, {Component} from "react";
import {Link, withRouter} from "react-router-dom";
import {DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink} from "reactstrap";
import {ContextMenu, ContextMenuTrigger, MenuItem} from "react-contextmenu";
import {connect} from "react-redux";
import {AppAsideToggler, AppHeaderDropdown, AppSidebarToggler} from "@coreui/react";
import {getSettings} from "../../services/common";
import {toggleSideBar} from "../../redux/actions/settings";
import "antd/dist/antd.css";
import "./globleSearch.scss";

import {AutoComplete, Button, Icon, Input} from "antd";

const Option = AutoComplete.Option;

function renderOption(item) {
  return (
    <Option key={item.key} text={item.text}>
      <div className="global-search-item">
        <span className="global-search-item-desc">
         {item.text}
        </span>
      </div>
    </Option>
  );
}

const data = [
  {
    text: 'Residential Info',
    path: '/residents',
    key: "1"
  },
  {
    text: 'Dashboard',
    path: '/dashboard',
    key: "2"
  },{
    text: 'Setting',
    path: '/admin-settings',
    key: "3"
  },{
    text: 'New Resident',
    path: '/resident/new',
    key: "4"
  },{
    text: 'Birthdays',
    path: '/reports/birthdays',
    key: "5"
  },{
    text: 'Diet Orders Changes',
    path: '/reports/diet-orders/changes',
    key: "6"
  },{
    text: 'Reports Dashboard',
    path: '/reports/dashboard',
    key: "7"
  },{
    text: 'Order Guides',
    path: '/purchasing/order-guides',
    key: "8"
  },{
    text: 'Catalogs',
    path: '/purchasing/catalog',
    key: "9"
  },{
    text: 'Contact manager',
    path: '/purchasing/contact-manager',
    key: "10"
  },{
    text: 'Departments',
    path: '/purchasing/departments',
    key: "11"
  },{
    text: 'Inventory Locations',
    path: '/purchasing/inventory-locations',
    key: "12"
  },{
    text: 'Ledgers',
    path: '/purchasing/ledgers',
    key: "13"
  },{
    text: 'Suppliers',
    path: '/purchasing/suppliers',
    key: "14"
  },{
    text: 'Supplier Item Link',
    path: '/purchasing/supplier-item-link',
    key: "15"
  }
]
class DefaultHeader extends Component {
  state = {
    dataSource: data,
    dataSourceBack: data,
    searchValue: ''
  }

  handleSearch = (value) => {
    this.setState({
      dataSource: value ? this.state.dataSourceBack.filter(item => {
        return item.text.toLowerCase().includes(value.toLowerCase())
      }) : [],
      searchValue: value,
    });
  }

  onSelect = async (id) => {
    const item = this.state.dataSourceBack.find(i => i.key === id);
    if (item) {
      await this.setState({
        searchValue: ''
      });
      this.props.history.push(item.path);
    }
  }

  render() {
    const { dataSource, searchValue } = this.state;
    const { logoColor } = this.props;
    const isShowHidden = getSettings('isShowHiddenFeatures')
    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <span className="navbar-brand logo-name cursor-pointer">
          <span className={logoColor}>{getSettings('logoText')}</span>
        </span>
        {/*<span className="d-lg-none" onClick={() => toggleSideBar()}>*/}
          {/*<AppSidebarToggler className="d-md-down-none" display="lg" />*/}
        {/*</span>*/}
        <Nav className="d-md-down-none" navbar>
          <NavItem className="px-15">
            <Link to="/" className="nav-link" >Dashboard</Link>
          </NavItem>
          <NavItem className="px-15">
            <Link to="/purchasing" className="nav-link">Purchasing</Link>
          </NavItem>
          {
            isShowHidden ?
              <>
                <NavItem className="px-15">
                  <Link to="/residents" className="nav-link">Residents</Link>
                </NavItem>
                <NavItem className="px-15">
                  <Link to="/links/reports" className="nav-link">Reports</Link>
                </NavItem>
              </> : null
          }
          <NavItem className="px-15">
            <Link to="/touch" className="nav-link">Touch</Link>
          </NavItem>
        </Nav>

        <Nav className="ml-auto" navbar>
          {
            isShowHidden ?
              <NavItem className="px-15 d-md-down-none">
                <div className="global-search-wrapper" style={{width: 300}}>
                  <AutoComplete
                    className="global-search"
                    size="default"
                    dataSource={searchValue ? dataSource.map(renderOption) : []}
                    onSelect={this.onSelect}
                    onSearch={this.handleSearch}
                    placeholder="Global Search"
                    optionLabelProp="text"
                  >
                    <Input
                      value={this.state.searchValue}
                      suffix={(
                        <Button className="search-btn" size="default" type="primary">
                          <Icon type="search"/>
                        </Button>
                      )}
                    />
                  </AutoComplete>
                </div>
              </NavItem> : null
          }
          <NavItem className="d-md-down-none">
            <NavLink href={getSettings('supportUrl')} title="Support" target="_blank" className="fs-24">
              <ContextMenuTrigger id="support-id">
                <i className="fa fa-medkit" aria-hidden="true"></i>
              </ContextMenuTrigger>
              <ContextMenu id="support-id">
                <MenuItem data={{foo: 'bar'}}>
                  Support Now
                </MenuItem>
                <MenuItem data={{foo: 'bar'}}>
                  Support Later
                </MenuItem>
                <MenuItem divider />
              </ContextMenu>
            </NavLink>
          </NavItem>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav className="user">
              {/*<img src={require('../../assets/avatars/6.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />*/}
              <i className="fa fa-user img-avatar" aria-hidden="true" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem onClick={() => this.props.history.push('/personalization')}> <i className="fa fa-wrench"></i>Personalization</DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/admin-settings')}> <i className="fa fa-wrench"></i>Admin Settings</DropdownItem>
              <DropdownItem onClick={() => this.props.history.push('/facility-settings')}> <i className="fa fa-wrench"></i>Facility Settings</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" style={{display: 'none'}} />
        <AppAsideToggler className="d-lg-none" mobile style={{display: 'none'}} />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  logoColor: state.settings.logoColor,
});

const mapDispatchToProps = (dispatch) => ({
  toggleSideBar: (state) => {
    return dispatch(toggleSideBar(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DefaultHeader))
