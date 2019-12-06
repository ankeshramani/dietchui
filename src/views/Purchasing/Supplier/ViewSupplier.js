import React, {Component} from "react";
import {Drawer, Input, message, Popconfirm, Select, Spin, Tabs, Checkbox, Menu, Dropdown} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import clonedeep from "lodash.clonedeep";
import TabsComp from "../../../components/TabsComp";
import AddNewSupplierContact from "./AddNewSupplierContact";
import {connect} from "react-redux";
import AddNewFacilitie from "./AddNewFacilitie";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
const TabPane = Tabs.TabPane;

const Option = Select.Option;

class ViewSupplier extends Component {
  _apiService = new ApiService();
  state = {
    loading : false,
    supplierContact: [],
    PKey_Facility: '',
    supplierFacility: [],
    isDataFilter: false,
    searchKey: ''
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab
    })
  }

  componentDidMount() {
    this.getSupplierContact()
    this.getSupplierFacility()
  }

  getSupplierContact = async () => {
    const {selectedSupplier} = this.props;
    this.setState({
      loading: true,
    })
    const data = await this._apiService.getSupplierContact(selectedSupplier && selectedSupplier.PKey_OP_Supplier);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        supplierContact: data,
        loading: false,
      });
    }
  }

  getSupplierFacility = async () => {
    this.setState({
      loading: true,
    })
    const data = await this._apiService.getSupplierfacility();
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        supplierFacility: data,
        loading: false,
      });
    }
  }

  saveRecord = async () => {
    const {selectedRecord, supplierContact = []} = this.state;
    this.setState({
      isSaving: true
    });
    const data =  await this._apiService.updateSupplierContact(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Supplier Contact Updated Successfully');
      const Index = supplierContact.findIndex(x => x.PKey_OP_Contact === selectedRecord.PKey_OP_Contact);
      if (Index > -1) {
        supplierContact[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        supplierContact
      });
    }
    this.refreshGrid()
  }

  saveFacility = async () => {
    const {selectedRecord, selectedKey, supplierFacility = []} = this.state;
    const payload = {
      ...selectedRecord,
      selectedKey,
    }
    this.setState({
      isSaving: true
    });
    const data =  await this._apiService.updateSupplierfacility(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Facility Updated Successfully');
      const Index = supplierFacility.findIndex(x => x.PKey_OP_Supplier_Facility === payload.PKey_OP_Supplier_Facility);
      if (Index > -1) {
        supplierFacility[Index] = payload;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        supplierFacility
      });
    }
    this.refreshGrid()
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true
    });
    const {supplierContact = [],selectedRecord} = this.state;
    const newPayload = {
      PKey_OP_Supplier_Contact: 0,
      FKey_OP_Contact: payload.PKey_OP_Contact,
      FKey_OP_Supplier: payload.FKey_OP_Supplier,
      ToBeEmailed: payload.ToBeEmailed
    }
    const data  = await this._apiService.supplierContactAddOrUpdate(selectedRecord ? selectedRecord : newPayload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Contact Added Successfully');
      payload = {
        ...payload,
        ...newPayload
      };
      if(selectedRecord){
        const Index = supplierContact.findIndex(x => x.PKey_OP_Supplier_Contact === selectedRecord.PKey_OP_Supplier_Contact);
        if (Index > -1) {
          supplierContact[Index] = selectedRecord;
        }
      }
      payload.PKey_OP_Contact = data
      supplierContact.push(payload)
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        supplierContact
      });
    }
    this.refreshGrid()
  }

  addNewFacility = async (payload) => {
    this.setState({
      isSaving: true
    });
    const {supplierFacility = []} = this.state;
    const data  = await this._apiService.updateSupplierfacility(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Facility Added Successfully');
      payload.PKey_OP_Supplier_Facility = data
      supplierFacility.push(payload)
      this.setState({
        selectedRecord: null,
        isFacilityModal: false,
        isSaving: false,
        supplierFacility
      });
    }
    this.refreshGrid()
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

  onSelectRecord = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord.ToBeEmailed = event.target.checked;
    this.setState({
      selectedRecord
    });
  }

  isModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  isFacilityModalOpen = () => {
    this.setState({
      isFacilityModal: !this.state.isFacilityModal,
    });
  }

  handleChange = (FKey_Facility) => {
    const { selectedRecord } = this.state;
    selectedRecord.FKey_Facility = FKey_Facility;
    this.setState({
      selectedRecord
    });
  }

  handleDelete = async (record) => {
    const data = await this._apiService.deleteSupplierFacility(record.PKey_OP_Supplier_Facility)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Facility Deleted Successfully');
      const {supplierFacility} = this.state;
      this.setState({
        supplierFacility: supplierFacility.filter(x => x.PKey_OP_Supplier_Facility !== record.PKey_OP_Supplier_Facility)
      })
    }
    this.refreshGrid()
  }


  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteSupplierContact(selectedRecord.PKey_OP_Supplier_Contact)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Supplier Contact Deleted Successfully');
      const {supplierContact} = this.state;
      this.setState({
        supplierContact: supplierContact.filter(x => x.PKey_OP_Supplier_Contact !== selectedRecord.PKey_OP_Supplier_Contact)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  render() {
    const {onDrawerClose, isDrawer, selectedSupplier, facilitiesData} = this.props;
    const { loading, isModal, supplierFacility = [], isFacilityModal, isSaving, searchKey, isDataFilter, selectedRecord} = this.state;
    let supplierContact = this.state.supplierContact;
    let facilities = (selectedSupplier && selectedSupplier.PKey_OP_Supplier &&
      supplierFacility.filter(x => x.FKey_OP_Supplier === selectedSupplier.PKey_OP_Supplier));
    const isIncludes = (key1, key2) => {
      return (key1 || '').toString().toLowerCase().includes((key2 || '').toString().toLowerCase());
    };
    if (searchKey.trim() && isDataFilter) {
      supplierContact = supplierContact.filter(x => isIncludes(x.FirstName, searchKey) || isIncludes(x.LastName, searchKey)
        || isIncludes(x.Email, searchKey) || isIncludes(x.Phone, searchKey) || isIncludes(x.PhoneExt, searchKey));
    }
    const filteredContacts = (this.props.contactManager || []).filter(x => {
        if (this.state.supplierContact.some(y => y.PKey_OP_Contact === x.PKey_OP_Contact)) {
          return false;
        }
        return true;
    });
    const getFacilityName = (key) => {
      const item = facilitiesData.find(x=>x.PKey_Facility === key);
      return item ? item.Facility_Name : '';
    }
    facilitiesData.sort((a,b) => {
      if ( a.Facility_Name < b.Facility_Name )
        return -1;
      if ( a.Facility_Name > b.Facility_Name )
        return 1;
      return 0;
    });
    return(
      <Drawer
        title={<div>Contact List and Facilities List</div>}
        placement={"right"}
        onClose={onDrawerClose}
        visible={isDrawer}
        width={768}
      >
        {
          loading ? <Loader /> :
            <>
              <TabsComp defaultActiveKey={this.props.selectedDrawerKey || '1'} animated={false} onChange={this.onTabChange}>
                <TabPane tab="Contact" key="1">
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={supplierContact}
                    columnAutoWidth={false}
                    keyExpr="PKey_OP_Supplier_Contact"
                    gridClass="view-supplier-contact"
                  >
                    <Column alignment="left" caption={'First Name'} dataField={'FirstName'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Contact === record.data.PKey_OP_Supplier_Contact) {
                        return (
                          <Input value={selectedRecord.FirstName} name="FirstName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                        );
                      } else {
                        return (<span>{record.data.FirstName}</span>);
                      }
                    }}/>
                    <Column alignment="left" caption={'Last Name'} dataField={'LastName'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Contact === record.data.PKey_OP_Supplier_Contact) {
                        return (
                          <Input value={selectedRecord.LastName} name="LastName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                        );
                      } else {
                        return (<span>{record.data.LastName}</span>);
                      }
                    }}/>
                    <Column alignment="left"  caption={'Email'} dataField={'Email'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Contact === record.data.PKey_OP_Supplier_Contact) {
                        return (
                          <Input value={selectedRecord.Email} name="Email" size="small" onChange={(event) => this.onRecordChange(event)}/>
                        );
                      } else {
                        return (<span>{record.data.Email}</span>);
                      }
                    }}/>
                    <Column alignment="left" caption={'To Be Emailed'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Contact === record.data.PKey_OP_Supplier_Contact) {
                        return (
                          <Checkbox checked={selectedRecord.ToBeEmailed} onChange={(event) => this.onSelectRecord(event)}/>
                        );
                      } else {
                        return (<Checkbox checked={record.data.ToBeEmailed}/>);
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
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Contact === record.data.PKey_OP_Supplier_Contact) {
                        return (
                          <div>
                            <span className="mr-10 text-primary cursor-pointer" onClick={this.addNewRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
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
                  {isModal && <AddNewSupplierContact contactManager={filteredContacts} isSaving={isSaving} selectedSupplier={this.props.selectedSupplier} updateContactManager={this.props.updateContactManager} isModalOpen={this.isModalOpen} addNewRecord={this.addNewRecord}  isModal={isModal}/>}
                </TabPane>
                <TabPane tab="Facilities" key="2">
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={facilities}
                    columnAutoWidth={false}
                    keyExpr="PKey_OP_Supplier_Facility"
                    gridClass="view-supplier-contact"
                  >
                    <Column alignment="left" caption={'Facilities'} dataField={'Facility_Name'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Facility === record.data.PKey_OP_Supplier_Facility) {
                        return (
                          <Select
                            style={{ width: 200 }}
                            value={selectedRecord.FKey_Facility}
                            placeholder="Select facility"
                            onChange={this.handleChange}
                          >
                            {
                              facilitiesData.map((d) => (
                                <Option value={d.PKey_Facility}>{d.Facility_Name}</Option>
                              ))
                            }
                          </Select>
                        );
                      } else {
                        return (
                          <span>{getFacilityName(record.data.FKey_Facility)}</span>
                        );
                      }
                    }}/>
                    <Column alignment="left" caption={'Account Number'} dataField={'AccountNumber'}  cellRender={(record) => {
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Facility === record.data.PKey_OP_Supplier_Facility) {
                        return (
                          <Input value={selectedRecord.AccountNumber} name="AccountNumber" size="small" onChange={(event) => this.onRecordChange(event)}/>
                        );
                      } else {
                        return (<span>{record && record.data.AccountNumber}</span>);
                      }
                    }}/>
                    <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isFacilityModalOpen}>New</span>}  cellRender={(record) => {
                      const menu = (
                        <Menu>
                          <Menu.Item onClick={() => this.handleDelete(record.data)}>
                            <span className="text-primary ml-5 cursor-pointer">Delete</span>
                          </Menu.Item>
                        </Menu>
                      );
                      if (selectedRecord && selectedRecord.PKey_OP_Supplier_Facility === record.data.PKey_OP_Supplier_Facility) {
                        return (
                          <div>
                            <span className="mr-10 text-primary cursor-pointer" onClick={this.saveFacility}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
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
                  {isFacilityModal && <AddNewFacilitie isSaving={isSaving} isFacilityModalOpen={this.isFacilityModalOpen} selectedSupplier={this.props.selectedSupplier} isFacilityModal={isFacilityModal} addNewFacility={this.addNewFacility} facilitiesData={this.props.facilitiesData}/>}
                </TabPane>
              </TabsComp>
            </>
        }
      </Drawer>
    )
  }
}
const mapStateToProps = (state) => ({
  facilitiesData: state.settings.facilitiesData,
});
export default connect(mapStateToProps)(ViewSupplier);
