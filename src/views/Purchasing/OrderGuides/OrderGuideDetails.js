import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import {Button, Drawer, Dropdown, Menu, message, Modal, Spin} from "antd";
import PricingHistoryModal from "./PricingHistoryModal";
import Loader from "../../Common/Loader";
import {ApiService} from "../../../services/ApiService";
import clonedeep from "lodash.clonedeep";
import AddNewOrderDetails from "./AddNewOrderDetails";
import EditOrderDeatail from "./EditOrderDeatail";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Editing, Lookup, Paging, Scrolling, Selection, KeyboardNavigation} from "devextreme-react/data-grid";
import SearchSupplierBidModal from "./SearchSupplierBidModal";
import {DropDownBox} from "devextreme-react";
import LinkAnotherBid from "./LinkAnotherBid";

class OrderGuideDetails extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.state = {
      searchKey: '',
      details: [],
      loading: true,
      activeTab: '1',
      selectedRecord: null,
      isModal: false,
      isSaving: false,
      isDataFilter: false,
      selectedEditBidRecord: {},
      LedgerNumber: null,
      DepartmentName: '',
      Locked_FKey_OP_Supplier_Bid: '',

    }
  }

  componentDidMount() {
    this.getOrderGuides();
  }

  getOrderGuides = async () => {
    this.setState({
      loading: true,
    });
    const {orderData} = this.props;
    const data = await this._apiService.getOrderGuideDetails(orderData.PKey_OP_OrderGuide);
    const newState = {loading: false};
    if (data && !data.error) {
      newState.details = data;
      (newState.details || []).sort((a,b) => {
        return a.SupplierBidName > b.SupplierBidName ? 1 : -1;
      });
      const qtyLength = (newState.details || []).filter((x)=> Number(x.Qty) > 0)
      this.props.orderGuideDetails(newState.details.length, qtyLength)
    } else {
      newState.details = [];
    }
    if (data.error) {
      message.error('Something went wrong! Please try again.');
    }
    this.setState({
      ...newState,
    }, () => {
      const firstRecord = newState.details && newState.details[0];
      this.setState({
        selectedEditBidRecord: firstRecord || {},
        selectedItemKeys: firstRecord ? [firstRecord.PKey_OP_OrderGuide_Detail] : [],
        Locked_FKey_OP_Supplier_Bid: firstRecord.Locked_FKey_OP_Supplier_Bid
      });
    })
  }

  /*onEditRecord = (selectedRecord, event) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
  }*/

  saveRecord = async (objPayload, value) => {
    const {details = [], selectedRecord} = this.state;
    if (this.state.isSaving) {
      return;
    }
    this.setState({
      isSaving: true
    });
    const payload = value ? {...objPayload} : {...selectedRecord};
    const data  = await this._apiService.updateOrderGuideDetails(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
     // message.success('Order Guide Detail Updated Successfully');
      const Index = details.findIndex(x => x.PKey_OP_OrderGuide_Detail === payload.PKey_OP_OrderGuide_Detail);
      if (Index > -1) {
        details[Index] = payload;
        const qtyLength = (details || []).filter((x)=> Number(x.Qty) > 0)
        this.props.orderGuideDetails(details.length, qtyLength)
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        isModal: false,
      });
      this.refreshGrid()
    }
  }

  updateSupplierBid = async (FKey_OP_Supplier_Bid, noMessage) => {
    const {details = [], selectedEditBidRecord = {}} = this.state;
    this.setState({
      isSaving: true
    })
    const payload = {
      ...selectedEditBidRecord,
      FKey_OP_Supplier_Bid
    }
    const data  = await this._apiService.updateEditBidDetail(selectedEditBidRecord.PKey_OP_OrderGuide_Detail,FKey_OP_Supplier_Bid);
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
      !noMessage && message.success('Order Guide Detail Updated Successfully');
      const Index = details.findIndex(x => x.PKey_OP_OrderGuide_Detail === payload.PKey_OP_OrderGuide_Detail);
      if (Index > -1) {
        details[Index] = payload;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        details,
      });
      this.refreshGrid();

    }
  }

  addNewRecord = async (payload) => {
    const {details = []} = this.state;
    this.setState({
      isSaving: true
    })
    const data  = await this._apiService.updateOrderGuideDetails(payload);
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
      message.success('Order Guide Details Added Successfully');
      const item = await this._apiService.getOrderGuideDetailById(data);
      if (item && !item.error) {
        details.push(item);
      }
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        details,
        LedgerNumber: null,
        DepartmentName: ''
      });
    }
    this.refreshGrid()
  }

  onCancelSaveRecord = () => {
    this.setState({
      selectedRecord: null,
    });
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord,
    });
  }

  newOderGuideModalOpen = (selectedRecord) => {
    const newState = {isModal: !this.state.isModal};
    if (selectedRecord) {
      newState.selectedRecord = clonedeep(selectedRecord);
    }
    this.setState({
      ...newState
    });
  }

  onEditBidRecord = (data) => {
    this.setState({
      selectedEditBidRecord: data && data.selectedRowsData[0],
      selectedItemKeys: data.selectedRowKeys,
      orderGuideItemId: data && data.selectedRowsData[0].FKey_Item,
      orderGuideUnitItemId: data && data.selectedRowsData[0].FKey_Item_Unit,
    });
  }

  togglePricingModal = (pricingFkeyItem) => {
    this.setState({
      pricingFkeyItem,
      isPricingHistoryModal: !this.state.isPricingHistoryModal
    });
  }

  deleteBid = async (deleteRecordId) => {
    const item = await this._apiService.deleteOrderGuideDetailById(deleteRecordId);
    if (item && item === 'Success') {
      message.success('Detail Deleted Successfully!');
      const { details = [] } = this.state;
      this.setState({
        details: details.filter(x => x.PKey_OP_OrderGuide_Detail !== deleteRecordId),
        selectedEditBidRecord: undefined
      });

    } else {
      message.error('Something went wrong! Please try again later.')
      this.refreshGrid()
    }
  }

  onAddOrderDetails = (objData) => {
    let {details} = this.state;
    details = [...details, ...objData];
    this.setState({
      details,
    }, () => this.refreshGrid());
    this.props.onToggleLookUpModal();
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onRowUpdating = (selectedVewData) => {
    if (!Object.keys(selectedVewData.newData).length) {
      return;
    }
    const data = {
      ...selectedVewData.oldData,
      ...selectedVewData.newData
    };
    this.setState({
      selectedRecord: clonedeep(data)
    }, () => {
      this.saveRecord()
    })

  }

  onToggleMoveOrderGuideModal = (record) => {
    this.setState({
      isMoveOrderGuideModal: !this.state.isMoveOrderGuideModal,
      currentOrderGuideDetailId: record.PKey_OP_OrderGuide_Detail,
      selectedOrderGuideDetail: record
    })
  }

  onToggleLinkAnotherBid = (record) => {
    this.setState({
      isLinkAnotherBid: !this.state.isLinkAnotherBid,
      orderGuideItemId: record.FKey_Item,
      orderGuideUnitItemId: record.FKey_Item_Unit,
      selectedOrderGuideDetail: record
    })
  }

  onHideLinkAnotherBid = async (isLinkAnotherBid, updatedLinkBid) => {
    const {orderGuideItemId} = this.state;
    this.setState({
      isLinkAnotherBid
    })
    if(updatedLinkBid){
      const data = await this._apiService.GetSupplierEditBid(orderGuideItemId);
      if (!data || data.error){
        message.error('Something Wrong. Try again')
        this.setState({
          selectedBidId: ''
        })
      } else {
        this.setState({
          supplierBids: data,
        });
        this.refreshGrid()
      }
    }
  }

  onSelectionChanged = (record) => {
    this.setState({
      OrderGuideName: record.selectedRowsData[0].OrderGuideName,
      currentOrderGuideId: record.selectedRowsData[0].PKey_OP_OrderGuide,
    })
    this.widgetRef.current.instance.close();
  }

  lockedSupplierBid = (data) => {
    const {details, Locked_FKey_OP_Supplier_Bid} = this.state;
    const recordIndex = (details || []).findIndex((x) => x.Locked_FKey_OP_Supplier_Bid === Locked_FKey_OP_Supplier_Bid);
    if (recordIndex > -1) {
      details[recordIndex].Locked_FKey_OP_Supplier_Bid = data;
      this.setState({
        details,
        Locked_FKey_OP_Supplier_Bid: data
      })
    }
  }

  onMoveOrderGuide = async () => {
    const {currentOrderGuideDetailId, currentOrderGuideId, selectedOrderGuideDetail} = this.state;
    this.setState({
      isSaving: true
    })
    const data = await this._apiService.moveOrderGuide(currentOrderGuideDetailId, currentOrderGuideId, selectedOrderGuideDetail)
    if (data && data === 'Success') {
      message.success('Order guide detail moved Successfully!');
      const { details = [] } = this.state;
      this.setState({
        details: details.filter(x => x.PKey_OP_OrderGuide_Detail !== currentOrderGuideDetailId),
        selectedOrderGuideDetail: null,
        isSaving: false,
        isMoveOrderGuideModal:false,
      });

    } else {
      message.error('Something went wrong! Please try again later.')
      this.setState({
        isSaving: false,
        isMoveOrderGuideModal:false,
      })
    }
    this.refreshGrid()
  }

  showDrawer = () => {
    this.setState({
      isShowDrawer: !this.state.isShowDrawer,
    });
  };

  onFocusedRowChanged = (data) => {
    if (this.state.selectedItemKeys === data.row.key) {
      return;
    }
    this.setState({
      selectedEditBidRecord: data.row.data,
      selectedItemKeys: data.row.key,
      orderGuideItemId: data.row.data.FKey_Item,
      Locked_FKey_OP_Supplier_Bid: data.row.data.Locked_FKey_OP_Supplier_Bid,
      orderGuideUnitItemId: data.row.data.FKey_Item_Unit,
    });
  }

  render() {
    const {loading, isModal, isSaving, details , isMoveOrderGuideModal, OrderGuideName, selectedRecord, selectedEditBidRecord = {}, isPricingHistoryModal, pricingFkeyItem,isShowDrawer, isLinkAnotherBid, orderGuideItemId, orderGuideUnitItemId, supplierBids = [], Locked_FKey_OP_Supplier_Bid} = this.state;
    const {inventoryColumns, isLookUp, orderGuides, orderGuideId, onToggleLookUpModal, departments, catalogs, inventoryLocations, ledgers, itemUnits, orderData, mealTimes} = this.props;
    let orderGuidesForDropDown = (orderGuides || []).filter(x => x.FKey_OP_OrderGuide !== orderData.PKey_OP_OrderGuide);
    const isDrawer = window.innerWidth < 1000;
    const editDetailsComponent = (
      <EditOrderDeatail isLinkAnotherBid={isLinkAnotherBid} orderGuideList={details} onToggleLinkAnotherBid={this.onToggleLinkAnotherBid} onHideLinkAnotherBid={this.onHideLinkAnotherBid}
                        PKey_OP_OrderGuide_Detail={selectedEditBidRecord.PKey_OP_OrderGuide_Detail} FKey_OP_Supplier_Bid={selectedEditBidRecord.FKey_OP_Supplier_Bid}
                        FKey_Item={selectedEditBidRecord.FKey_Item} updateSupplierBid={this.updateSupplierBid} togglePricingModal={this.togglePricingModal}
                        lockedSupplierBid={this.lockedSupplierBid} orderGuideUnitItemId={orderGuideUnitItemId} supplierBids={supplierBids} mealTimes={mealTimes} Locked_FKey_OP_Supplier_Bid={Locked_FKey_OP_Supplier_Bid}/>
    );

    return (
      <div>
        {
          loading ? <Loader className="mt-50"/> :
            <div>
              {
                isDrawer && <Button type={"primary"} size={"small"} onClick={this.showDrawer}>Show Supplier Detail</Button>
              }
              <Row>
                <Col sm={isDrawer ? '12' : '7'}>
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={details}
                    columnAutoWidth={false}
                    keyExpr="PKey_OP_OrderGuide_Detail"
                    title="Items"
                    isColumnChooser={true}
                    focusedRowEnabled={true}
                    onFocusedRowChanged={this.onFocusedRowChanged}
                    gridClass="order-guid-detail"
                    onRowUpdating={this.onRowUpdating}
                  >
                    <Editing
                      refreshMode={'full'}
                      mode={'cell'}
                      selectTextOnEditStart={true}
                      allowUpdating={true}
                      useIcons={false}
                    />
                    <KeyboardNavigation enterKeyDirection="row" />
                    <Column alignment={"left"} width={"8%"} caption={'Qty'} dataField={'Qty'}/>
                    <Column alignment={"left"} width={"8%"} caption={'Par'} dataField={'ParLevel'}/>
                    <Column alignment={"left"} width={"25%"} allowEditing={false} caption={'Name'} dataField={'SupplierBidName'}/>
                    <Column alignment="left" caption={'Pack/Size'} allowEditing={false} cellRender={(record) => {
                      return <span>{`${record.data.ItemPack || record.data.ItemPack === 0 ? record.data.ItemPack : ''}/${record.data.ItemSize || record.data.ItemSize === 0 ? record.data.ItemSize : ''} ${record.data.UOM || ''}`}</span>
                    }} />
                    <Column alignment={"left"} caption={'Ledger'} dataField={'FKey_OP_Ledger'} cellRender={(record) => {
                      const data = ledgers && ledgers.find(x => x.PKey_OP_Ledger === record.data.FKey_OP_Ledger)
                      return (<span>{data && data.LedgerNumber}</span>);
                    }}>
                      <Lookup dataSource={ledgers} valueExpr={'PKey_OP_Ledger'} displayExpr={'LedgerNumber'} />
                    </Column>
                    <Column alignment={"left"}  caption={'Department'} dataField={'FKey_OP_Department'} cellRender={(record) => {
                      const data = departments && departments.find(x => x.PKey_OP_Department === record.data.FKey_OP_Department)
                      return (<span>{data && data.Name}</span>);
                    }}>
                      <Lookup dataSource={departments} valueExpr={'PKey_OP_Department'} displayExpr={'Name'}  />
                    </Column>
                    <Column  alignment={"left"} visible={inventoryColumns} allowEditing={false} caption={'Qty Inventory'} dataField={'QtyInventory'}/>
                    <Column alignment={"left"} visible={inventoryColumns} allowEditing={false} caption={'Qty Needed'} dataField={'QtyNeeded'}/>
                    <Column alignment={"left"} visible={inventoryColumns} callowEditing={false} aption={'Highest Price'} dataField={'HighestPrice'}/>
                    <Column alignment={"left"} visible={inventoryColumns}  allowEditing={false} caption={'Lowest Price'} dataField={'LowestPrice'} cellRender={(record) => {
                      return (<span>{record && record.data["LowestPrice "]}</span>)
                    }}/>
                    <Column alignment={"left"} visible={inventoryColumns} allowEditing={false} caption={'Locked in Price'} cellRender={(record) => {
                      return (<span>{record && record.data && record.data["LockedInPrice  "]}</span>)
                    }}/>
                    <Column alignment={"left"} visible={inventoryColumns} allowEditing={false} caption={'Current Price'} dataField={'CurrentPrice'}/>
                    <Column alignment={"left"} width={60} allowEditing={false} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={onToggleLookUpModal}>New</span>}   cellRender={(record) => {
                      const menu = (
                        <Menu>
                          <Menu.Item onClick={() => this.newOderGuideModalOpen(record.data)}>
                            <span className="text-primary ml-5 cursor-pointer">Edit Detail</span>
                          </Menu.Item>
                          <Menu.Item onClick={() => this.onToggleLinkAnotherBid(record.data)}>
                            <span className="text-primary ml-5 cursor-pointer">Link Another BId</span>
                          </Menu.Item>
                          <Menu.Item onClick={() => this.onToggleMoveOrderGuideModal(record.data)}>
                            <span className="text-primary ml-5 cursor-pointer">Move to Another Order Guide</span>
                          </Menu.Item>
                          <Menu.Item onClick={() => this.togglePricingModal(record.data.FKey_Item)}>
                            <span className="text-primary ml-5 cursor-pointer">Purchasing History</span>
                          </Menu.Item>
                          <hr className="delete-btn-menu" />
                          <Menu.Item onClick={() => this.deleteBid(record.data.PKey_OP_OrderGuide_Detail)}>
                            <span className="text-primary ml-5 cursor-pointer">Delete</span>
                          </Menu.Item>
                        </Menu>
                      );
                        return (
                          <div className="flex-align-item-center d-flex">
                            <Dropdown overlay={menu} trigger={['click']}>
                              <i className="icon-options-vertical text-primary cursor-pointer" />
                            </Dropdown>
                          </div>
                        );
                    }}/>
                  </CustomGrid>
                </Col>
                {
                  isDrawer ?
                    <Drawer
                      title={selectedEditBidRecord.SupplierName ? selectedEditBidRecord.SupplierName : 'Supplier'}
                      placement="right"
                      visible={isShowDrawer}
                      onClose={this.showDrawer}
                      width={768}
                    >
                      {editDetailsComponent}
                    </Drawer> :
                    <Col sm="5">
                      {editDetailsComponent}
                    </Col>
                }
              </Row>
              <AddNewOrderDetails newOderGuideModalOpen={this.newOderGuideModalOpen} orderData={this.props.orderData} isModal={isModal}
                                  isSaving={isSaving} saveRecord={this.saveRecord} orderDetailRecord={selectedRecord || {} }
                                  ledgers={ledgers} departments={departments} catalogs={catalogs} inventoryLocations={inventoryLocations}
                                  itemUnits={itemUnits}/>
            {isPricingHistoryModal && <PricingHistoryModal FKey_Item={pricingFkeyItem} isVisible={isPricingHistoryModal} onHide={this.togglePricingModal} />}
              {isLookUp && <SearchSupplierBidModal isLookUp={isLookUp} onAddOrderDetails={this.onAddOrderDetails} onToggleLookUpModal={this.props.onToggleLookUpModal} orderGuideId={orderGuideId}/> }
              {
                isLinkAnotherBid && <LinkAnotherBid isLinkAnotherBid={isLinkAnotherBid} onToggleLinkAnotherBid={this.onToggleLinkAnotherBid} orderGuideItemId={orderGuideItemId} orderGuideUnitItemId={orderGuideUnitItemId} onHideLinkAnotherBid={this.onHideLinkAnotherBid}/>
              }
            </div>
        }
        <Modal
          visible={isMoveOrderGuideModal}
          title="Move to Another Order Guide"
          onCancel={this.onToggleMoveOrderGuideModal}
          onOk={this.onMoveOrderGuide}
          footer={[
            <Button key="submit" type="primary" onClick={this.onMoveOrderGuide}>
              {isSaving ? <Spin className="white" size={"small"}/>  : 'Move'}
            </Button>,
            <Button key="back" onClick={this.onToggleMoveOrderGuideModal}>
              Cancel
            </Button>,

          ]}
          height={400}
          size={"small"}
        >
          <div className="w-100-p">
            <DropDownBox
              ref={this.widgetRef}
              value={OrderGuideName}
              valueExpr={'PKey_OP_OrderGuide'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.OrderGuideName }`}
              placeholder={'Select a value...'}
              dataSource={orderGuidesForDropDown}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={orderGuidesForDropDown}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column sortOrder={'asc'} caption={'Name'} dataField={'OrderGuideName'}/>
                  </CustomGrid>
                )
              }}
            />
          </div>
        </Modal>
      </div>
    )
  }

}
export default OrderGuideDetails;
