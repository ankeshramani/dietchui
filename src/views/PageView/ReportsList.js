import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Card, CardBody, Col, Row} from "reactstrap";
import cloneDeep from "lodash.clonedeep";
import {Dropdown, Icon, Input, Menu, message, Tooltip} from "antd";
import {ApiService} from "../../services/ApiService";
import Loader from "../Common/Loader";
import "./PageView.scss";
import CardHeader from "reactstrap/es/CardHeader";

class ReportsList extends Component {
  _apiService = new ApiService();

  state = {
    searchKey: '',
    favourites: [],
    filter: 'All',
    loading: true,
    reportList: [],
    isShowAll: false
  }

  async componentDidMount() {
    this.getReportsList();
    this.getFavorites();

  }

  getReportsList = async () => {
    const data = await this._apiService.getReportsList();
    const newState = {loading: false};
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      const reportList = (data || []).filter(x => x.GroupName !== 'NULL' && x.GroupName).sort((a, b) =>  (a.NameForList || '').toString().toUpperCase() < (b.NameForList || '').toString().toUpperCase() ? -1 : 1 );
      const groups = [];
      reportList.forEach(x => {
        if (groups.indexOf(x.GroupName) === -1) {
          groups.push(x.GroupName);
        }
      })
      const menu = groups.sort((a, b) =>  (a || '').toString().toUpperCase() < (b || '').toString().toUpperCase() ? -1 : 1 ).map(x => {
        return {
          text: x,
          iSearchable: true,
          searchKey: 'reports',
          icon: 'folder',
          items: reportList.filter(y => y.GroupName === x).map(z => {
            return {
              text: z.NameForList,
              ...z,
            };
          }),
        };
      });
      const  allReports = ( data || []).sort((a,b) => {
        return a.ReportName > b.ReportName ? 1 : -1;
      });
      newState.reportList = menu;
      newState.allReports = allReports;
    }
    this.setState({
      ...newState
    });
  }

  getFavorites = async () => {
    const data = await this._apiService.getFavoriteReports(8);
    const newState = {};
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      newState.favourites = data;
    }
    this.setState({
      ...newState
    });
  }

  onFavorite = async (record) => {
    let {favourites} = this.state;
    const payload = {
      PKey_PM_User_ReportFavorite: 0,
      // FKey_User: 8,
      FKey_Report: record.PKey_RS_Report,
      Name: record.ReportName
    };
    const data = await this._apiService.favoriteReport(payload);
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      favourites.push({FKey_Report: record.PKey_RS_Report, PKey_PM_User_ReportFavorite: data});
    }
    this.setState({
      favourites
    });
  }

  onShowFavorite = () => {
    this.setState({
      isShowAll: !this.state.isShowAll
    })

  }

  onRemoveFavorite = async (record) => {
    let {favourites} = this.state;
    const data = await this._apiService.deleteFavoriteReport(record);
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      favourites = favourites.filter(x => x.PKey_PM_User_ReportFavorite !== record);
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
    const {favourites} = this.state;
    return items && items.map((item, index) => {
        return <div key={`sub-item-${index}`}><Link to={'/reports/' + item.Slug || '/'}>{item.text}</Link>
          <Icon type="star" className="fs-16 ml-5" theme={favourites.includes(item.text) ? 'filled' : ''} onClick={() => alert('click')}  />
        </div>
      });
  }

  getNavigationItems = () => {
    const {searchKey, filter, favourites, reportList} = this.state;
    const isFilter = filter === 'Favorites';
    let menu = {
      items: reportList
    };
    const checkFavorite = (reportId) => {
      return favourites.find(x => x.FKey_Report === reportId);
    };
    if (menu) {
      menu = cloneDeep(menu || {});
      if (menu.items) {
        menu.items = menu.items.filter(item => {
          if (!item.items) {
            const isSearched = !searchKey || item.text.toLowerCase().includes(searchKey.toLowerCase()) || (item.searchTags && item.searchTags.includes(searchKey.toLowerCase()));
            return isFilter ? isSearched && checkFavorite(item.PKey_RS_Report) : isSearched;
          } else {
            item.items = item.items.filter(subItem => {
              const isSearched = !searchKey || subItem.text.toLowerCase().includes(searchKey.toLowerCase()) || (subItem.searchTags && subItem.searchTags.includes(searchKey.toLowerCase()));
              return isFilter ? isSearched && checkFavorite(subItem.PKey_RS_Report) : isSearched;
            });
            return item.items.length > 0;
          }
        })
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
    const {favourites = [], filter, loading, isShowAll, allReports} = this.state;
    const menu = this.getNavigationItems();
    const filterMenu = (<Menu onClick={this.onFilterChange}>
      <Menu.Item key="All">
        All
      </Menu.Item>
      <Menu.Item key="Favorites">
        Favorites
      </Menu.Item>
    </Menu>);
    const checkFavorite = (reportId) => {
      return favourites.find(x => x.FKey_Report === reportId);
    };
    const allFavoriteReports = (allReports || []).filter(x => checkFavorite(x.PKey_RS_Report))
    return (
      <div className="animated fadeIn page-view pt-20">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardHeader>
                Reports
                <div className="float-right">
                  <Dropdown.Button overlay={filterMenu} icon={<Icon type="filter" />}>
                    {filter}
                  </Dropdown.Button>
                  <Tooltip title="Clicking this will enable you to edit your favorite reports">
                   <Icon type="setting" className="ml-5" style={{fontSize: "15px"}} onClick={this.onShowFavorite}/>
                  </Tooltip>
                </div>
              </CardHeader>
              {
                loading ? <Loader className="mt-50"/> :
                  <CardBody className="min-height-card pt-15" >
                    <Input className="w-100-p mb-10" addonBefore={<Icon type="search" />} name="searchKey" onChange={this.onSearchKeyChange} />
                    <div className="mb-15"><Link to="/reports/dashboard">Reports Dashboard</Link></div>
                    <div><b>Favorite Reports</b>
                        <div className="menu">

                          {
                            allFavoriteReports.map((record,index)=>{
                            return  <div className="flex-column mx-10 menu-item" key={`main-item-${index}`}>
                              <Link to={'/reports/' + record.Slug || '/'}>{record.ReportName}</Link>
                            </div>
                            })
                          }
                        </div>
                      <hr/>
                    </div>
                    <div className="menu">
                      {
                        menu && menu.items && menu.items.map((mainMenu, index2) => {
                          return <div className="flex-column mx-10 my-10 menu-item" key={`main-item-${index2}`}>
                            <div><b>{mainMenu.text}</b></div>
                            {
                              mainMenu &&
                              mainMenu.items && mainMenu.items.map((item, index) => {
                                const isFavorite = item.PKey_RS_Report && checkFavorite(item.PKey_RS_Report);
                                return item.items ?
                                  <>
                                  <div><b>{item.text}</b></div>
                                  {this.renderMenuItems(item.items)}</> :
                                  <div key={`item-${index}`}>
                                    <Link to={'/reports/' + item.Slug || '/'}>{item.text}</Link>
                                    {
                                      (isFavorite || isShowAll) &&
                                      <Icon type="star" className="fs-16 ml-5" theme={isFavorite ? 'filled' : ''}
                                            onClick={() => isFavorite ? this.onRemoveFavorite(isFavorite.PKey_PM_User_ReportFavorite) : this.onFavorite(item)}/>
                                    }
                                  </div>
                              })
                            }
                          </div>;
                        })
                      }
                    </div>
                  </CardBody>
              }
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
export default ReportsList;
