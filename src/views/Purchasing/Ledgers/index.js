import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {ApiService} from "../../../services/ApiService";
import {Input, message, Spin, Menu, Dropdown} from "antd";
import {connect} from "react-redux";
import Loader from "../../Common/Loader";
import clonedeep from "lodash.clonedeep";
import AddNewLedgar from "./AddNewLedgar";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";

class Ledger extends Component {
  _apiService = new ApiService();

  state = {
    ledgers: [],
    selectedRecord: null,
    isDataFilter: false,
    searchKey: ''
  }

  componentDidMount() {
    this.getLedgar()
  }

  getLedgar = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getLedgar(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        ledgers: data,
        loading: false,
      })
    }
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord
    });
  }

  saveRecord = async () => {
    const {selectedRecord, ledgers = []} = this.state;
    this.setState({
      isSaving: true
    });
    const data =  await this._apiService.updateLedgar(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Ledger Updated Successfully');
      const Index = ledgers.findIndex(x => x.PKey_OP_Ledger === selectedRecord.PKey_OP_Ledger)
      if(Index > -1){
        ledgers[Index] = selectedRecord
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        ledgers
      });
    }
    this.refreshGrid()
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deleteLedger(selectedRecord.PKey_OP_Ledger)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Ledger Deleted Successfully');
      const {ledgers} = this.state;
      this.setState({
        ledgers: ledgers.filter(x => x.PKey_OP_Ledger !== selectedRecord.PKey_OP_Ledger)
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

  onCancelSaveRecord = () => {
    this.setState({
      selectedRecord: null,
    })
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true
    });
    const  {ledgers = []} = this.state
    const data  = await this._apiService.updateLedgar(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      });
    } else {
      message.success('Ledger Added Successfully');
      payload.PKey_OP_Ledger = data;
      ledgers.push(payload)
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        ledgers
      });
    }
    this.refreshGrid()
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
  }

  render() {
    const { loading, isModal, isSaving, selectedRecord, ledgers} = this.state;
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
                            dataSource={ledgers}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_Ledger"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" caption={'Ledger Number'} sortOrder={'asc'} dataField={'LedgerNumber'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Ledger === record.data.PKey_OP_Ledger) {
                                return (
                                  <Input value={selectedRecord.LedgerNumber} name="LedgerNumber"  size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.LedgerNumber}</span>);
                              }
                            }}/>
                            <Column alignment="left" caption={'Description'} dataField={'Description'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_Ledger === record.data.PKey_OP_Ledger) {
                                return (
                                  <Input value={selectedRecord.Description} name="Description"  size="small" onChange={(event) => this.onRecordChange(event)}/>
                                );
                              } else {
                                return (<span>{record.data.Description}</span>);
                              }
                            }}/>
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>} cellRender={(record) => {
                              const menu = (
                                <Menu>
                                  <Menu.Item onClick={() => this.onDelete(record.data)}>
                                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                  </Menu.Item>
                                </Menu>
                              );
                              if (selectedRecord && selectedRecord.PKey_OP_Ledger === record.data.PKey_OP_Ledger) {
                                return (
                                  <div>
                                    <span className="mr-10 text-primary cursor-pointer" onClick={this.saveRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
                                    <span className="text-primary cursor-pointer" onClick={this.onCancelSaveRecord}>Cancel</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex-align-item-center cursor-pointer">
                                    <span className="text-primary mr-5" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                                    <Dropdown overlay={menu} trigger={['click']}>
                                      <i className="icon-options-vertical text-primary cursor-pointer" />
                                    </Dropdown>
                                  </div>
                                );
                              }
                            }}/>
                          </CustomGrid>
                        </Col>
                      </Row>
                      <AddNewLedgar isSaving={isSaving} facilityKey={this.props.facilityKey} addNewRecord={this.addNewRecord} isModal={isModal} isModalOpen={this.isModalOpen}/>
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
export default connect(mapStateToProps)(Ledger);
