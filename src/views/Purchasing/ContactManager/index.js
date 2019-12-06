import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Checkbox, Dropdown, Input, Menu, message, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import AddNewContact from "./AddNewContact";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";

class ContactManager extends Component {
  _apiService = new ApiService();

  state = {
    contactManager: [],
    loading: true,
    selectedRecord: null,
    isModal: false,
    isDataFilter: false,
    searchKey: '',
  }

  componentDidMount() {
    this.getContactManager()
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


  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
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
    this.refreshGrid()
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true,
    });
    const {contactManager = []} = this.state;
    const data  = await this._apiService.updateContact(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Contact Added Successfully');
      payload.PKey_OP_Contact = data;
      contactManager.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        contactManager
      });
    }
    this.refreshGrid()
  }

  onSelectRecord = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord.PrimaryContact = event.target.checked;
    this.setState({
      selectedRecord
    });
    this.refreshGrid()
  }

  saveRecord = async () => {
    const {selectedRecord, contactManager = []} = this.state;
    this.setState({
      isSaving: true,
    });
    const data =  await this._apiService.updateContact(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Contact Updated Successfully');
      const Index = contactManager.findIndex(x => x.PKey_OP_Contact === selectedRecord.PKey_OP_Contact);
      if (Index > -1) {
        contactManager[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        contactManager
      });
    }
    this.refreshGrid()
  }

  isModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteContact(selectedRecord.PKey_OP_Contact)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Contact Deleted Successfully');
      const {contactManager} = this.state;
      this.setState({
        contactManager: contactManager.filter(x => x.PKey_OP_Contact !== selectedRecord.PKey_OP_Contact)
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
    const { loading,  isModal,  isSaving, searchKey, isDataFilter, selectedRecord} = this.state;
    let contactManager = this.state.contactManager;
    const isIncludes = (key1, key2) => {
      return (key1 || '').toString().toLowerCase().includes((key2 || '').toString().toLowerCase());
    };
    if (searchKey.trim() && isDataFilter) {
      contactManager = contactManager.filter(x => isIncludes(x.FirstName, searchKey) || isIncludes(x.LastName, searchKey)
        || isIncludes(x.Email, searchKey) || isIncludes(x.Phone, searchKey) || isIncludes(x.PhoneExt, searchKey));
    }
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
                            dataSource={contactManager}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_Contact"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" width={"20%"} sortOrder={'asc'} caption={'First Name'} dataField={'FirstName'}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Input value={selectedRecord.FirstName} name="FirstName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.FirstName}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={"20%"} caption={'Last Name'} dataField={'LastName'}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Input value={selectedRecord.LastName} name="LastName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.LastName}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={"20%"} caption={'Email'} dataField={'Email'}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Input value={selectedRecord.Email} name="Email" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Email}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={"20%"} caption={'Phone'} dataField={'Phone'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Input value={selectedRecord.Phone} name="Phone" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Phone}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={"10%"} caption={'Ext.'} dataField={'PhoneExt'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Input value={selectedRecord.PhoneExt} name="PhoneExt" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.PhoneExt}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={"10%"} caption={'Primary'}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
                                return (
                                  <Checkbox checked={selectedRecord.PrimaryContact} onChange={(event) => this.onSelectRecord(event)}/>
                                );
                              } else {
                                return (<Checkbox checked={record.data.PrimaryContact}/>);
                              }
                            }}/>
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}   cellRender={(record) => {
                              const menu = (
                                <Menu>
                                  <Menu.Item onClick={() => this.onDelete(record.data)}>
                                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                  </Menu.Item>
                                </Menu>
                              );
                              if (selectedRecord && selectedRecord.PKey_OP_Contact === record.data.PKey_OP_Contact) {
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
                            }}/>
                          </CustomGrid>
                        </Col>
                        <AddNewContact rowKey="PKey_OP_Contact" isSaving={isSaving} isModalOpen={this.isModalOpen} addNewRecord={this.addNewRecord} isModal={isModal}/>
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

export default connect(mapStateToProps)(ContactManager);
