import React from "react";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Icon, Input, Menu} from "antd";
import cloneDeep from "lodash.clonedeep";
import PerfectScrollbar from "react-perfect-scrollbar";
import {AppSidebar} from "@coreui/react";
import {menuNav as navigation} from "../../menu";
import "./custom-sidebar.scss";
const SubMenu = Menu.SubMenu;

class SiderMenu extends React.Component {
  
  state = {
    residentInfo: '',
    misc: '',
    reports: '',
    submenuOpenKeys: [],
  }
  
  onSearchKeyChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  
  getNavigationItems = () => {
    const {misc, reports, residentInfo } = this.state;
    const submenuOpenKeys = cloneDeep(this.state.submenuOpenKeys);
    let navigationItems = cloneDeep(navigation);
    if (residentInfo) {
      navigationItems.forEach( x => {
          if (x.text === 'Resident Info') {
            x.items = x.items.filter(item => {
              return item.text.toLowerCase().includes(residentInfo.toLowerCase()) || (item.searchTags && item.searchTags.includes(residentInfo.toLowerCase()));
            })
          }
      })
    }
    if (reports) {
      navigationItems.forEach( x => {
        if (x.text === 'Reports') {
          x.items = x.items.filter(item => {
            if (!item.items) {
              return item.text.toLowerCase().includes(reports.toLowerCase()) || (item.searchTags && item.searchTags.includes(reports.toLowerCase()));
            } else {
              item.items = item.items.filter(subItem => {
                return subItem.text.toLowerCase().includes(reports.toLowerCase()) || (subItem.searchTags && subItem.searchTags.includes(reports.toLowerCase()));
              });
              if (item.items.length > 0) {
                submenuOpenKeys.push(`sub-${item.text}`);
              }
              return item.items.length > 0;
            }
          });
          if (x.items.length > 0) {
            submenuOpenKeys.push(`sub-${x.text}`);
          }
          
        }
      })
    }
    if (misc) {
      navigationItems.forEach( x => {
        if (x.text === 'Miscellaneous') {
          x.items = x.items.filter(item => {
            if (!item.items) {
              return item.text.toLowerCase().includes(misc.toLowerCase()) || (item.searchTags && item.searchTags.includes(misc.toLowerCase()));
            } else {
              item.items = item.items.filter(subItem => {
                return subItem.text.toLowerCase().includes(misc.toLowerCase()) || (subItem.searchTags && subItem.searchTags.includes(misc.toLowerCase()));
              });
              if (item.items.length > 0) {
                submenuOpenKeys.push(`sub-${item.text}`);
              }
              return item.items.length > 0;
            }
          });
          if (x.items.length > 0) {
            submenuOpenKeys.push(`sub-${x.text}`);
          }
        }
      })
    }
    // this.setState({
    //   submenuOpenKeys,
    // });
    return [navigationItems, this.props.sideBarCollapsed ? this.state.submenuOpenKeys : submenuOpenKeys];
  }
  
  onSubMenuOpen = (openKeys) => {
    let {submenuOpenKeys} = this.state;
    const mainSubmenus = navigation.filter(item => item.items && item.items.length > 0).map(x => x.text);
    const latestOpenKey = openKeys.find(key => submenuOpenKeys.indexOf(key) === -1);
    if (mainSubmenus.indexOf(latestOpenKey) === -1) {
      this.setState({ submenuOpenKeys: openKeys });
    } else {
      this.setState({
        submenuOpenKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  }
  
  render() {
    const { sideBarCollapsed, location: { pathname }, menuSize, menuTheme } = this.props;
    const menu = this.getNavigationItems()
    return (
      <AppSidebar className={menuTheme === 'light' ? 'light-menu d-lg-none' : 'd-lg-none'} fixed display="lg">
      <PerfectScrollbar>
        <div className={`custom-sidebar ${menuSize === 'small' ? 'small-menu' : ''}`}>
          <Menu
            defaultSelectedKeys={[pathname.substr(1)]}
            size={menuSize || 'default'}
            mode="inline"
            openKeys={menu[1]}
            theme={menuTheme || 'dark'}
            inlineCollapsed={sideBarCollapsed}
            onOpenChange={this.onSubMenuOpen}
          >
            {
              menu[0].map((item)=>{
                const menus = item.items ?
                      <SubMenu key={item.text} title={<span><Icon type={item.icon} /><span>{item.text}</span></span>}>
                        {
                          item.path &&
                          <Menu.Item key={`quick-${item.text}`}>
                            <Link to={item.path || '' }>
                              <span>All Links</span>
                            </Link>
                          </Menu.Item>
                        }
                        {
                          item.iSearchable &&
                          <div className="searchMenu mx-5 my-5">
                            <Input size="small" onClick={(e) => e.stopPropagation()} addonBefore={<Icon type="search" />} name={item.searchKey} onChange={this.onSearchKeyChange} />
                            {
                              (item.items || []).length === 0 && <div className="mt-15 ml-10">No items found!</div>
                            }
                          </div>
                        }
                        {
                          item.items.map(subItem => {
                           return subItem.items ?
                                  <SubMenu key={`sub-${subItem.text}`} title={<span><span>{subItem.text}</span></span>}>
                                    {
                                      subItem.items.map(subItemItem => (
                                        <Menu.Item key={subItemItem.text}>
                                          <Link to={subItemItem.path || "" }>
                                            <span>{subItemItem.text}</span>
                                          </Link>
                                        </Menu.Item>
                                      ))
                                    }
                                  </SubMenu> :
                                  <Menu.Item key={`sub-${subItem.text}`}>
                                    <Link to={subItem.path || "" }>
                                      <span>{subItem.text}</span>
                                    </Link>
                                  </Menu.Item>
                              }
                          )
                        }
                      </SubMenu> :
                      <Menu.Item key={item.text}>
                        <Link to={item.path || "" }>
                          <Icon type={item.icon}/>
                          <span>{item.text}</span>
                        </Link>
                      </Menu.Item>
                
                return menus
              })
            }
          </Menu>
          <div className={`sidebar-bottom ${sideBarCollapsed ? 'collapsed' : ''}`}>
            <i className="fa fa-medkit" />
            <i className="fa fa-video-camera"/>
          </div>
        </div>
      </PerfectScrollbar>
      </AppSidebar>
    );
  }
}

const mapStateToProps = (state) => ({
  sideBarCollapsed: state.settings.sideBarCollapsed,
  menuSize: state.settings.menuSize,
  menuTheme: state.settings.menuTheme,
});

export default connect(mapStateToProps)(withRouter(SiderMenu))
