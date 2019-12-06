import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {connect} from "react-redux";
import {Skeleton, Slider} from "antd";
import CardHeader from "reactstrap/es/CardHeader";
import debounce from "lodash.debounce";
import moment from "moment";
import {Link} from "react-router-dom";
import {ApiService} from "../../services/ApiService";
import {dateFormat, getSettings} from "../../services/common";
import Loader from "../Common/Loader";
import FavoriteReports from "./FavoriteReports";
import RecentReport from "./RecentReport";
import CustomGrid from "../../components/CustomGrid";
import InvoiceGrid from "./InvoiceGrid";
import InvoiceChartByDept from "./InvoiceChartByDept";
import InvoiceChartByMonth from "./InvoiceChartByMonth";
import {Column} from "devextreme-react/data-grid";
import './Home.scss';

class Home extends Component{

  _apiService = new ApiService();

  state = {
    admittedResidents: [],
    dischargedResidents: [],
    sqlDietFlucs: [],
    loading: true,
    hours: 24,
  }

  async componentDidMount() {
    if (this.props.facilityKey) {
      this.loadData(this.props.facilityKey);
    }
  }

  componentDidUpdate(prevProps) {
    if ((!prevProps.facilityKey && this.props.facilityKey) || (prevProps.facilityKey !== this.props.facilityKey)) {
      this.loadData(this.props.facilityKey);
    }
  }

  search = debounce(e => {
    this.loadData(this.props.facilityKey);
  }, 1000);

  loadData = async (facilityKey) => {
    const { hours } = this.state;
    this.setState({
      loading: true,
    });
    let [admittedData, dischargedData, sqlDietFlucsData] = await Promise.all(
      [this._apiService.getAdmittedResidents(facilityKey, hours), this._apiService.getDischargedResidents(facilityKey, hours), this._apiService.getSqlDietFlucs(facilityKey, hours)]
    );

    const newState = {};
    if (!admittedData.error) {
      newState.admittedResidents = admittedData || [];
    }
    if (!dischargedData.error) {
      newState.dischargedResidents = dischargedData || [];
    }
    if (!sqlDietFlucsData.error) {
      newState.sqlDietFlucs = sqlDietFlucsData || [];
    }
    this.setState({
      loading: false,
      ...newState
    })
  }

  onSliderChange = async (hours) => {
    const prevHours = this.state.hours;
    await this.setState({
      hours,
    });
    if (prevHours !== hours) {
      this.search();
    }
  }

  render() {
    const {admittedResidents, dischargedResidents, sqlDietFlucs, hours, loading} = this.state;
    const isShowHidden = getSettings('isShowHiddenFeatures')
    const marks = {
      12: '12h',
      10000: '10000h',
    };
    return(
      <div className="animated fadeIn mx-15 mt-15 mb-50">
        <Row>
          <Col sm="12" className="mr-99">
            <p>Please select timestamp(hours): </p>
            <Slider defaultValue={24} marks={marks} min={12} max={10000} value={hours} className="w-99-p" onChange={this.onSliderChange} />
          </Col>
          {
            isShowHidden ?
              <>
                <Col xs="12" sm="12" md="6">
                  <Card>
                    <CardHeader><b>Auto Generated Selective Menus</b></CardHeader>
                    <CardBody>
                      <Skeleton/>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="12" sm="12" md="6">
                  <Card>
                    <CardHeader><b>Admitted Residents</b></CardHeader>
                    <CardBody className="p-0">
                      {
                        loading ? <Loader className="mt-10"/> :
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={admittedResidents}
                            columnAutoWidth={false}
                            keyExpr="PKey_Patient"
                          >
                            <Column alignment="left" caption={'Name'} dataField="FullName"/>
                            <Column alignment="left" caption={'Admitted Date'} dataField="AdmitDate"
                                    cellRender={(record) => {
                                      return <span>{record.data.AdmitDate ? moment(record.data.AdmitDate).format(dateFormat) : '-'}</span>
                                    }}/>
                          </CustomGrid>
                      }
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader><b>Discharged Residents</b></CardHeader>
                    <CardBody className="p-0">
                      {
                        loading ? <Loader className="mt-10"/> :
                          <CustomGrid
                            dataSource={dischargedResidents}
                            columnAutoWidth={false}
                            keyExpr="PKey_Patient"
                          >
                            <Column alignment="left" caption={'Name'} sortOrder={'asc'} dataField="FullName"/>
                            <Column alignment="left" caption={'Discharge Date'} dataField="Discharge_Date"
                                    cellRender={(record) => {
                                      return <span>{record.data.Discharge_Date ? moment(record.data.Discharge_Date).format(dateFormat) : '-'}</span>
                                    }}/>
                          </CustomGrid>
                      }
                    </CardBody>
                  </Card>
                </Col>
              </> : null
          }
        </Row>
        <Row>
          <Col xs="6">
            <Card>
              <CardHeader>Invoices By Department</CardHeader>
              <CardBody>
                <InvoiceChartByDept />
              </CardBody>
            </Card>
          </Col>
          <Col xs="6">
            <Card>
              <CardHeader>Invoices By Month</CardHeader>
              <CardBody>
                <InvoiceChartByMonth />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader><Link to="/purchasing/invoices">Recent Invoices</Link></CardHeader>
              <CardBody>
                <InvoiceGrid />
              </CardBody>
            </Card>
          </Col>
        </Row>
        {
          isShowHidden ?
            <>
              <Row>
                <Col sm="12">
                  <Card>
                    <CardHeader><b>Diet Fluctuation Changes</b></CardHeader>
                    <CardBody className="p-0">
                      {
                        loading ? <Loader className="mt-10"/> :
                          <CustomGrid
                            dataSource={sqlDietFlucs}
                            columnAutoWidth={false}
                            keyExpr="PKey_Diet_Flucs"
                          >
                            <Column alignment="left" caption={'Date'} dataField="Change_Date" cellRender={(record) => {
                              return <span>{record.data.Change_Date ? moment(record.data.Change_Date).format(dateFormat) : '-'}</span>
                            }}/>
                            <Column alignment="left" caption={'Name'} sortOrder={'asc'} dataField="FullName"/>
                            <Column alignment="left" caption={'Diet Order'} dataField="Diet_Name_1"/>
                            <Column alignment="left" caption={'Diet Order'} dataField="Diet_Name_2"/>
                            <Column alignment="left" caption={'Diet Order'} dataField="Diet_Name_3"/>
                            <Column alignment="left" caption={'Diet Order'} dataField="Diet_Name_4"/>
                            <Column alignment="left" caption={'Consist.'} dataField="Consist_Name_1"/>
                            <Column alignment="left" caption={'Consist.'} dataField="Consist_Name_2"/>
                            <Column alignment="left" caption={'Consist.'} dataField="Consist_Name_3"/>
                            <Column alignment="left" caption={'Consist.'} dataField="Consist_Name_4"/>
                          </CustomGrid>
                      }
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Card>
                    <CardHeader><Link to="/links/reports">Favorite Reports</Link></CardHeader>
                    <CardBody>
                      <FavoriteReports/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row>
                <Col xs="12" sm="12" md="6">
                  <Card>
                    <CardHeader><Link to="/links/reports">Favorite Reports</Link></CardHeader>
                    <CardBody>
                      <FavoriteReports/>
                    </CardBody>
                  </Card>
                </Col>
                <Col xs="12" sm="12" md="6">
                  <Card>
                    <CardHeader><Link to="/reports/dashboard">Recent Reports</Link></CardHeader>
                    <CardBody className="p-0">
                      <RecentReport/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </> : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});

export default connect(mapStateToProps)(Home)
