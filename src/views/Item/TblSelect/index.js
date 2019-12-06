import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Icon, Input, Menu, message, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import AddItem from "./AddItem";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";


class TblSelect extends Component {
  _apiService = new ApiService();

  state = {
    tblSelectData: [],
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
    const data = await this._apiService.getTblItem()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        tblSelectData: data,
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
      payload.PKey_Item = data;
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
  }

  saveRecord = async () => {
    const {selectedRecord, tblSelectData = []} = this.state;
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
      const Index = tblSelectData.findIndex(x => x.PKey_Item === selectedRecord.PKey_Item);
      if (Index > -1) {
        tblSelectData[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        tblSelectData
      });
    }
    this.refreshGrid()
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

  render() {
    const { loading,  isModal,  isSaving, searchKey, isDataFilter, selectedRecord} = this.state;
    let { tblSelectData } = this.state;
    const isIncludes = (key1, key2) => {
      return (key1 || '').toString().toLowerCase().includes((key2 || '').toString().toLowerCase());
    };
    if (searchKey.trim() && isDataFilter) {
      tblSelectData = tblSelectData.filter(x => isIncludes(x.Class_Name, searchKey) || isIncludes(x.Category_Name, searchKey)
        || isIncludes(x.Itm_Descr, searchKey));
    }
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button" title="Print">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order">
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
                            dataSource={tblSelectData}
                            columnAutoWidth={false}
                            keyExpr="PKey_Item"
                            gridClass="common-height"
                          >
                            <Column alignment="left" caption={'Name'} sortOrder={'asc'} dataField={'MenuDisplayName'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
                                return (
                                  <Input value={selectedRecord.MenuDisplayName} name="MenuDisplayName" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.MenuDisplayName}</span>);
                              }
                            }}/>
                            <Column alignment="left" caption={'Category'} dataField={'Category_Name'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
                                return (
                                  <Input value={selectedRecord.Category_Name} name="Category_Name" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Category_Name}</span>);
                              }
                            }}/>
                            <Column alignment="left" caption={'Class'} dataField={'Class_Name'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
                                return (
                                  <Input value={selectedRecord.Class_Name} name="Class_Name" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Class_Name}</span>);
                              }
                            }}/>
                            <Column alignment="left" caption={'Description'} dataField={'Itm_Descr'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
                                return (
                                  <Input value={selectedRecord.Itm_Descr} name="Itm_Descr" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Itm_Descr}</span>);
                              }
                            }}/>
                            <Column alignment="left" caption={'Item Cost'} dataField={'Item_Cost'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
                                return (
                                  <Input value={selectedRecord.Item_Cost} name="Item_Cost" size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Item_Cost}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_Item === record.data.PKey_Item) {
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
                                  </div>
                                );
                              }
                            }}/>
                          </CustomGrid>
                        </Col>
                        <AddItem rowKey="PKey_OP_Contact" isSaving={isSaving} isModalOpen={this.isModalOpen} addNewRecord={this.addNewRecord} isModal={isModal}/>
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

export default connect(mapStateToProps)(TblSelect);
