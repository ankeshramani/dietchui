import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Input, message, Spin, Menu, Dropdown} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import AddNewInventoryLocation from "./AddNewInventoryLocation";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";

class InventoryLocation extends Component {
  _apiService = new ApiService();

  state = {
    inventoryLocation: [],
    loading: true,
    selectedRecord: null,
    isModal: false,
    isDataFilter: false,
    searchKey: ''
  }

  componentDidMount() {
    this.getinventoryLocation()
  }

  getinventoryLocation = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getinventoryLocation(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        inventoryLocation: data,
        loading: false,
      })
    }
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
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
      selectedRecord
    });
  }

  saveRecord = async () => {
    const {selectedRecord, inventoryLocation = []} = this.state;
    this.setState({
      isSaving: true,
    });
    const data =  await this._apiService.updateinventoryLocation(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Inventory Location Updated Successfully');
      const Index = inventoryLocation.findIndex(x => x.PKey_OP_InventoryLocation === selectedRecord.PKey_OP_InventoryLocation);
      if (Index > -1) {
        inventoryLocation[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        inventoryLocation
      });
    }
    this.refreshGrid()
  }

  isModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true,
    });
    const {inventoryLocation = []} = this.state;
    const data  = await this._apiService.updateinventoryLocation(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Inventory Location Added Successfully');
      payload.PKey_OP_InventoryLocation = data;
      inventoryLocation.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        inventoryLocation
      });
    }
    this.refreshGrid()
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteInventoryLocation(selectedRecord.PKey_OP_InventoryLocation)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Inventory Location Deleted Successfully');
      const {inventoryLocation} = this.state;
      this.setState({
        inventoryLocation: inventoryLocation.filter(x => x.PKey_OP_InventoryLocation !== selectedRecord.PKey_OP_InventoryLocation)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const { loading,  isModal, isSaving, selectedRecord, inventoryLocation} = this.state;
    return (
      <div className="animated fadeIn page-view">
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
                            dataSource={inventoryLocation}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_InventoryLocation"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" caption={'Name'} dataField={'InventoryLocation'} sortOrder={'asc'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_InventoryLocation === record.data.PKey_OP_InventoryLocation) {
                                return (
                                  <Input value={selectedRecord.InventoryLocation} name="InventoryLocation" size="small" onChange={this.onRecordChange}/>
                                );
                              } else {
                                return (<span>{record.data.InventoryLocation}</span>);
                              }
                            }} />
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}  cellRender={(record) => {
                              const menu = (
                                <Menu>
                                  <Menu.Item onClick={() => this.onDelete(record.data)}>
                                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                  </Menu.Item>
                                </Menu>
                              );

                              if (selectedRecord && selectedRecord.PKey_OP_InventoryLocation === record.data.PKey_OP_InventoryLocation) {
                                return (
                                  <div>
                                    <span className="mr-10 text-primary cursor-pointer" onClick={this.saveRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
                                    <span className="text-primary cursor-pointer" onClick={this.onCancelSaveRecord}>Cancel</span>
                                  </div>
                                );

                              } else {
                                return (
                                  <div className="flex-align-item-center">
                                    <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                      <i className="icon-options-vertical text-primary cursor-pointer" />
                                    </Dropdown>
                                  </div>
                                );
                              }
                            }} />
                          </CustomGrid>
                        </Col>
                      </Row>
                      <AddNewInventoryLocation isSaving={isSaving} facilityKey={this.props.facilityKey} addNewRecord={this.addNewRecord} isModal={isModal} isModalOpen={this.isModalOpen} />
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

export default connect(mapStateToProps)(InventoryLocation);
