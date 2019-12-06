import React, {Component} from "react";
import {ListGroup, ListGroupItem, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import {connect} from "react-redux";
import {Checkbox, Radio, Select} from "antd";
import {changeSettings} from "../../redux/actions/settings";
import PropTypes from "prop-types";
import classNames from "classnames";

const Option = Select.Option;

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const colors = ['#20a8d8', '#a4b7c1', '#4dbd74', '#f86c6b', '#ffc107', '#63c2de', '#ffffff', '#f0f3f5', '#29363d', '#c2cfd6', '#151b1e', '#000000'];

class DefaultAside extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handleSizeChange = (e) => {
    this.props.onChangeSettings({[e.target.name]: e.target.value});
  }

  render() {
    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '1' })}
                     onClick={() => {
                       this.toggle('1');
                     }}>
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className={classNames({ active: this.state.activeTab === '3' })}
                     onClick={() => {
                       this.toggle('3');
                     }}>
              <i className="icon-settings" />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <ListGroup className="list-group-accent" tag={'div'}>
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Today</ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-warning list-group-item-divider">
                <div className="avatar float-right">
                  <img className="img-avatar" src={require('../../assets/avatars/7.jpg')} alt="admin@bootstrapmaster.com" />
                </div>
                <div>Meeting with <strong>Lucas</strong> </div>
                <small className="text-muted mr-3">
                  <i className="icon-calendar"></i>&nbsp; 1 - 3pm
                </small>
                <small className="text-muted">
                  <i className="icon-location-pin"></i> Palo Alto, CA
                </small>
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-info list-group-item-divider">
                <div className="avatar float-right">
                  <img className="img-avatar" src={require('../../assets/avatars/7.jpg')} alt="admin@bootstrapmaster.com" />
                </div>
                <div>Skype with <strong>Megan</strong></div>
                <small className="text-muted mr-3">
                  <i className="icon-calendar" />&nbsp; 4 - 5pm
                </small>
                <small className="text-muted">
                  <i className="icon-social-skype" /> On-line
                </small>
              </ListGroupItem>
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">Tomorrow</ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-danger list-group-item-divider">
                <div>New UI Project - <strong>deadline</strong></div>
                <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 10 - 11pm</small>
                <small className="text-muted"><i className="icon-home"></i>&nbsp; creativeLabs HQ</small>
                <div className="avatars-stack mt-2">
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/2.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/3.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/4.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/5.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/6.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                </div>
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-success list-group-item-divider">
                <div><strong>#10 Startups.Garden</strong> Meetup</div>
                <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 1 - 3pm</small>
                <small className="text-muted"><i className="icon-location-pin"></i>&nbsp; Palo Alto, CA</small>
              </ListGroupItem>
              <ListGroupItem action tag="a" href="#" className="list-group-item-accent-primary list-group-item-divider">
                <div><strong>Team meeting</strong></div>
                <small className="text-muted mr-3"><i className="icon-calendar"></i>&nbsp; 4 - 6pm</small>
                <small className="text-muted"><i className="icon-home"></i>&nbsp; creativeLabs HQ</small>
                <div className="avatars-stack mt-2">
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/2.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/3.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/4.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/5.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/6.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/7.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                  <div className="avatar avatar-xs">
                    <img src={require('../../assets/avatars/8.jpg')} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </div>
                </div>
              </ListGroupItem>
            </ListGroup>
          </TabPane>
          <TabPane tabId="3" className="p-3">
            <h6>Settings</h6>
            <div className="aside-options">
              <div className="clearfix mt-4">
                <div><small><b>Tab size:</b></small></div>
                <Radio.Group size="small" name="tabSize" default="default" onChange={this.handleSizeChange}>
                  <Radio.Button value="default">Default</Radio.Button>
                  <Radio.Button value="large">Large</Radio.Button>
                  <Radio.Button value="small">Small</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <div><small><b>DatePicker size:</b></small></div>
                <Radio.Group size="small" name="datePickerSize" default="default" onChange={this.handleSizeChange}>
                  <Radio.Button value="large">Large</Radio.Button>
                  <Radio.Button value="default">Default</Radio.Button>
                  <Radio.Button value="small">Small</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            <div className="aside-options">
              <div className="clearfix mt-4">
                <div><small><b>Theme:</b></small></div>
                <Radio.Group size="small" name="theme" default="light" onChange={this.handleSizeChange}>
                  <Radio.Button value="light">Light</Radio.Button>
                  <Radio.Button value="dark">Dark</Radio.Button>
                </Radio.Group>
              </div>
            </div>

            {/*<div className="aside-options">*/}
              {/*<div className="clearfix mt-4">*/}
                {/*<div><small><b>Menu bar:</b></small></div>*/}
                {/*<Radio.Group size="small" name="menuSize" default="normal" onChange={this.handleSizeChange}>*/}
                  {/*<Radio.Button value="normal">Normal</Radio.Button>*/}
                  {/*<Radio.Button value="small">Small</Radio.Button>*/}
                {/*</Radio.Group>*/}
              {/*</div>*/}
            {/*</div>*/}
            
            {/*<div className="aside-options">*/}
              {/*<div className="clearfix mt-4">*/}
                {/*<div><small><b>Menu theme:</b></small></div>*/}
                {/*<Radio.Group size="small" name="menuTheme" default="dark" onChange={this.handleSizeChange}>*/}
                  {/*<Radio.Button value="dark">Dark</Radio.Button>*/}
                  {/*<Radio.Button value="light">Light</Radio.Button>*/}
                {/*</Radio.Group>*/}
              {/*</div>*/}
            {/*</div>*/}
            <div className="aside-options">
              <div className="clearfix mt-4">
                  <div>
                    <div><small><b>Logo color:</b></small></div>
                    <Select name="logoColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'logoColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`logo-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
              </div>
            </div>
            <div className="aside-options">
              <div className="clearfix mt-4">
                <div>
                  <small><b>Grid Style:</b></small>
                </div>
                <div className="aside-options pl-10 mb-10">
                  <div>
                    <div><small><b>Table size:</b></small></div>
                    <Radio.Group  className="ml-5" size="small" name="tableSize" default="default" onChange={this.handleSizeChange}>
                      <Radio.Button value="default">Default</Radio.Button>
                      <Radio.Button value="middle">Middle</Radio.Button>
                      <Radio.Button value="small">Small</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                <div className="aside-options pl-10 mb-10">
                  <div>
                    <div><small><b>Is Table Bordered?: </b></small>
                    <Checkbox onChange={(event) => this.handleSizeChange({target: {name: 'isTableBordered', value: event.target.checked}})} />
                    </div>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Header color:</b></small></div>
                    <Select name="headerColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'headerColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`header-color-${x}`}  value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Header BG color:</b></small></div>
                    <Select name="headerBGColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'headerBGColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`header-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Body color:</b></small></div>
                    <Select name="bodyColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'bodyColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`header-body-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Body BG color:</b></small></div>
                    <Select name="bodyBGColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'bodyBGColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`body-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Even Row BG color:</b></small></div>
                    <Select name="evenRowBgColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'evenRowBgColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`even-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="aside-options">
              <div className="clearfix mt-4">
                <div>
                  <small><b>Button Style:</b></small>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Font color:</b></small></div>
                    <Select name="buttonTextColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'buttonTextColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`font-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>BG color:</b></small></div>
                    <Select name="buttonBGColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'buttonBGColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`button-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <div className="aside-options">
              <div className="clearfix mt-4">
                <div>
                  <small><b>Menu Style:</b></small>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Icon color:</b></small></div>
                    <Select name="menuIconColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuIconColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`menu-icon-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Menu text color:</b></small></div>
                    <Select name="menuTextColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuTextColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`menu-text-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>BG color:</b></small></div>
                    <Select name="menuBGColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuBGColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`menu-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
                <div className="pl-10 mb-10">
                  <div>
                    <div><small><b>Border color:</b></small></div>
                    <Select name="menuBorderColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuBorderColor', value}})}>
                      <Option value="">Default</Option>
                      {
                        colors.map(x => <Option key={`border-bg-${x}`}  value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                      }
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});

export default connect(null, mapDispatchToProps)(DefaultAside)
