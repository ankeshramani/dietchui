import React, {Component} from "react";
import moment from "moment";
import {message, Modal} from "antd";
import {ApiService} from "../../../services/ApiService";
import {dateFormat} from "../../../services/common";
import Loader from "../../Common/Loader";
import {Column, Summary, TotalItem} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
import {formatNumber} from "../../../services/common";

class PricingHistoryModal extends Component {
  _apiService = new ApiService();

  state = {
    pricingHistory: [],
    isLoading: true,
  }

  componentDidMount() {
     this.getPurchasingHistoryEditBid1();
  }

  getPurchasingHistoryEditBid1 = async () => {
    this.setState({isLoading: true})
    const data = await this._apiService.getPurchasingHistory(this.props.FKey_Item);
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
      this.setState({
        isLoading: false
      })
    } else {
      this.setState({
        pricingHistory: data,
        isLoading: false,
      })
    }
  }

  render() {
    const {pricingHistory = [], isLoading} = this.state;
    const {isVisible, onHide} = this.props;
    return (
      <Modal
        visible={isVisible}
        title="Purchasing History"
        onCancel={onHide}
        footer={null}
        height={500}
        width={800}
      >
        <div className="w-100-p">
          {
            isLoading ? <Loader className="mt-50"/>
              :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={pricingHistory}
                columnAutoWidth={false}
                isShowFilterRow={false}
                keyExpr="PKey_OP_Invoice_Detail"
              >
                <Column alignment="left" caption={'PO Date'} cellRender={(record) => {
                  return <span>{record.data ? moment(record && record.data && record.data.PoDate).format(dateFormat) : ''}</span>
                }}/>
                <Summary recalculateWhileEditing={true}>
                  <TotalItem
                    column={'ExtendedPrice'}
                    summaryType={'sum'}
                    displayFormat={(record) => {
                      return formatNumber(record , 2)
                    }}
                  />
                </Summary>
                <Column alignment="left" caption={'PO Num'} dataField={'PoNumber'}/>
                <Column alignment="left" caption={'Facility'} dataField={'Facility_Name'}/>
                <Column alignment="left" caption={'Supplier'} dataField={'Vendor'}/>
                <Column alignment="left" caption={'Qty'} dataField={'Qty'}/>
                <Column caption={'Extended'} dataField={'ExtendedPrice'} cellRender={(record)=>{
                  return<span>{formatNumber(record.data.ExtendedPrice , 2)}</span>
                }}/>
              </CustomGrid>
          }
        </div>
      </Modal>

    )
  }
}
export default PricingHistoryModal
