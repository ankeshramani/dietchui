import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Dropdown, Input, Menu, message, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import clonedeep from "lodash.clonedeep";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
import AddPaymentType from './AddPaymentType'

class PaymentType extends Component {
  _apiService = new ApiService();

  state = {
    paymentTypesList: [],
    loading: true,
    selectedRecord: null,
    isModal: false,

  }

  componentDidMount() {
    this.getPaymentTypes()
  }

  getPaymentTypes = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getPaymentTypes()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        paymentTypesList: data,
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
    const {selectedRecord, paymentTypesList = []} = this.state;
    this.setState({
      isSaving: true,
    });
    const data =  await this._apiService.addOrUpdatePaymentType(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Payment Type Updated Successfully');
      const Index = paymentTypesList.findIndex(x => x.PKey_OP_PaymentType === selectedRecord.PKey_OP_PaymentType);
      if (Index > -1) {
        paymentTypesList[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        paymentTypesList
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
    const {paymentTypesList = []} = this.state;
    const data  = await this._apiService.addOrUpdatePaymentType(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Payment Type Added Successfully');
      payload.PKey_OP_PaymentType = data;
      paymentTypesList.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        paymentTypesList
      });
    }
    this.refreshGrid()
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  deleteBid = async (PKey_OP_PaymentType) => {
    const item = await this._apiService.deletePaymentType(PKey_OP_PaymentType);
    if (item && item === 'Success') {
      message.success('Detail Deleted Successfully!');
      const { paymentTypesList = [] } = this.state;
      this.setState({
        paymentTypesList: paymentTypesList.filter(x => x.PKey_OP_PaymentType !== PKey_OP_PaymentType),
      });

    } else {
      message.error('Something went wrong! Please try again later.')
    }
  }

  render() {
    const { loading,  isModal, isSaving,  paymentTypesList = [], selectedRecord} = this.state;
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
                            dataSource={paymentTypesList}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_PaymentType"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left" caption={'Name'} dataField={'Name'} sortOrder={'asc'} cellRender={(record) => {
                              if (selectedRecord && selectedRecord.PKey_OP_PaymentType === record.data.PKey_OP_PaymentType) {
                                return (
                                  <Input value={selectedRecord.Name} name="Name" size="small" onChange={this.onRecordChange}/>
                                );
                              } else {
                                return (<span>{record.data.Name}</span>);
                              }
                            }} />
                            <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.isModalOpen}>New</span>}  cellRender={(record) => {
                              const menu = (
                                <Menu>
                                  <Menu.Item onClick={() => this.deleteBid(record.data.PKey_OP_PaymentType)}>
                                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                  </Menu.Item>
                                </Menu>
                              );
                              if (selectedRecord && selectedRecord.PKey_OP_PaymentType === record.data.PKey_OP_PaymentType) {
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
                      <AddPaymentType isSaving={isSaving} facilityKey={this.props.facilityKey} addNewRecord={this.addNewRecord} isModal={isModal} isModalOpen={this.isModalOpen} />
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


export default PaymentType;
