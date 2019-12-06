import React, {Component} from "react";
import {Checkbox, message, Icon, Button, Dropdown, Menu} from "antd";
import moment from "moment";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {dateFormat, formatNumber} from "../../../services/common";
import CustomGrid from "../../../components/CustomGrid";
import {Column, GroupPanel} from "devextreme-react/data-grid";
import LinkAnotherBid from "./LinkAnotherBid";

class EditOrderDeatail extends Component {
  _apiService = new ApiService();
  constructor(props){
    super(props)
    this.state = {
      isLoading: false,
      pricingHistoryLoading: false,
      selectedBidId: '',
      supplierBids: [],
      pricingHistory: [],
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.PKey_OP_OrderGuide_Detail !== this.props.PKey_OP_OrderGuide_Detail) {
      if (this.props.FKey_Item) {
        this.getSupplierEditBid();
        this.getPurchasingHistory();
        this.getOrderGuideDetailUsage()
        this.setState({
          selectedBidId: this.props.FKey_OP_Supplier_Bid,
        });
      } else {
        this.setState({
          supplierBids: [],
          pricingHistory: [],
          orderGuideDetailUsageList:[],
          selectedBidId: null
        });
      }
    }
    this.refreshGrid()
  }
  componentWillReceiveProps(nextProps, nextContext) {
    if(nextProps.supplierBids.length){
      this.setState({
        supplierBids: nextProps.supplierBids
      })
    }

  }

  lockSupplierBid = async (record) => {
    const {supplierBids} = this.state;
    const selectedRecordIndex = supplierBids.findIndex(x=> Number(x.PKey_OP_Supplier_ItemLink) === Number(record.data.PKey_OP_Supplier_ItemLink));
    const supplierBidId = supplierBids[selectedRecordIndex].FKey_OP_Supplier_Bid;
    const data = await this._apiService.lockSupplierBid(supplierBidId, this.props.PKey_OP_OrderGuide_Detail);
    if(!data || data.error){
      message.error('Something wrong')
    } else {
      this.props.lockedSupplierBid(supplierBidId);
    }
  }

  unLockSupplierBid = async (record) => {
    const {supplierBids} = this.state;
    const selectedRecordIndex = supplierBids.findIndex(x=> Number(x.PKey_OP_Supplier_ItemLink) === Number(record.data.PKey_OP_Supplier_ItemLink));
    const supplierBidId = supplierBids[selectedRecordIndex].FKey_OP_Supplier_Bid;
    const data = await this._apiService.unLockSupplierBid(supplierBidId, this.props.PKey_OP_OrderGuide_Detail);
    if(!data || data.error){
      message.error('Something wrong')
    } else {
      this.props.lockedSupplierBid(0);
    }
  }

  getSupplierEditBid = async () => {
    this.setState({isLoading: true})
    const data = await this._apiService.GetSupplierEditBid(this.props.FKey_Item);
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isLoading: false,
        selectedBidId: ''
      })
    } else {
      this.setState({
        supplierBids: data || [],
        isLoading: false,
      })
      this.refreshGrid()
    }
  }

  getPurchasingHistory = async () => {
    this.setState({pricingHistoryLoading: true})
    const data = await this._apiService.getPurchasingHistory(this.props.FKey_Item);
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
      this.setState({
        pricingHistoryLoading: false
      })
    } else {
      this.setState({
        pricingHistory: data || [],
        pricingHistoryLoading: false
      })
    }
  }

  getOrderGuideDetailUsage = async () => {
    this.setState({orderGuideDetailUsageLoading: true})
    const data = await this._apiService.getOrderGuideDetailUsage(this.props && this.props.PKey_OP_OrderGuide_Detail);
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
      this.setState({
        orderGuideDetailUsageLoading: false
      })
    } else {
      this.setState({
        orderGuideDetailUsageList: data || [],
        orderGuideDetailUsageLoading: false
      })
    }
  }

  onSelectRecord = (event, record) => {
    if (event.target.checked) {
      this.props.updateSupplierBid(record.FKey_OP_Supplier_Bid, true);
      this.setState({
        selectedBidId: record.FKey_OP_Supplier_Bid
      });
      this.refreshGrid()
    }
  }

  onToggleLinkAnotherBid = () => {
    this.setState({
      isLinkAnotherBid: !this.state.isLinkAnotherBid,
    })
  }

  onHideLinkAnotherBid = async (isLinkAnotherBid, updatedLinkBid) => {
    this.setState({
      isLinkAnotherBid
    });
    if(updatedLinkBid){
      const data = await this._apiService.GetSupplierEditBid(this.props.FKey_Item);
      if (!data || data.error){
        message.error('Something Wrong. Try again')
        this.setState({
          selectedBidId: '',
        })
      } else {
        this.setState({
          supplierBids: data || [],
        },()=> this.refreshGrid());

      }
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }



  render() {
    const {isLoading, supplierBids = [], pricingHistory =[], pricingHistoryLoading, orderGuideDetailUsageList = [], orderGuideDetailUsageLoading, isLinkAnotherBid} = this.state;
    const {mealTimes, Locked_FKey_OP_Supplier_Bid} = this.props;
    const getMealTimes = (Mealtime) => {
     const data =  (mealTimes || []).find(x => x.pKey === Mealtime);
      if (data) {
        return data.mealTime;
      }
      return '-';
    }
    return(
      <div>

            <CustomGrid
              refCallback={(dg) => this.dg = dg}
              dataSource={supplierBids}
              columnAutoWidth={false}
              keyExpr="PKey_OP_Supplier_ItemLink"
              title="Suppliers"
            >

              <Column alignment="left" caption={'Selected'} width={80} cellRender={(record) => {
                return <Checkbox checked={record.data.FKey_OP_Supplier_Bid === this.state.selectedBidId} onChange={(event) => this.onSelectRecord(event, record.data)}/>
              }}/>
              <Column alignment="left" caption={'Product No'} width={"25%"} dataField={'ProductNo'}/>
              <Column alignment="left" caption={'Supplier'}  width={"25%"} sortOrder={'asc'} dataField={'SupplierName'}/>
              <Column alignment="left" caption={'Brand'} width={"25%"} dataField={'BrandName'}/>
              <Column alignment="left" caption={'Unit'} width={"25%"} dataField={'UnitName'}/>
              <Column alignment="left" caption={'Price'} width={80} dataField={'UnitPrice'} cellRender={(record)=>{
                return<span>{formatNumber(record.data.UnitPrice , 2)}</span>
              }}/>
              <Column alignment="left" caption={'Action'} width={80} headerCellRender={() => {
                return (
                  <div className="flex-align-item-center d-flex">
                    <Button type="link"  className="text-primary cursor-pointer" disabled={!this.props.orderGuideList.length}  onClick={this.onToggleLinkAnotherBid}>New</Button>
                  </div>
                )
              }} cellRender={(record)=>{
                const menu = (
                  <Menu>
                    <Menu.Item onClick={() => this.lockSupplierBid(record)}>
                      <span className="text-primary ml-5 cursor-pointer">Lock</span>
                    </Menu.Item>
                  </Menu>
                );
                return <span className="text-primary cursor-pointer">
                  {record.data.FKey_OP_Supplier_Bid !=  Locked_FKey_OP_Supplier_Bid ?
                    <div className="flex-align-item-center d-flex">
                      <Dropdown overlay={menu} trigger={['click']}>
                        <i className="icon-options-vertical text-primary cursor-pointer" />
                      </Dropdown>
                    </div> :
                    <Icon type="lock" onClick={()=> this.unLockSupplierBid(record) } style={{fontSize: 15}}/>
                  }
                  </span>
              }}/>
            </CustomGrid>


            <div className="mt-10">
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={pricingHistory}
                columnAutoWidth={false}
                keyExpr="PKey_OP_Invoice_Detail"
                title="History"
              >
                <GroupPanel visible={true} emptyPanelText={''} />
                <Column alignment="left" caption={'PO Date'} cellRender={(record) => {
                  return <span>{record.data ? moment(record && record.data && record.data.PoDate).format(dateFormat) : ''}</span>
                }}/>
                <Column alignment="left" caption={'PO Num'} dataField={'PoNumber'}/>
                <Column alignment="left" caption={'Facility'} dataField={'Facility_Name'}/>
                <Column alignment="left" caption={'Supplier'} sortOrder={'asc'} dataField={'Vendor'} groupIndex={null}/>
                <Column alignment="left" caption={'Qty'} dataField={'Qty'}/>
                <Column alignment="left" caption={'Extended'} cellRender={(record) => {return <span>{formatNumber(record.data.ExtendedPrice, 2)}</span>}}/>
              </CustomGrid>
            </div>


            <div className="mt-10">
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={orderGuideDetailUsageList}
                columnAutoWidth={false}
                isColumnChooser={true}
                keyExpr="PKey_OP_OrderGuide_Detail_Usage"
                title="Production Needs"
              >
                <GroupPanel visible={true} emptyPanelText={''} />
                <Column alignment="left" caption={'Menu Date'} cellRender={(record) => {
                  return <span>{record.data ? moment(record && record.data && record.data.MenuDate).format(dateFormat) : ''}</span>
                }}/>
                <Column alignment="left" caption={'Day'} dataField={'Day'}/>
                <Column alignment="left" caption={'Mealtime'} dataField={'Mealtime'} cellRender={(record)=>{
                  return (<span>{getMealTimes(record.data.Mealtime)}</span> )
                }}/>
                <Column alignment="left" caption={'Item'} dataField={'Itm_Descr'} groupIndex={null}/>
                <Column alignment="left" caption={'Recipe'} dataField={'Recipe'}/>
                <Column alignment="left" caption={'Size'} dataField={'Item_Size'}/>
                <Column alignment="left" visible={false} caption={'Is Meal Pattern'} dataField={'IsMealPatternItem'} cellRender={(record) => {
                  return <Checkbox checked={record && record.data && record.data.IsMealPatternItem}/>
                }}
                />
                <Column alignment="left" visible={false} caption={'Menu'} dataField={'Menu_Name'}/>
                <Column alignment="left" visible={false} caption={'Date Entered'} dataField={'DateEntered'} dataType={'date'}/>
              </CustomGrid>
            </div>

       { isLinkAnotherBid && <LinkAnotherBid isLinkAnotherBid={isLinkAnotherBid} onToggleLinkAnotherBid={this.onToggleLinkAnotherBid} orderGuideItemId={this.props.FKey_Item} orderGuideUnitItemId={this.props.orderGuideUnitItemId} onHideLinkAnotherBid={this.onHideLinkAnotherBid}/>}
      </div>
    )
  }

}
export default EditOrderDeatail
