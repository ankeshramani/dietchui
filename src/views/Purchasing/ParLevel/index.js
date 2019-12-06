import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Input, message, Popconfirm, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
import AddParLevel from './AddParLevel'
class ParLevel extends Component {
  _apiService = new ApiService();

  state = {
    parLevelList: [],
    loading: true,
    selectedRecord: null,
    isModal: false,
    isDataFilter: false,
    searchKey: ''
  }

  componentDidMount() {
    this.getParLevel()
  }



  getParLevel = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getParLevel(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        parLevelList: data,
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
    const {selectedRecord, parLevelList = []} = this.state;
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
      const Index = parLevelList.findIndex(x => x.PKey_OP_ParLevel === selectedRecord.PKey_OP_ParLevel);
      if (Index > -1) {
        parLevelList[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        parLevelList
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
    const {parLevelList = []} = this.state;
    const data  = await this._apiService.updateParLevel(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Inventory Location Added Successfully');
      payload.PKey_OP_ParLevel = data;
      parLevelList.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        parLevelList
      });
    }
    this.refreshGrid()
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  handleDelete = async (record) => {
    const data = await this._apiService.deletePerLevel(record.PKey_OP_ParLevel)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Par Level Deleted Successfully');
      const {parLevelList} = this.state;
      this.setState({
        parLevelList: parLevelList.filter(x => x.PKey_OP_ParLevel !== record.PKey_OP_ParLevel)
      })
    }
    this.refreshGrid()
  }

  render() {
    const { loading,  isModal, isSaving, parLevelList = [], selectedRecord} = this.state;
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
                            dataSource={parLevelList}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_ParLevel"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" caption={'Name'} dataField={'Name'} sortOrder={'asc'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_ParLevel === record.data.PKey_OP_ParLevel) {
                                return (
                                  <Input value={selectedRecord.Name} name="Name" size="small" onChange={this.onRecordChange}/>
                                );
                              } else {
                                return (<span>{record.data.Name}</span>);
                              }
                            }} />
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}  cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_ParLevel === record.data.PKey_OP_ParLevel) {
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
                                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.data)}>
                                      <span className="text-primary mr-5 cursor-pointer">Delete</span>
                                    </Popconfirm>
                                  </div>
                                );
                              }
                            }} />
                          </CustomGrid>
                        </Col>
                      </Row>
                      <AddParLevel isSaving={isSaving} facilityKey={this.props.facilityKey} addNewRecord={this.addNewRecord} isModal={isModal} isModalOpen={this.isModalOpen}/>
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

export default connect(mapStateToProps)(ParLevel);
