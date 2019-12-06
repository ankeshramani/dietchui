import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import {ApiService} from "../../services/ApiService";
import {message} from "antd";
import {connect} from "react-redux";
import Loader from "../Common/Loader";
import {Chart, Series, ValueAxis, Label} from "devextreme-react/chart";
import {formatNumber} from "../../services/common";

class InvoiceChartByMonth extends Component {
  _apiService = new ApiService();

  state = {
    invoices: [],
    loading: false,
    isRotated: false
  }

  componentDidMount() {
    this.getInvoicesByMonth()
  }

  getInvoicesByMonth = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoicesByMonth();
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

  onRotated = () => {
    this.setState({
      isRotated : !this.state.isRotated
    })
  }

  render() {
    const { loading, invoices, isRotated} = this.state;
    const { monthChartColor} = this.props;
    return (
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            loading ? <Loader className="mt-50"/> :
              <Row>
                <Col md="12" sm="12" xs="12">
                  <i className="fa fa-repeat fa-3 fs-22 ml-50 chart-back cursor-pointer" onClick={this.onRotated} />
                  <Chart id={'chart'} dataSource={invoices} rotated={isRotated}>
                    <Series
                      valueField={'amount'}
                      argumentField={'monthName'}
                      name={'By Month'}
                      type={'bar'}
                      showInLegend={false}
                      color={monthChartColor}>

                    </Series>
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
  monthChartColor: state.settings.monthChartColor || '',
});
export default connect(mapStateToProps)(InvoiceChartByMonth);
