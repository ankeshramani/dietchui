import React, {Component} from "react";
import {CancelToken} from "axios";
import {Col, Row} from "reactstrap";
import {Checkbox, Icon, Input, message, Modal, Radio, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import "./BidModal.scss";

class SearchSupplierBidModal extends Component {
  _apiService = new ApiService();

  state ={
      searchKey: '',
      dataSource: [],
      searchValue: '',
      isSaving: false,
      lookUp: 'bidName',
    }

  onSubmit = async () => {
    const {dataSource = [], lookUp} = this.state;
    if (dataSource.some(x => x.selected)) {
      this.setState({
        isSaving: true,
      });
      const items = dataSource.filter(x => x.selected);
      if (lookUp !== 'itemName') {
        for (let i in items) {
          items[i].FKey_Item = await this.getSupplierLinkBySupplierBid(items[i].PKey_OP_Supplier_Bid);
        }
      }
      const objData = items.map(item => {
        return {
          "PKey_OP_OrderGuide_Detail": 0,
          "FKey_OP_OrderGuide": Number(this.props.orderGuideId),
          "DateEntered": new Date(),
          "SupplierBidName": item.Name,
          "SupplierName": item.SupplierName,
          "FKey_Item": item.FKey_Item || item.PKey_Item || null,
          "FKey_OP_Catalog": null,
          "FKey_OP_Department": null,
          "FKey_OP_Ledger": null,
          "FKey_OP_InventoryLocation": null,
          "FKey_OP_Supplier_Bid": item.PKey_OP_Supplier_Bid || null,
          "ParLevel": 0,
          "Qty": 0,
          "Inv_Case": 0,
          "Inv_Each": 0,
          "FKey_Item_Prd_ItemType": null,
          "QtyNeeded": null,
          "FKey_Item_Unit": null,
          "QtyInventory": null,
          ItemPack: item.Pack || 0,
          ItemSize: item.Size || 0,
          UOM: item.Measure || ''
        };
      });
      let isError = false;
      for (let j in objData) {
        const data = await this.addOrderDetails(objData[j]);
        if (data === -1) {
          isError = true;
        } else {
          objData[j].PKey_OP_OrderGuide_Detail = data;
        }
      }
      if (isError) {
        message.error('Something went wrong. Please try again later!');
      } else {
        message.success('Order Guide Details Added Successfully');
      }
      this.props.onAddOrderDetails(objData);
      this.setState({
        isSaving: false,
      });
    } else {
      return message.error('Please select at least one supplier bid to be added');
    }
  }

  getSupplierLinkBySupplierBid = async (bidId) => {
    const data = await this._apiService.GetSupplierLinkBySupplierBid(bidId);
    if (data && !data.error && data.length) {
      return data[0].FKey_Item;
    }
    return '';
  }

  addOrderDetails = async (payload) => {
    const data  = await this._apiService.updateOrderGuideDetails(payload);
    if (!data || data.error){
      return -1;
    } else {
      return data;
    }
  }

  handleSearch = async (event) => {
    const {value} = event.target;
    const {lookUp} = this.state;
    if (value.trim().length < 3) {
      if (!value.trim()) {
        return this.setState({
          dataSource: []
        })
      }
      return;
    }
    if(lookUp === "itemName"){
      const payload = {
        "Description": value,
        "MenuDescription": "",
        "OrderBy": "Itm_Descr desc",
        "Page": 1,
        "PageSize": 10,
        "UseLikeSearch": true
      };
      let dataSource = [];
      if (this.state.source) {
        this.state.source.cancel();
      }
      const source = CancelToken.source();
      this.setState({
        source,
      });
      const data = await this._apiService.searchItem(payload, source);
      if (!data.error) {
        dataSource = data.results || [];
      }
      this.setState({
        dataSource,
        source: null,
        searchKey: value
      });

    } else {
      const payload = {
        "Name": lookUp === 'bidName' ? value : '',
        "IdNumber": lookUp === 'idNumber' ? value : '',
        "Min": lookUp === 'MIN' ? value : '',
        "ItemName": lookUp === 'itemName' ? value : '',
        "Page": 1,
        "PageSize": 50,
        "UseLikeSearch": true,
      };
      let dataSource = [];
      if (this.state.source) {
        this.state.source.cancel();
      }
      const source = CancelToken.source();
      this.setState({
        source,
      });
      const data = await this._apiService.searchSupplierBid(payload, source);
      if (data && !data.error) {
        dataSource = (data.results || []).sort((a,b) => {
          return a.Name > b.Name ? 1 : -1;
        });
      }
      this.setState({
        dataSource,
        source: null,
        searchKey: value
      });
    }


  };

  onSelectRecord = (index) => {
    const {dataSource} = this.state;
    dataSource[index.rowIndex].selected = !dataSource[index.rowIndex].selected;
    this.setState({
      dataSource
    });
    this.refreshGrid()
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  radioChange =  (e) => {
    const {searchKey} = this.state;
    const value = e.target.value;
    this.setState({
      lookUp: value,
    },async () =>{
      this.setState({
        dataSource: []
      });
      if(e.target.value === 'itemName'){
        const payload = {
          "Description": searchKey,
          "MenuDescription": "",
          "OrderBy": "Itm_Descr desc",
          "Page": 1,
          "PageSize": 10,
          "UseLikeSearch": true
        };
        let dataSource = [];
        if (this.state.source) {
          this.state.source.cancel();
        }
        const source = CancelToken.source();
        this.setState({
          source,
        });
        const data = await this._apiService.searchItem(payload, source);
        if (!data.error) {
          dataSource = data.results || [];
        }
        this.setState({
          dataSource,
          source: null,
        });
      }else {
        const payload = {
          "Name": value === 'bidName' ? searchKey : '',
          "IdNumber": value === 'idNumber' ? searchKey : '',
          "Min": value === 'MIN' ? searchKey : '',
          "ItemName": value === 'itemName' ? searchKey : '',
          "Page": 1,
          "PageSize": 50,
          "UseLikeSearch": true,
        };
        let dataSource = [];
        if (this.state.source) {
          this.state.source.cancel();
        }
        const source = CancelToken.source();
        this.setState({
          source,
        });
        const data = await this._apiService.searchSupplierBid(payload, source);
        if (data && !data.error) {
          dataSource = (data.results || []).sort((a,b) => {
            return a.Name > b.Name ? 1 : -1;
          });
        }
        this.setState({
          dataSource,
          source: null,
        });
      }
    });
}

  render() {
    const {isLookUp, onToggleLookUpModal, } = this.props;
    const {dataSource = [], isSaving, lookUp } = this.state;
    return (
      <Modal
        visible={isLookUp}
        title="Add Supplier Bid"
        okText={isSaving ? <Spin className="color-white"/> : 'Add Bid'}
        onCancel={onToggleLookUpModal}
        onOk={this.onSubmit}
        wrapClassName="add-bid-modal"
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Row className="pt-5">
          <Col md="12" className="mb-10">
            <Radio.Group value={lookUp} onChange={this.radioChange}>
              <Radio value={'bidName'}>Bid Name</Radio>
              <Radio value={'itemName'}>Item Name</Radio>
              <Radio value={'idNumber'}>ID Number</Radio>
              <Radio value={'MIN'}>MIN</Radio>
            </Radio.Group>
          </Col>
          <Col md="12">
            <Input className="w-100-p mb-10" autoFocus={true} addonBefore={<Icon type="search" />} name="searchKey" onChange={this.handleSearch} />
          </Col>
          <Col md="12">
            {
              lookUp === "itemName" ? <CustomGrid
                  refCallback={(dg) => this.dg = dg}
                  dataSource={dataSource}
                  columnAutoWidth={false}
                  isHideSearchPanel={true}
                  keyExpr="PKey_Item"
                  gridClass="order-guid-lookup"
                >
                  <Column alignment="left" width={"10%"} caption={'Select'} cellRender={(record) => {
                    return <Checkbox checked={record && record.data.selected} onChange={(event) => this.onSelectRecord(record)}/>
                  }}/>
                  <Column alignment="left" caption={'Item Name'} dataField={'Itm_Descr'}/>
                </CustomGrid> :
                <CustomGrid
                  refCallback={(dg) => this.dg = dg}
                  dataSource={dataSource}
                  columnAutoWidth={false}
                  isHideSearchPanel={true}
                  keyExpr="PKey_OP_Supplier_Bid"
                  gridClass="order-guid-lookup"
                >
                  <Column alignment="left" width={"10%"} caption={'Select'} cellRender={(record) => {
                    return <Checkbox checked={record && record.data.selected} onChange={(event) => this.onSelectRecord(record)}/>}}/>
                  <Column alignment="left" caption={'Supplier'} dataField={'SupplierName'}/>
                  <Column alignment="left" caption={'Product No'} dataField={'IDNumber'}/>
                  <Column alignment="left" sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                  <Column alignment="left" caption={'Price'} dataField={'Price'}/>
                  <Column alignment="left" caption={'Brand'} dataField={'Brand'}/>
                  <Column alignment="left" caption={'Min'} dataField={'MIN'}/>
                </CustomGrid>
            }
          </Col>
        </Row>
      </Modal>
    )
  }

}

export default SearchSupplierBidModal;
