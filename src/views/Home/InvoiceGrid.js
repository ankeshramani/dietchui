import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import {ApiService} from "../../services/ApiService";
import {message} from "antd";
import {connect} from "react-redux";
import {formatNumber} from "../../services/common";
import Loader from "../Common/Loader";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../components/CustomGrid";

class RecentReport extends Component {
  _apiService = new ApiService();
  
  state = {
    invoices: [],
    loading: false
  }
  
  componentDidMount() {
    this.getInvoices()
  }
  
  getInvoices = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoices(this.props.facilityKey)
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
  
  render() {
    const { loading} = this.state;
    let { invoices } = this.state;
    return (
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            loading ? <Loader className="mt-50"/> :
              <Row>
                <Col md="12" sm="12" xs="12">
                  <CustomGrid
                    dataSource={invoices}
                    columnAutoWidth={false}
                    keyExpr="PKey_OP_Invoice"
                    isNoScroll={false}
                    showBorders={false}
                    className={'dx-card wide-card'}
                  >
                    <Column alignment={'left'} width={200} caption={'Invoice Number'} dataField={'PoNumber'}/>
                    <Column alignment={'left'} width={"30%"} caption={'Supplier'} dataField={'Supplier_Name'}/>
                    <Column alignment={'left'} width={200} caption={'Invoice Date'} sortOrder={'desc'} dataField={'PoDate'} dataType={'datetime'}/>
                    <Column alignment={'left'} width={"30%"} caption={'Department'} dataField={'DepartmentName'}/>
                    <Column alignment={'left'} width={150} caption={'Total'} dataField={'PO_Total'} cellRender={(record) => {
                      return <span>{formatNumber(record.data.PO_Total, 2)}</span>
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
