import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import {ApiService} from "../../services/ApiService";
import {message} from "antd";
import {connect} from "react-redux";
import Loader from "../Common/Loader";
import {Chart, Label, Series, ValueAxis} from "devextreme-react/chart";
import {formatNumber} from "../../services/common";

class InvoiceChartByDept extends Component {
  _apiService = new ApiService();

  state = {
    invoices: [],
    loading: false
  }

  componentDidMount() {
    this.getInvoicesByDepartment()
  }

  getInvoicesByDepartment = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoicesByDepartment();
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        invoices: data,
        loading: false,
      })
    }
  }

  onPointClick = (data) => {
    this.setState({
      selectedDepartment: data.target.data.departmentName
    })
  }

  onReset = () => this.setState({selectedDepartment: ''})

  onRotated = () => {
    this.setState({
      isRotated : !this.state.isRotated
    })
  }

  render() {
    const { loading, selectedDepartment, isRotated} = this.state;
    const { monthChartColor, deptChartColor} = this.props;
    let invoices = this.state.invoices;
    if (selectedDepartment) {
      invoices = invoices.filter(x => x.departmentName === selectedDepartment)
    }

    return (
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            loading ? <Loader className="mt-50"/> :
              <Row>
                <Col md="12" sm="12" xs="12">
                  <i className="fa fa-repeat fa-3 fs-22 ml-50 chart-back cursor-pointer" onClick={this.onRotated} />
                  {selectedDepartment && <i className="fa fa-arrow-circle-o-left fa-3 fs-24 ml-100 chart-back r-30" onClick={this.onReset} />}
                    <Chart id={'chart'} dataSource={invoices} onPointClick={selectedDepartment ? null : this.onPointClick} rotated={isRotated}>
                      <Series
                        valueField={'amount'}
                        argumentField={selectedDepartment ? 'monthName' : 'departmentName'}
                        type={'bar'}
                        showInLegend={false}
                        color={selectedDepartment ? monthChartColor || '#ff61e0' : deptChartColor || '#ffaa66'} />
                      <ValueAxis>
                        <Label format={{
                          formatter: function (value) {
                            return formatNumber(value , 0);
                          }
                        }}/>
                      </ValueAxis>
                    </Chart>
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
  deptChartColor: state.settings.deptChartColor || '',
  monthChartColor: state.settings.monthChartColor || '',
});
export default connect(mapStateToProps)(InvoiceChartByDept);
