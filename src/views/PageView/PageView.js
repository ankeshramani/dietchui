import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Card, CardBody, Col, Row} from "reactstrap";
import cloneDeep from "lodash.clonedeep";
import {Dropdown, Icon, Input, Menu} from "antd";
import {navigation} from "../../menu";
import "./PageView.scss";
import CardHeader from "reactstrap/es/CardHeader";
import {getSettings} from "../../services/common";

class PageView extends Component {
  state = {
    searchKey: '',
    favourites: [],
    filter: 'all',
    isReports: this.props.location.pathname === '/links/reports'
  }

  onFavourite = (name) => {
    let {favourites} = this.state;
    if (favourites.includes(name)) {
      favourites = favourites.filter(x => x !== name);
    } else {
      favourites.push(name);
    }
    this.setState({
      favourites
    });
  }

  onSearchKeyChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  renderMenuItems = (items) => {
    const {favourites, isReports} = this.state;
    return items && items.map((item, index) => {
      return <div key={`sub-item-${index}`}><Link to={item.path || '/'}>{item.text}</Link>
        {isReports && <Icon type="star" className="fs-16 ml-5" theme={favourites.includes(item.text) ? 'filled' : ''} onClick={() => this.onFavourite(item.text)}  /> }
      </div>
    });
  }

  getNavigationItems = () => {
    const {searchKey, filter, favourites} = this.state;
    const showHidden = getSettings('isShowHiddenFeatures')
    const isFilter = filter === 'favorites';
    let page = this.props.match.params.pageName || '';
    if (!page) {
      let navItems = this.props.location.pathname.split('/');
      page = navItems[navItems.length - 1];
    }
    let menu = navigation.find(x => x.text.toLowerCase() === page.toLowerCase()) || {};
    if (menu) {
      menu = cloneDeep(menu || {});
      if (!showHidden) {
       menu.items.forEach((x)=>{
          const data = ['Inventory', 'Receiving', 'Catalog', 'Par Level'];
          x.items = x.items.filter(y => data.indexOf(y.text) === -1);
        })
      }
      if (menu.items) {
        menu.items = menu.items.filter(item => {
          if (!item.items) {
            const isSearched = !searchKey || item.text.toLowerCase().includes(searchKey.toLowerCase()) || (item.searchTags && item.searchTags.includes(searchKey.toLowerCase()));
            return isFilter ? isSearched && favourites.includes(item.text) : isSearched;
          } else {
            item.items = item.items.filter(subItem => {
              const isSearched = !searchKey || subItem.text.toLowerCase().includes(searchKey.toLowerCase()) || (subItem.searchTags && subItem.searchTags.includes(searchKey.toLowerCase()));
              return isFilter ? isSearched && favourites.includes(subItem.text) : isSearched;
            }).sort((a, b) =>  (a.text || '').toString().toUpperCase() < (b.text || '').toString().toUpperCase() ? -1 : 1 );
            return item.items.length > 0;
          }
        })
        if (this.props.location.pathname !== '/purchasing') {
          menu.items = menu.items.sort((a, b) =>  (a.text || '').toString().toUpperCase() < (b.text || '').toString().toUpperCase() ? -1 : 1 )
        }
      }
    }
    return menu;
  }

  onFilterChange = (filter) => {
    this.setState({
      filter: filter.key,
    });
  }

  render() {
    const {favourites, filter, isReports} = this.state;
    const menu = this.getNavigationItems();
    const filterMenu = (<Menu onClick={this.onFilterChange}>
      <Menu.Item key="all">
       All
      </Menu.Item>
      <Menu.Item key="favorites">
        favorites
      </Menu.Item>
    </Menu>);
    return (
      <div className="animated fadeIn page-view pt-20">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardHeader>
                {menu && menu.text}
                {isReports && <div className="float-right">
                  <Dropdown.Button overlay={filterMenu} icon={<Icon type="filter" />}>
                    {filter}
                  </Dropdown.Button>
                </div>}
              </CardHeader>
              <CardBody className="min-height-card pt-15" >
                <Input className="w-100-p mb-10" addonBefore={<Icon type="search" />} name="searchKey" onChange={this.onSearchKeyChange} />
                <div className="menu">
                    {
                      menu && menu.items && menu.items.map((mainMenu, index2) => {
                        return <div className="flex-column mx-10 my-10 menu-item" key={index2}>
                          {mainMenu && mainMenu.items ? <div><b>{mainMenu.text}</b></div> :
                            <div key={`main-item-${index2}`}>
                              <Link to={mainMenu.path || '/'}>{mainMenu.text}</Link>
                              {isReports && <Icon className="fs-16 ml-5" type="star" theme={favourites.includes(mainMenu.text) ? 'filled' : ''} onClick={() => this.onFavourite(mainMenu.text)} />}
                            </div>}
                          {
                            mainMenu &&
                            mainMenu.items && mainMenu.items.map((item, index) => {
                              return item.items ?
                                <><div><b>{item.text}</b></div>{this.renderMenuItems(item.items)}</> :
                                <div key={`item-${index}`}>
                                  <Link to={item.path || '/'}>{item.text}</Link>
                                  {isReports && <Icon type="star" className="fs-16 ml-5" theme={favourites.includes(item.text) ? 'filled' : ''} onClick={() => this.onFavourite(item.text)} />}
                                </div>
                            })
                          }
                        </div>;
                      })
                    }
                  </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
export default PageView;
