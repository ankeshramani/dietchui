import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import {message} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import moment from "moment";
import {dateFormat} from "../../../services/common";

class PoDeliveryHistory extends React.Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      invoiceId: props.data.key,
      loading: true,
      deliveryHistoryList: [],
    };
    this.getDeliveryHistoryByPo(props.data.key);
  }

  getDeliveryHistoryByPo = async (invoiceId) =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getDeliveryHistoryByPo(invoiceId)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        deliveryHistoryList: data,
        loading: false,
      })
    }
  }
  render() {
    const {deliveryHistoryList, loading} = this.state;
    return (
      <React.Fragment>
        {
          loading ?  <Loader className="mt-50"/> :
            <DataGrid
              dataSource={deliveryHistoryList}
              showBorders={false}
              columnAutoWidth={false}
            >
              <Column alignment={'left'} caption={'Email ID'} dataField={'EmailID'} />
              <Column alignment={'left'} caption={'Type'} dataField={'TypeName'} />
              <Column alignment={'left'} caption={'Date'} dataField={'DateEntered'} cellRender={(record)=>{
                return <span>{record.data ? moment(record && record.DateEntered && record.data.DateEntered).format(dateFormat) : ''}</span>
              }}/>

            </DataGrid>
        }
      </React.Fragment>
    );
  }
}

export default PoDeliveryHistory;
