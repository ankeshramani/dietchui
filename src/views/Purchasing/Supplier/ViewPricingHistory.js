import React, {Component} from "react";
import {Drawer, message,} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import moment from "moment";
import {dateFormat} from "../../../services/common";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";

class ViewPricingHistory extends Component {
  _apiService = new ApiService();
  state = {
    loading : false,
    priceHistory: [],
  }

  componentDidMount() {
    this.getSupplierBidPriceHistory()
  }

  getSupplierBidPriceHistory = async () => {
    const {selectedBid} = this.props;
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getSupplierBidPriceHistory(selectedBid && selectedBid.PKey_OP_Supplier_Bid);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        priceHistory: data,
        loading: false,
      });
    }
  };

  render() {
    const { loading, priceHistory} = this.state;
    const {onDrawerClose, isDrawer} = this.props;
    return(
      <Drawer
        title={<div>Pricing History</div>}
        placement={"right"}
        onClose={onDrawerClose}
        visible={isDrawer}
        width={700}
      >
        {
          loading ? <Loader /> :
            <>
            <CustomGrid
              dataSource={priceHistory}
              columnAutoWidth={false}
              columnHidingEnabled={false}
            >
              <Column alignment="left" width={"15%"} caption={'Price'} dataField={'Price'}/>
              <Column alignment="left" width={"15%"} caption={'Start Date'} dataField={'Date_Start'}  cellRender={(record) => {
               return <span>{record.data.Date_Start ? moment(record.data.Date_Start).format(dateFormat) : ''}</span>
              }}/>
              <Column alignment="left" width={"15%"} caption={'End Date'} dataField={'Date_End'}  cellRender={(record) => {
               return <span>{record.data.Date_End ? moment(record.data.Date_End).format(dateFormat) : ''}</span>
              }}/>
            </CustomGrid>
            </>
        }
      </Drawer>
    )
  }
}

export default ViewPricingHistory;
