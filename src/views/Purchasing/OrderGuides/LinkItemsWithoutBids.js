import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import { DropDownBox } from 'devextreme-react';
import { Selection, Paging, Scrolling, Column } from 'devextreme-react/data-grid';
import {Button, message, Modal, Spin} from "antd";
import CustomGrid from "../../../components/CustomGrid";
import Loader from "../../Common/Loader";

class LinkItemsWithoutBids extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefSupplier = React.createRef();
    this.state = {
      isLoading: false,
      itemNameList: [],
      supplierBidList: []
    };
  }

  componentDidMount() {
    this.getItemNames();
    this.getSupplier();
  }

  getItemNames = async () => {
    this.setState({
      isLoading: true
    });
    const data = await this._apiService.getItemNames();
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!');
      this.setState({
        isLoading: false,
      });
    } else {
      this.setState({
        itemNameList: data,
        isLoading: false,
      })
    }
  };

  getSupplier = async () => {
    this.setState({
      isLoading: true,
    });
    const data = await this._apiService.getSupplier(this.props.facilityKey);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!');
      this.setState({
        isLoading: false,
      })
    } else {
      this.setState({
        supplierList: data,
        isLoading: false,
      })
    }
  };

  getSupplirBids = async (supplerId) => {
    const data = await this._apiService.getSupplirBids(supplerId)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!');
      return [];
    } else {
      return data;
    }

  }

  onSelectionChanged = async (record, index) => {
    const {itemNameList} = this.state;
    itemNameList[index].supplierName = record.selectedRowsData[0].Name;
    itemNameList[index].supplierId = record.selectedRowsData[0].PKey_OP_Supplier;
    itemNameList[index].supplierBidId = '';
    this.setState({
      itemNameList,
    });
    this.refreshGrid();
    itemNameList[index].supplierBidList = await this.getSupplirBids(record.selectedRowsData[0].PKey_OP_Supplier);
    this.setState({
      itemNameList,
    }, () => this.refreshGrid());
    this.widgetRefSupplier.current.instance.close();
  };

  onBidSelectionChanged = async (record, index) => {
    const {itemNameList} = this.state;
    itemNameList[index].supplierBidId = record.selectedRowsData[0].PKey_OP_Supplier_Bid;
    itemNameList[index].supplierBidName = record.selectedRowsData[0].Name;
    this.setState({
      itemNameList,
    });
    this.widgetRef.current.instance.close();
    this.refreshGrid();
  };

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onSaveSupplierBid = async () => {
    const {itemNameList} = this.state;
    let data = itemNameList.filter((x) => x.supplierBidId);
    for (let index in data) {
      await this._apiService.changeSupplierBid(data[index].fKey_Item, data[index].supplierBidId, '')
    }
    message.success('Bids links Items Successfully!');
    this.props.onToggleLinkItemsWithoutBidsModal();
  }

  render() {
    const {onToggleLinkItemsWithoutBidsModal, isLinkItemsWithoutBids} = this.props;
    const {itemNameList, supplierList, isLoading, isSaving} = this.state;
    return(
      <Modal
        visible={isLinkItemsWithoutBids}
        title="Items without Bids"
        onCancel={onToggleLinkItemsWithoutBidsModal}
        footer={[
          <Button key="submit" type="primary" onClick={this.onSaveSupplierBid}>
            {isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
          </Button>,
          <Button key="back" onClick={onToggleLinkItemsWithoutBidsModal}>
            Cancel
          </Button>,
        ]}
        height={400}
        width={800}
        size={"small"}
      >
        {
          isLoading ? <Loader className="mt-50" /> : <CustomGrid
            refCallback={(dg) => this.dg = dg}
            dataSource={itemNameList}
            columnAutoWidth={false}
            gridClass="order-guid"
          >
            <Column alignment="left" caption={'Item'} dataField={'itemName'}/>
            <Column alignment="left" caption={'Order Guide'} dataField={'orderGuideName'}/>
            <Column alignment="left" caption={'Supplier'} cellRender={(itemRecord) => {
              return(
                <DropDownBox
                  ref={this.widgetRefSupplier}
                  value={(itemRecord && itemRecord.data && itemRecord.data.supplierName) || ''}
                  valueExpr={'PKey_OP_Supplier'}
                  deferRendering={false}
                  displayExpr={(item) => item && `${item.Name }`}
                  placeholder={'Select a value...'}
                  dataSource={supplierList}
                  contentRender={()=>{
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={supplierList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onSelectionChanged(record, itemRecord.rowIndex)}
                        height={'100%'}>
                        <Selection mode={'single'} />
                        <Scrolling mode={'infinite'} />
                        <Paging enabled={true} pageSize={10} />
                        <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                      </CustomGrid>
                    )
                  }}
                />
              )
            }}/>
            <Column alignment="left" caption={'Bid'} cellRender={(itemRecord) => {
              if (itemRecord.data.supplierName && (itemRecord.data.supplierBidList || []).length) {
                return(
                  <DropDownBox
                    ref={this.widgetRef}
                    value={(itemRecord && itemRecord.data && itemRecord.data.supplierBidName) || ''}
                    valueExpr={'PKey_OP_Supplier'}
                    deferRendering={false}
                    displayExpr={(item) => item && `${item.Name }`}
                    placeholder={'Select a value...'}
                    dataSource={itemRecord.data.supplierBidList}
                    contentRender={()=>{
                      return (
                        <CustomGrid
                          refCallback={(dg) => this.dg = dg}
                          dataSource={itemRecord.data.supplierBidList}
                          hoverStateEnabled={true}
                          onSelectionChanged={(record) => this.onBidSelectionChanged(record, itemRecord.rowIndex)}
                          height={'100%'}>
                          <Selection mode={'single'} />
                          <Scrolling mode={'infinite'} />
                          <Paging enabled={true} pageSize={10} />
                          <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                        </CustomGrid>
                      )
                    }}
                  />
                )
              } else {
                return 'No Bid'
              }
            }}/>
          </CustomGrid>
        }
      </Modal>
    )
  }
}

export default LinkItemsWithoutBids
