import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {ApiService} from "../../../services/ApiService";
import {Dropdown, Icon, Menu, message} from "antd";
import {connect} from "react-redux";
import Loader from "../../Common/Loader";
import AddAndUpdateSupplier from "./AddAndUpdateSupplier";
import ViewSupplier from "./ViewSupplier";
import ViewBids from "./ViewBids";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";

class Supplier  extends Component {
  _apiService = new ApiService();

  state = {
    supplier: [],
    selectedRecord: null,
    isSaving: false,
    isDrawer: false,
    isPricingHistory: false,
    isDataFilter: false,
    searchKey: '',
    contactManager: []
  }

  componentDidMount() {
    this.getSupplier()
    this.getContactManager()
  }

  getSupplier = async () => {
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getSupplier(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        supplier: data,
        loading: false,
      })
    }
  }

  getContactManager = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getContectManager(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        contactManager: data,
        loading: false,
      })
    }
  }

  saveRecord = async (payload) => {
    this.setState({
      isSaving: true
    });
    const {supplier = [], isEdit} = this.state;
    const data =  await this._apiService.updateSupplier(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Supplier Saved Successfully');
      if (isEdit) {
        const deptIndex = supplier.findIndex(x => x.PKey_OP_Supplier === payload.PKey_OP_Supplier);
        if (deptIndex > -1) {
          supplier[deptIndex] = payload;
        }
      } else {
        supplier.push({
          ...payload,
          PKey_OP_Supplier: data,
        })
      }

      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        supplier,
      });
    }
    this.refreshGrid()
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteSupplier(selectedRecord.PKey_OP_Supplier)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Supplier Deleted Successfully');
      const {supplier} = this.state;
      this.setState({
        supplier: supplier.filter(x => x.PKey_OP_Supplier !== selectedRecord.PKey_OP_Supplier)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  showDrawer = (record, selectedDrawerKey) => {
    this.setState({
      isDrawer: true,
      selectedSupplier: record,
      selectedDrawerKey
    });
  };

  onViewBidsDrawer = (record) => {
    this.setState({
      isViewBid: true,
      selectedSupplier: record
    });
  };

  onViewBidsDrawerClose = () => {
    this.setState({
      isViewBid: false,
    });
  };

  onClose = () => {
    this.setState({
      isDrawer: false,
    });
  };

  isModalOpen = (record, isEdit) => {
    this.setState({
      isModal: !this.state.isModal,
      selectedRecord: record,
      isEdit: isEdit
    });
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  updateContactManager = (contactManager) => {
    this.setState({
      contactManager
    });
  }


  render() {
    const { loading,searchKey, isDataFilter,isModal, selectedRecord, isEdit, isSaving, isDrawer, selectedSupplier, contactManager, isViewBid, selectedDrawerKey} = this.state;
    let supplier = this.state.supplier;
    const isIncludes = (key1, key2) => {
      return (key1 || '').toString().toLowerCase().includes((key2 || '').toString().toLowerCase());
    };
    if (searchKey.trim() && isDataFilter) {
      supplier = supplier.filter(x => isIncludes(x.Name, searchKey) || isIncludes(x.Phone, searchKey)
        || isIncludes(x.State, searchKey) || isIncludes(x.City, searchKey) || isIncludes(x.Zip, searchKey) );
    }
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order" onClick={this.isModalOpen}>
              <Icon type="printer" />
              Print
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-5 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <>
                      <Row>
                        <Col md="12" sm="12" xs="12">
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={supplier}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_Supplier"
                            gridClass="common-height"
                          >
                            <Column alignment="left" caption={'Name'} sortOrder={'asc'} dataField={'Name'}/>
                            <Column alignment="left" caption={'Phone'} dataField={'Phone'}/>
                            <Column alignment="left" caption={'State'} dataField={'State'}/>
                            <Column alignment="left" caption={'City'} dataField={'City'}/>
                            <Column alignment="left" caption={'Zip'} dataField={'Zip'}/>
                            <Column width={100} alignment="left" headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>} cellRender={(record) => {
                              const menu = (
                                <Menu>
                                  <Menu.Item onClick={() => this.showDrawer(record.data, '1')}>
                                    <span className="text-primary ml-5 cursor-pointer">Contacts</span>
                                  </Menu.Item>
                                  <Menu.Item onClick={() => this.showDrawer(record.data, '2')}>
                                    <span className="text-primary ml-5 cursor-pointer">Facilities</span>
                                  </Menu.Item>
                                  <Menu.Item onClick={() => this.onViewBidsDrawer(record.data)} >
                                    <span className="text-primary ml-5 cursor-pointer">Bids</span>
                                  </Menu.Item>
                                  <hr className="delete-btn-menu" />
                                  <Menu.Item onClick={() => this.onDelete(record.data)}>
                                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                  </Menu.Item>
                                </Menu>
                              );
                              return (
                                <div className="flex-align-item-center d-flex">
                                  <span className="text-primary mr-5 cursor-pointer" onClick={() => this.isModalOpen(record.data, true)}>Edit</span>
                                  <Dropdown overlay={menu} trigger={['click']}>
                                    <i className="icon-options-vertical text-primary cursor-pointer" />
                                  </Dropdown>
                                </div>
                              );
                            }}/>
                          </CustomGrid>
                        </Col>
                      </Row>
                      {isModal && <AddAndUpdateSupplier isModalOpen={this.isModalOpen} isSaving={isSaving} saveRecord={this.saveRecord} isModal={isModal} selectedRecord={selectedRecord} isEdit={isEdit} />}
                      {isDrawer && <ViewSupplier updateContactManager={this.updateContactManager} contactManager={contactManager} refreshGrid={this.refreshGrid} isDrawer={isDrawer} selectedDrawerKey={selectedDrawerKey} onDrawerClose={this.onClose} selectedSupplier={selectedSupplier}/> }
                      {isViewBid && <ViewBids isViewBid={isViewBid} onViewBidsDrawerClose={this.onViewBidsDrawerClose} refreshGrid={this.refreshGrid} selectedSupplier={selectedSupplier}/> }
                    </>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});
export default connect(mapStateToProps)(Supplier );
