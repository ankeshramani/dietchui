import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import {ApiService} from "../../services/ApiService";
import {Icon, message} from "antd";
import {connect} from "react-redux";
import Loader from "../Common/Loader";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../components/CustomGrid";

class RecentReport extends Component {
  _apiService = new ApiService();

  state = {
    documents: [],
    loading: false
  }

  componentDidMount() {
    this.getReportsDashboard()
  }

  getReportsDashboard = async () => {
    this.setState({
      loading: true,
    });
    const payload = {
      ViewAll: false,
      TestingMode: false
    };
    const data = await this._apiService.GetReportDocuments(payload);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        documents: data,
        loading: false,
      })
    }
  }

  render() {
    const { loading} = this.state;
    let { documents } = this.state;
    return (
        <Row>
          <Col xs="12" sm="12" lg="12">
              {
                loading ? <Loader className="mt-50"/> :
                  <Row>
                    <Col md="12" sm="12" xs="12">
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={documents}
                        columnAutoWidth={false}
                        id="recent-reports"
                        keyExpr="PKey_RS_ReportDocument"
                      >
                        <Column alignment="left" caption={'Report Name'} dataField={'ReportName'}/>
                        <Column alignment="left" caption={'Detailed Report'} dataField={'DetailedReportName'}/>
                        <Column alignment="left" caption={'Status'} dataField={'StatusName'}/>
                        <Column alignment="left" caption={'Action'} cellRender={(record) => {
                          return  <div className="flex-align-item-center"><Icon type="printer" /></div>
                        }}/>
                      </CustomGrid>
                    </Col>
                  </Row>
              }
          </Col>
        </Row>
    );
  }

}
const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});
export default connect(mapStateToProps)(RecentReport);
