import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import {message} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {formatNumber} from "../../../services/common";

class InvoicesWithDevDetail extends React.Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      invoiceId: props.data.key,
      loading: true,
      invoiceDetails: [],
    };
    this.getInvoiceDetails(props.data.key);
  }

  getInvoiceDetails = async (invoiceId) =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoiceDetails(invoiceId)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        invoiceDetails: data,
        loading: false,
      })
    }
  }
  render() {
    const {invoiceDetails, loading} = this.state;
    return (
      <React.Fragment>
        {
          loading ?  <Loader className="mt-50"/> :
            <DataGrid
              dataSource={invoiceDetails}
              showBorders={false}
              columnAutoWidth={false}
            >
              <Column alignment={'left'} caption={'#'} dataField={'SerialNumber'} />
              <Column alignment={'left'} caption={'Qty'} dataField={'Quantity'} />
              <Column alignment={'left'} caption={'Product No.'} dataField={'BidIDNumber'} />
              <Column alignment={'left'} caption={'Description'} dataField={'BidName'}  />.
              <Column alignment={'left'} caption={'Notes'} dataField={'PurchaseNotes'}/>
              <Column alignment={'left'} caption={'Pack/Size'} cellRender={(record) => {
                return <span>{`${record.data.Pack || record.data.Pack === 0 ? record.data.Pack : ''}/${record.data.Size || record.data.Size === 0 ? record.data.Size : ''} ${record.data.Measure || ''}`}</span>
              }} />
              <Column alignment={'left'} caption={'Unit Price'} dataField={'Price'} cellRender={(record) => {
                return <span>{formatNumber(record.data.Price, 2)}</span>
              }}/>
              <Column alignment={'left'} caption={'Extended'} dataField={'Extended'}/>
            </DataGrid>
        }

      </React.Fragment>
    );
  }
}

export default InvoicesWithDevDetail;
