import React, {Component} from "react";
import {Drawer, message, Input, Checkbox, Spin, Menu, Dropdown} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import AddNewDepartmentContact from "./AddNewDepartmentContact";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import clonedeep from "lodash.clonedeep";

class ViewContact extends Component {
  _apiService = new ApiService();

  state = {
    visible: false,
    selectedRecord: null,
    modal: false,
    newOderGuide: false,
    fillOPContact: [],
    isModal: false,
  }

  componentDidMount() {
    this.getFillOPContact()
  }

  getFillOPContact = async () => {
    const {selectedDepartment} = this.props;
    this.setState({
      loading: true,
    })
    const data = await this._apiService.getDepartmentContact(selectedDepartment && selectedDepartment.PKey_OP_Department);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        fillOPContact: data,
        loading: false,
      });
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
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true,
    });
    const newPayload = {
      PKey_OP_Department_Contact: 0,
      FKey_OP_Contact: payload.PKey_OP_Contact,
      FKey_OP_Department: payload.FKey_OP_Department,
      ToBeEmailed: payload.ToBeEmailed
    }
    const {fillOPContact = [], selectedRecord} = this.state;
    const data = await this._apiService.departmentContactAddOrUpdate(selectedRecord ? selectedRecord : newPayload)
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Department Contact Added Successfully');
      payload = {
        ...payload,
        ...newPayload
      };
      if (selectedRecord) {
        const Index = fillOPContact.findIndex(x => x.PKey_OP_Department_Contact === selectedRecord.PKey_OP_Department_Contact);
        if (Index > -1) {
          fillOPContact[Index] = selectedRecord;
        }
      }
      payload.PKey_OP_Department_Contact = data;
      fillOPContact.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        fillOPContact,
      });
    }
    this.refreshGrid();
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

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteDepartmentContact(selectedRecord.PKey_OP_Department_Contact)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Department Contact Deleted Successfully');
      const {fillOPContact} = this.state;
      this.setState({
        fillOPContact: fillOPContact.filter(x => x.PKey_OP_Department_Contact !== selectedRecord.PKey_OP_Department_Contact)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  onSelectRecord = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord.ToBeEmailed = event.target.checked;
    this.setState({
      selectedRecord
    });
  }


  render() {
    const { onDrawerClose, isDrawer, contactManager } = this.props;
    const { loading, isModal, isSaving, selectedRecord } = this.state;
    const fillOPContact = this.state.fillOPContact;
    const filteredContacts = (contactManager || []).filter(x => {
      if (this.state.fillOPContact.some(y => y.PKey_OP_Contact === x.PKey_OP_Contact)) {
        return false;
      }
      return true;
    });
    return(
      <Drawer
        title={<div>Contact List </div>}
        placement={"right"}
        onClose={onDrawerClose}
        visible={isDrawer}
        width={768}
      >
        {
          loading ? <Loader /> :
            <>
            <CustomGrid
              refCallback={(dg) => this.dg = dg}
              dataSource={fillOPContact}
              columnAutoWidth={false}
              keyExpr="PKey_OP_Department_Contact"
              gridClass="view-contact"
            >
              <Column alignment="left" width={"15%"} caption={'First Name'} dataField={'FirstName'} cellRender={(record) => {
                if (selectedRecord && selectedRecord.PKey_OP_Department_Contact === record.data.PKey_OP_Department_Contact) {
                  return (
                    <Input value={selectedRecord.FirstName} name="FirstName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                  );
                } else {
                  return (<span>{record.data.FirstName}</span>);
                }
              }} />
              <Column alignment="left" width={"15%"} caption={'Last Name'} dataField={'LastName'} cellRender={(record) => {
                if (selectedRecord && selectedRecord.PKey_OP_Department_Contact === record.data.PKey_OP_Department_Contact) {
                  return (
                    <Input value={selectedRecord.LastName} name="LastName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                  );
                } else {
                  return (<span>{record.data.LastName}</span>);
                }
              }} />
              <Column alignment="left" width={"15%"} caption={'Email'} dataField={'Email'} cellRender={(record) => {
                if (selectedRecord && selectedRecord.PKey_OP_Department_Contact === record.data.PKey_OP_Department_Contact) {
                  return (
                    <Input value={selectedRecord.Email} name="Email" size="small" onChange={(event) => this.onRecordChange(event)}/>
                  );
                } else {
                  return (<span>{record.data.Email}</span>);
                }
              }} />
              <Column alignment="left" width={"10%"} caption={'To Be Emailed'} dataField={'ToBeEmailed'} cellRender={(record) => {
                if (selectedRecord && selectedRecord.PKey_OP_Department_Contact === record.data.PKey_OP_Department_Contact) {
                  return (
                    <Checkbox checked={selectedRecord.ToBeEmailed}  onChange={(event) => this.onSelectRecord(event)}/>
                  );
                } else {
                  return (<Checkbox checked={record.data.ToBeEmailed}/>);
                }
              }} />
              <Column alignment="left" width={"15%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}  cellRender={(record) => {
                const menu = (
                  <Menu>
                    <Menu.Item onClick={() => this.onDelete(record.data)}>
                      <span className="text-primary ml-5 cursor-pointer">Delete</span>
                    </Menu.Item>
                  </Menu>
                );
                if (selectedRecord && selectedRecord.PKey_OP_Department_Contact === record.data.PKey_OP_Department_Contact) {
                  return (
                    <div>
                      <span className="mr-10 text-primary cursor-pointer" onClick={this.addNewRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
                      <span className="text-primary" onClick={this.onCancelSaveRecord}>Cancel</span>
                    </div>
                  );

                } else {
                  return (
                    <div className="flex-align-item-center">
                      <span className="text-primary mr-5" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                      <Dropdown overlay={menu} trigger={['click']}>
                        <i className="icon-options-vertical text-primary cursor-pointer" />
                      </Dropdown>
                    </div>
                  );
                }
              }} />
            </CustomGrid>
            {isModal && <AddNewDepartmentContact contactManager={filteredContacts} isModalOpen={this.isModalOpen} isSaving={isSaving} updateContactManager={this.props.updateContactManager}
                                     addNewRecord={this.addNewRecord} selectedDepartment={this.props.selectedDepartment} isModal={isModal}/> }
            </>
        }
      </Drawer>
    )
  }
}
export default ViewContact
