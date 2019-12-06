import React, {Component} from "react";
import {Link} from "react-router-dom";
import cloneDeep from "lodash.clonedeep";
import {Col, Row} from "reactstrap";
import {message} from "antd";
import {ApiService} from "../../services/ApiService";
import Loader from "../Common/Loader";
import "../PageView/PageView.scss";

class FavoriteReports extends Component {
  _apiService = new ApiService();
  
  state = {
    searchKey: '',
    favourites: [],
    filter: 'All',
    loading: true,
    reportList: [],
  }
  
  async componentDidMount() {
    this.getReportsList();
  }
  
  getReportsList = async () => {
    const data = await this._apiService.getFavoriteReportsWithDetails();
    const newState = {loading: false};
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      const reportList = (data || []).filter(x => x.Name !== 'NULL' && x.Name).sort((a, b) =>  (a.Name || '').toString().toUpperCase() < (b.Name || '').toString().toUpperCase() ? -1 : 1 );
      const groups = [];
      reportList.forEach(x => {
        x.GroupName = x.ProgramName;
        if (groups.indexOf(x.ProgramName) === -1) {
          groups.push(x.ProgramName);
        }
      })
      const menu = groups.map(x => {
        return {
          text: x,
          iSearchable: true,
          searchKey: 'reports',
          icon: 'folder',
          items: reportList.filter(y => y.GroupName === x).map(z => {
            return {
              text: z.Name,
              ...z,
            };
          }),
        };
      });
      newState.reportList = menu;
    }
    this.setState({
      ...newState
    });
  }
  
  renderMenuItems = (items) => {
    return items && items.map((item, index) => {
        return <div key={`sub-item-${index}`}><Link to={'/reports/' + item.Slug || '/'}>{item.text}</Link></div>
      });
  }
  
  getNavigationItems = () => {
    const {reportList} = this.state;
    let menu = {
      items: reportList
    };
    if (menu) {
      menu = cloneDeep(menu || {});
    }
    return menu;
  }

  render() {
    const {loading} = this.state;
    const menu = this.getNavigationItems();
    return (
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            loading ? <Loader className="mt-50"/> :
              <div className="menu">
                {
                  menu && menu.items && menu.items.map((mainMenu, index2) => {
                    return <div className="flex-column mx-10 my-10 menu-item" key={`main-item-${index2}`}>
                      <div><b>{mainMenu.text}</b></div>
                      {
                        mainMenu &&
                        mainMenu.items && mainMenu.items.map((item, index) => {
                          return item.items ?
                            <>
                            <div><b>{item.text}</b></div>
                            {this.renderMenuItems(item.items)}</> :
                            <div key={`item-${index}`}>
                              <Link to={'/reports/' + item.Slug || '/'}>{item.text}</Link>
                            </div>
                        })
                      }
                    </div>;
                  })
                }
                {
                  (!menu || !menu.items || !menu.items.length) &&
                  <div className="text-center">
                    No Favorite Reports Found!
                  </div>
                }
              </div>
          }
        </Col>
      </Row>
    )
  }
}
export default FavoriteReports;
