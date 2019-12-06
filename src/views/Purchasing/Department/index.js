import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Dropdown, Icon, Input, Menu, message, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import ViewContact from "./ViewContact";
import AddNewDepartment from "./AddNewDepartment";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";

class Department extends Component {
  _apiService = new ApiService();

  state = {
    department: [],
    loading: true,
    selectedRecord: null,
    isDrawer: false,
    isSelectedDepartment: null,
    isModal: false,
    contactManager: []
  }

  componentDidMount() {
    this.getDepartment();
    this.getContactManager();
  }

  getDepartment = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getDepartment(this.props.facilityKey);
    if(!data || data.error){
      message.error('Something went wrong while loading departments.');
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        department: data,
        loading: false,
      })
    }
  }

  getContactManager = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getContectManager(this.props.facilityKey);
    if(!data || data.error){
      message.error('Something went wrong while loading contacts.')
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

  showDrawer = (record) => {
    this.setState({
      isDrawer: true,
      selectedDepartment: record
    });
    this.refreshGrid()
  };

  onClose = () => {
    this.setState({
      isDrawer: false,
      selectedDepartment: null,
    });
  };

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord
    });
  }

  saveRecord = async (payload, value) => {
    debugger
    const {selectedRecord, department= []} = this.state;
    this.setState({
      isSaving: true
    });
    const newPayload = value ? payload : selectedRecord;
    const data =  await this._apiService.updateDepartment(newPayload);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Department Saved Successfully');
      if (payload && value) {
        newPayload.PKey_OP_Department = data;
        department.push(payload);
      } else {
        const deptIndex = department.findIndex(x => x.PKey_OP_Department === selectedRecord.PKey_OP_Department);
        if (deptIndex > -1) {
          department[deptIndex] = selectedRecord;
        }
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        department,
        isModal: false,
      });
    }
    this.refreshGrid();
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteDepartment(selectedRecord.PKey_OP_Department)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Department Deleted Successfully');
      const {department} = this.state;
      this.setState({
        department: department.filter(x => x.PKey_OP_Department !== selectedRecord.PKey_OP_Department)
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

  isModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  updateContactManager = (contactManager) => {
    this.setState({
      contactManager
    });
  }

  render() {
    const { loading, isDrawer, selectedDepartment, isModal, selectedRecord, isSaving, department, contactManager } = this.state;
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
                            dataSource={department}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_Department"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" width={"50%"} caption={'Name'} sortOrder={'asc'} dataField={'Name'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Department === record.data.PKey_OP_Department) {
                                return (
                                  <Input value={selectedRecord.Name} name="Name" size="small" onChange={this.onRecordChange}/>
                                );
                              } else {
                                return (<span>{record.data.Name}</span>);
                              }
                            }} />
                            <Column alignment="left" width={"50%"} caption={'PO Suffix'} dataField={'POSuffix'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Department === record.data.PKey_OP_Department) {
                                return (
                                  <Input value={selectedRecord.POSuffix} name="POSuffix" size="small" onChange={this.onRecordChange}/>
                                );
                              } else {
                                return (<span>{record.data.POSuffix}</span>);
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
                              if (selectedRecord && selectedRecord.PKey_OP_Department === record.data.PKey_OP_Department) {
                                return (
                                  <div>
                                    <span className="mr-10 text-primary cursor-pointer" onClick={this.saveRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
                                    <span className="text-primary cursor-pointer" onClick={this.onCancelSaveRecord}>Cancel</span>
                                  </div>
                                );

                              } else {
                                return (
                                  <div className="flex-align-item-center d-flex">
                                    <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                                    <Icon type="contacts" className="text-primary fs-24" onClick={() => this.showDrawer(record.data)}/>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                      <i className="icon-options-vertical text-primary cursor-pointer" />
                                    </Dropdown>
                                  </div>

                                );
                              }
                            }} />
                          </CustomGrid>
                        </Col>
                        { isDrawer && <ViewContact contactManager={contactManager} updateContactManager={this.updateContactManager} isDrawer={isDrawer} onDrawerClose={this.onClose} selectedDepartment={selectedDepartment}/> }
                        { isModal && <AddNewDepartment isModalOpen={this.isModalOpen} isSaving={isSaving} addNewRecord={this.saveRecord} isModal={isModal} facilityKey={this.props.facilityKey}/>}
                      </Row>
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

export default connect(mapStateToProps)(Department);
