import React, {Component} from "react";
import {Button, Drawer, message} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import AddNewBids from "./AddNewBids";
import ViewPricingHistory from "./ViewPricingHistory";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
import {formatNumber} from "../../../services/common";

class ViewBids extends Component {
  _apiService = new ApiService();
  state = {
    loading : false,
    supplierBids: [],
    selectedRecord: null,
  }

  componentDidMount() {
    this.getSupplierBids()
  }

  saveRecord = async (payload) => {
    this.setState({
      isSaving: true
    });
    const data =  await this._apiService.updateSupplirBids(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Supplier Saved Successfully');
      const {supplierBids} =  this.state;
      const Index = supplierBids.findIndex(x => x.PKey_OP_Supplier_Bid === payload.PKey_OP_Supplier_Bid);
      if (Index > -1) {
        supplierBids[Index] = payload;
      }else {
        payload.PKey_OP_Supplier_Bid = data;
        supplierBids.push(payload);
      }
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        supplierBids
      });
    }
    this.refreshGrid()
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  getSupplierBids = async () => {
    const {selectedSupplier} = this.props;
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getSupplirBids(selectedSupplier && selectedSupplier.PKey_OP_Supplier);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        supplierBids: data,
        loading: false,
      });
    }
  };

  isModalOpen = (record, isEdit) => {
    this.setState({
      isModal: !this.state.isModal,
      selectedRecord: record,
      isEdit: isEdit
    });
  };

  showDrawer = (record) => {
    this.setState({
      isDrawer: true,
      selectedBid: record
    });
  };

  onDrawerClose = () => {
    this.setState({
      isDrawer: false,
    });
  };

  render() {
    const {onViewBidsDrawerClose, isViewBid ,selectedSupplier} = this.props;
    const { loading, supplierBids, isModal, isEdit, selectedRecord, isSaving, isDrawer, selectedBid} = this.state;
    return(
      <Drawer
        title={<div>{selectedSupplier.Name ? selectedSupplier.Name : 'Supplier'} Bids</div>}
        placement={"right"}
        onClose={onViewBidsDrawerClose}
        visible={isViewBid}
        width={850}
      >
        {isDrawer && <ViewPricingHistory isDrawer={isDrawer} selectedBid={selectedBid} onDrawerClose={this.onDrawerClose}/>}
        {
          loading ? <Loader /> :
            <>
              <div className="mb-5 text-right">
                <Button type="primary" size="sm">Import Bids</Button>
              </div>
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={supplierBids}
                columnAutoWidth={false}
                keyExpr="PKey_OP_Supplier_Bid"
                columnHidingEnabled={false}
                gridClass="view-bid"
              >
                <Column alignment="left" caption={'Name'} sortOrder={'asc'} dataField={'Name'}/>
                <Column alignment="left" caption={'Brand'} dataField={'Brand'}/>
                <Column alignment="left" caption={'Pack/Size'} cellRender={(record) => {
                  return <span>{`${record.data.Pack || record.data.Pack === 0 ? record.data.Pack : ''}/${record.data.Size || record.data.Size === 0 ? record.data.Size : ''} ${record.data.Measure || ''}`}</span>
                }}/>
                <Column alignment="left" caption={'Price'} dataField={'Price'}cellRender={(record)=>{
                  return <span>{formatNumber(record.data.Price, 2)}</span>
                }}/>
                <Column alignment="left" headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>} cellRender={(record) => {
                  return (
                    <div className="flex-align-item-center">
                      <span className="text-primary mr-5 cursor-pointer" onClick={() => this.isModalOpen(record.data, true)}>Edit</span>
                      <span className="text-primary ml-5 cursor-pointer" onClick={() => this.showDrawer (record.data)}>PricingHistory</span>
                    </div>
                    )
                }}/>
              </CustomGrid>
              {isModal && <AddNewBids isSaving={isSaving} saveRecord={this.saveRecord} selectedSupplier={selectedSupplier} selectedRecord={selectedRecord} isEdit={isEdit} isModal={isModal} isModalOpen={this.isModalOpen} />}
            </>
        }
      </Drawer>
    )
  }
}
const mapStateToProps = (state) => ({
  facilitiesData: state.settings.facilitiesData,
});
export default connect(mapStateToProps)(ViewBids);
