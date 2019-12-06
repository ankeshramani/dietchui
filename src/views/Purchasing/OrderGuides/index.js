import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Icon, Menu, message, Modal, Tabs, Tooltip, notification} from "antd";
import {connect} from "react-redux";
import Loader from "../../Common/Loader";
import {ApiService} from "../../../services/ApiService";
import OrderGuideList from "../OrderGuides/OderGuideList";
import OrderGuideDetails from "../OrderGuides/OrderGuideDetails";
import TabsComp from "../../../components/TabsComp";
import {changeSettings} from "../../../redux/actions/settings";
import TotalSupplierBidModal from "./TotalSupplierBidModal";
import LinkItemsWithoutBids from "./LinkItemsWithoutBids";
import {getSettings} from "../../../services/common";

const TabPane = Tabs.TabPane;

class OrderGuides extends Component {
  _apiService = new ApiService();

  state = {
    searchKey: '',
    orderGuides: [],
    departments: [],
    catalogs: [],
    inventoryLocations: [],
    ledgers: [],
    itemUnits: [],
    mealTimes: [],
    loading: true,
    visible: false,
    inventoryColumns: false,
    isLookUp: false,
    totalModal: false,
    activeTab: '',
    isLinkItemsWithoutBids: false
  }

  componentDidMount() {
    this.getOrderGuides();
    this.getDropDownValues();
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  openNotification = () => {
    const {facilitiesData, facilityKey} = this.props;
    const data = (facilitiesData || []).find((x) => Number(x.PKey_Facility) === Number(facilityKey))
    console.log(data)
    notification.open({
      message:
        `Please launch your Desktop Application and navigate to the ${data && data.Resident} Data Grid > Purchasing and Click Generate. (In the future, you will be able to generate from within this site)`,
      onClick: () => {
      },
    });
  };

  getOrderGuides = async () => {
    this.setState({
      loading: true
    });
    const {activeTab} = this.state;
    const data = await this._apiService.getOrderGuides(this.props.facilityKey || '');
    const newState = {loading: false};
    if (data && !data.error) {
      newState.orderGuides = data || [];
      if (!activeTab) {
        const tabs = (data || []).filter(x => x.Selected);
        const defaultTab = tabs.find(x => x.DefaultOrderGuide);
        if (defaultTab) {
          newState.activeTab = defaultTab.PKey_OP_OrderGuide;
        } else if (tabs.length) {
          newState.activeTab = tabs[0].PKey_OP_OrderGuide;
        } else if (!tabs.length) {
          this.setState({
            isOrderGuideModal: true
          })
        }
      }
    } else {
      newState.orderGuides = [];
    }
    if (data.error) {
      message.error('Something went wrong! Please try again.');
    }
    this.setState({
      ...newState,
    });
  }

  getDropDownValues = async () => {
    const payload = {
      GetDepartments: true,
      GetSuppliers: true,
      GetFacilities: false,
      GetItems: false,
      GetCatalogs: true,
      GetLedgers: true,
      GetInventoryLocation: true,
      GetItemUnits: true,
      GetMealTimes: true,
    };
    const data = await this._apiService.getDropDownValues(payload);
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!');
    } else {
      const departments = (data.departments || []).sort((a, b) => {
        return a.Name > b.Name ? 1 : -1;
      });
      const catalogs = (data.catalogs || []).sort((a, b) => {
        return a.Name > b.Name ? 1 : -1;
      });
      const inventoryLocations = (data.inventoryLocations || []).sort((a, b) => {
        return a.InventoryLocation > b.InventoryLocation ? 1 : -1;
      });
      const ledgers = (data.ledgers || []).sort((a, b) => {
        return a.LedgerNumber > b.LedgerNumber ? 1 : -1;
      });
      const itemUnits = (data.itemUnits || []).sort((a, b) => {
        return a.UnitName > b.UnitName ? 1 : -1;
      });
        this.setState({
        departments,
        catalogs,
        inventoryLocations,
        ledgers,
        itemUnits,
        mealTimes: data.mealTimes
      });
    }
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab,
    })
  }

  onUpdateOrderGuide = async (record, cb, isDefaultChange) => {
    const {orderGuides, activeTab} = this.state;
    const selectedRecordIndex = (orderGuides || []).findIndex(x => x.PKey_OP_OrderGuide === record.PKey_OP_OrderGuide);
    if (selectedRecordIndex > -1) {
      orderGuides[selectedRecordIndex] = record;
      const newState = {};
      if (!isDefaultChange) {
        if (!record.Selected && Number(record.PKey_OP_OrderGuide) === Number(activeTab)) {
          newState.activeTab = '';
        }
        const tabs = (orderGuides || []).filter(x => x.Selected);
        const defaultTab = tabs.find(x => x.DefaultOrderGuide);
        if (defaultTab) {
          newState.activeTab = defaultTab.PKey_OP_OrderGuide;
        } else if (tabs.length) {
          newState.activeTab = tabs[0].PKey_OP_OrderGuide;
        }
      }
      await this.setState({
        orderGuides,
        ...newState,
      });
      const payload = {
        ...record
      }
      await this._apiService.updateOrderGuide(payload)
      if (cb) {
        cb();
      }
    }
  }

  optionNotification = (selectedOrderGuides) => {
    if (!selectedOrderGuides.length) {
      notification.open({
        message:
          "Select an order guide before continuing.",
        onClick: () => {
        },
      });
    }
  }

  onOrder = async () => {
    const {orderGuides, orderGuideDetailsLength, qtyLength} = this.state;
    const {facilityKey} = this.props;
    const selectedOrderGuides = (orderGuides || []).filter(x => x.Selected).map(x => {
      return {
        PKey_OP_OrderGuide: Number(x.PKey_OP_OrderGuide),
        FKey_Facility: Number(facilityKey)
      };
    });
    if (!selectedOrderGuides.length || !orderGuideDetailsLength || !qtyLength.length) {
      //return message.error('You have not entered any quantities in your order guides. Please enter quantities to create an order.')
      return notification.open({
        message:
          'You need to have at least one item with a quantity greater than zero before continuing.',
        onClick: () => {
        },
      });
    }
    if (!facilityKey) {
      return message.error('Please select facility first!')
    }
    this.props.onChangeSettings({
      orderPayload: selectedOrderGuides,
    });
    this.props.history.push('/purchasing/new-order');
  }

  addOrderGuide = (record) => {
    const {orderGuides} = this.state;
    orderGuides.push(record);
    this.setState({
      orderGuides,
    })
  }

  toggleInventoryColumns = () => {
    this.setState({
      inventoryColumns: !this.state.inventoryColumns
    });
  }

  onToggleLookUpModal = () => {
    this.setState({
      isLookUp: !this.state.isLookUp,
    });
  }

  onToggleTotalModal = () => {
    this.setState({
      totalModal: !this.state.totalModal,
    })
  }

  onToggleOrderGuideModal = () => {
    this.setState({
      isOrderGuideModal: !this.state.isOrderGuideModal
    });
  }

  resetLowestUnitPriceBid = async () => {
    const {activeTab} = this.state;
    const data = await this._apiService.resetUnitPriceToLowest(activeTab);
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
    } else {
      message.success('Reset to Lowest Unit Price Bid Successfully')
    }
  }

  resetQuantities = async () => {
    const {activeTab} = this.state;
    const data = await this._apiService.resetQty(activeTab);
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
    } else {
      message.success('Quantities Reset Successfully')
      this.getOrderGuides();
    }
  }
  orderGuidesList = (orderGuides) => {
    this.setState({
      orderGuides
    })
  }

  onToggleLinkItemsWithoutBidsModal = () => {
    this.setState({
      isLinkItemsWithoutBids: !this.state.isLinkItemsWithoutBids
    })

  }
  orderGuideDetails = (orderGuideDetailsLength, qtyLength) => {
    this.setState({orderGuideDetailsLength, qtyLength})
  }

  render() {
    const {loading, activeTab, orderGuides, inventoryColumns, isLookUp, isOrderGuideModal, totalModal, departments = [], catalogs = [], inventoryLocations = [], ledgers = [], itemUnits = [],
      isLinkItemsWithoutBids, mealTimes = []} = this.state;
    const selectedOrderGuides = orderGuides.filter(x => x.Selected);
    const isShowHidden = getSettings('isShowHiddenFeatures')
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order" onClick={this.onOrder}>
              <Icon type="build"/>
              Create PO
            </Menu.Item>
            {
              selectedOrderGuides.length ?
                <Menu.Item key="Lookup" onClick={this.onToggleLookUpModal}>
                  <Icon type="file-search"/>
                  Lookup
                </Menu.Item> :
                <Menu.Item key="Lookup">
                  <span className="submenu-title-wrapper"
                        onClick={() => this.optionNotification(selectedOrderGuides)}><Icon
                    type="file-search"/>Lookup</span>
                </Menu.Item>
            }
            {
              selectedOrderGuides.length ?

                <Menu.Item key="Totals" onClick={this.onToggleTotalModal}>
                  <Icon type="table"/>
                  Totals
                </Menu.Item> :
                <Menu.Item key="Totals">
                  <span className="submenu-title-wrapper"
                        onClick={() => this.optionNotification(selectedOrderGuides)}><Icon type="table"/>Totals</span>
                </Menu.Item>
            }
            <Menu.Item key="GenerateProductionUsage" onClick={this.openNotification}>
              <Icon type="notification"/>
              Generate Production Usage
            </Menu.Item>

            {
              selectedOrderGuides.length ?
                <Menu.SubMenu
                  title={
                    <span className="submenu-title-wrapper">
                  <Icon type="setting"/>
                  Options
                </span>
                  }
                >
                  {
                    isShowHidden ?
                      <Menu.Item key="options:removeRed">Remove Red Items</Menu.Item>
                      : null
                  }
                  {
                    isShowHidden ?
                      <Menu.Item key="options:validateBids">Validate Bids</Menu.Item>
                      : null
                  }
                  <Menu.Item key="options:resetToLowest" onClick={this.resetLowestUnitPriceBid}>
                    <Tooltip
                      title="This will reset all items to the lowest unit price bid and will ignore the locked bids.">
                      Reset to Lowest Unit Price Bid
                    </Tooltip>
                  </Menu.Item>
                  <Menu.Item key="options:resetQty" onClick={this.resetQuantities}>Reset Quantities</Menu.Item>
                  <Menu.Item key="options:linkItemsWithoutBids" onClick={this.onToggleLinkItemsWithoutBidsModal}>Link
                    Items without Bids</Menu.Item>
                  {/* <Menu.Item key="options:showHideInventory" onClick={this.toggleInventoryColumns}>Show/Hide Inventory Items</Menu.Item>*/}
                </Menu.SubMenu> :
                <Menu.Item key="options:removeRed">
                  <span className="submenu-title-wrapper"
                        onClick={() => this.optionNotification(selectedOrderGuides)}><Icon type="setting"/>Options
                </span></Menu.Item>
            }
            <div className="pull-right mr-20">
              <Icon type="control" onClick={this.onToggleOrderGuideModal} className="fs-20"/>
            </div>
          </Menu>
        </div>

        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-0 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <Row>
                      <Col sm="12" md="12">
                        {
                          selectedOrderGuides.length ?
                            <TabsComp defaultActiveKey={activeTab ? activeTab.toString() : ''}
                                      onChange={this.onTabChange} animated={false}>
                              {
                                selectedOrderGuides.map((order, index) => (
                                  <TabPane tab={order.OrderGuideName} key={order.PKey_OP_OrderGuide}>
                                    {
                                      String(activeTab) === String(order.PKey_OP_OrderGuide) &&
                                      <OrderGuideDetails orderGuideDetails={this.orderGuideDetails}
                                                         orderGuides={orderGuides} isLookUp={isLookUp}
                                                         onToggleLookUpModal={this.onToggleLookUpModal}
                                                         orderGuideId={activeTab} orderData={order}
                                                         inventoryColumns={inventoryColumns} departments={departments}
                                                         catalogs={catalogs} inventoryLocations={inventoryLocations}
                                                         ledgers={ledgers} itemUnits={itemUnits} mealTimes={mealTimes}/>
                                    }
                                  </TabPane>
                                ))
                              }
                            </TabsComp> :
                            <span className="text-danger">There are no order guides selected. Select an order guide on the top right.</span>
                        }
                      </Col>
                    </Row>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
        {
          totalModal &&
          <TotalSupplierBidModal onHide={this.onToggleTotalModal} selectedOrderGuides={selectedOrderGuides}
                                 visible={totalModal}/>
        }
        {
          isLinkItemsWithoutBids &&
          <LinkItemsWithoutBids facilityKey={this.props.facilityKey} isLinkItemsWithoutBids={isLinkItemsWithoutBids}
                                onToggleLinkItemsWithoutBidsModal={this.onToggleLinkItemsWithoutBidsModal}/>
        }
        <Modal
          visible={isOrderGuideModal}
          title="Select Order Guides"
          onCancel={this.onToggleOrderGuideModal}
          footer={null}
          height={400}
          size={"small"}
        >
          <div className="w-100-p">
            <OrderGuideList visible={isOrderGuideModal} onDrawerClose={this.onClose} addOrderGuide={this.addOrderGuide}
                            onUpdateOrderGuide={this.onUpdateOrderGuide} orderGuides={orderGuides}
                            orderGuidesList={this.orderGuidesList}/>
          </div>
        </Modal>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
  facilitiesData: state && state.settings && state.settings.facilitiesData,
});
const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderGuides);
