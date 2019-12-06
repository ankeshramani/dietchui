import React, {Component} from "react";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import {DatePicker, Form, Icon, Input, InputNumber, Menu, message, Modal, Select, Spin, Tabs} from "antd";
import {connect} from "react-redux";
import Loader from "../../Common/Loader";
import {ApiService} from "../../../services/ApiService";
import TabsComp from "../../../components/TabsComp/index";
import AddPoDetails from "./AddPoDetails";
import moment from "moment";
import {dateFormat, formatNumber} from "../../../services/common";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
const TabPane = Tabs.TabPane;
const {Option} = Select;
const { TextArea } = Input;

const invoiceState = {
  AccountNumber: null, B2_Address: '', B2_Attn: null, B2_City: '', B2_FKey_Facility: null, B2_Fax: null, B2_Name: '', B2_Phone: '',
  B2_State: '', B2_ZipCode: '', DeliveryDate: '', DepartmentName: '', FKey_OP_Department: null, FKey_OP_Supplier: null,
  InvoiceDetails: null, IsConfirmed: false, PKey_OP_Invoice: -1, PO_Deposit: 0, PO_Discount: 0, PO_SH: 0, PO_Sub_Total: 0, PO_Tax: 0,
  PO_Total: 0, PaymentDescription: '', PoNotes: '', PoNumber: '', RequestedDeliveryDate: null, RevisionDate: null, RevisionDescription: '',
  S2_Address: "", S2_Attn: '', S2_City: '', S2_FKey_Facility: '', S2_Fax: '', S2_Name: '', S2_Phone: '', S2_State: '', S2_ZipCode: '',
  Supplier_Attn: '', Supplier_Name: '',PO_Paid: 0, FKey_OP_PaymentType: '', SortOrder: 0
};

class AddPo extends Component {
  _apiService = new ApiService();

  state = {
    loading: false,
    invoiceData: invoiceState,
    poId: this.props.match.params.poId !== 'new' ? this.props.match.params.poId : '',
    departments: [],
    isEditMode: this.props.match.params.poId === 'new',
    suppliers: [],
    invoiceDetails: [],
    paymentTypes: [],
    supplierBids: [],
    balance: 0,
    isTotalModal: false
  }

  componentDidMount() {
    if (this.state.poId) {
      this.getByPo();
      this.getDeliveryHistoryByPo();
    }
    this.getDropDownValues();
    // this.getPaymentTypes();
  }

  getSupplierBids = async (supplierId) => {
    this.setState({
      supplierBidLoading: true,
    });
    const data = await this._apiService.getSupplirBids(supplierId)
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!');
      this.setState({
        supplierBidLoading: false,
      });
    } else {
      this.setState({
        supplierBids: data,
        supplierBidLoading: false,
      })
    }
  }

  getByPo = async () => {
    const {poId} = this.state;
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getByPo(poId);
    const newState = {loading: false};
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!')
    } else {
      this.setTotal(data);
      if (data.FKey_OP_Supplier) {
        this.getSupplierBids(data.FKey_OP_Supplier);
      }
      newState.invoiceData = data;

    }
    this.setState({
      ...newState,
    });
  }

  getDeliveryHistoryByPo = async () => {
    const {poId} = this.state;
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getDeliveryHistoryByPo(poId)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        deliveryHistoryList: data,
        loading: false,
      })
    }
  }

  saveInvoiceDetails = (invoiceDetails) => {
    this.setState({
      invoiceDetails
    });
  }

  getDropDownValues = async () => {
    const payload = {
      GetDepartments: true,
      GetSuppliers: true,
      GetFacilities: false,
      GetItems: false,
      GetPaymentType: true,
    };
    const data = await this._apiService.getDropDownValues(payload);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!');
    } else {
      const suppliers = (data.suppliers || []).sort((a,b) => {
        return a.Name > b.Name ? 1 : -1;
      });
      const facilitiesData = (data.facilitiesData || []).sort((a,b) => {
        return a.Facility_Name > b.Facility_Name ? 1 : -1;
      });
      const paymentTypes = (data.paymentTypes || []);
      this.setState({
        suppliers,
        facilitiesData,
        paymentTypes
      })
    }

  }

  submitInvoice = async () => {
    const {invoiceData} = this.state;
    const focusedRowKey = this.props.match.params.poId;
    this.setState({
      isSaving: true,
    });
    const payload = {
      ...invoiceData
    };
    const data = await this._apiService.addUpdatePo(payload);
    const newState = {isSaving: false};
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!')
    } else {
      message.success('Po Saved Successfully');
      this.submitInvoiceDetails(data);
      this.props.history.push('/purchasing/purchase-order', {focusedRowKey})
    }
    this.setState({
      ...newState,
    });
  }

  submitInvoiceDetails = async (FKey_OP_PO) => {
    const {invoiceDetails, invoiceData} = this.state;
    if (!invoiceDetails.length) {
      return;
    }
    this.setState({
      isSaving: true,
    });
    const payload = invoiceDetails.map(x => {
      return {...x, FKey_OP_Supplier: invoiceData.FKey_OP_Supplier, FKey_OP_PO}
    });
    const data = await this._apiService.addUpdateMultiplePoDetail(payload);
    const newState = {isSaving: false};
    if (!data || data.error) {
      message.error('Something went wrong in saving invoice details. Please try again later!')
    } else {
      await this.getInvoiceData();
    }
    this.setState({
      ...newState,
    });
  }

  setTotal = (invoiceData) => {
    const {PO_Sub_Total, PO_Deposit, PO_Discount, PO_Tax, PO_SH, PO_Paid } = invoiceData;
    invoiceData.PO_Total = (Number(PO_Sub_Total || 0) + Number(PO_Tax || 0) + Number(PO_SH || 0)) -
      Number(PO_Deposit || 0) - Number(PO_Discount || 0);

    this.setState({
      balance : Number( invoiceData.PO_Total || 0) - Number(PO_Paid || 0)
    })
  }

  onChange = (event) => {
    const newState = {[event.target.name]: event.target.value};
    if (event.target.name === 'B2_FKey_Facility') {
      const facilityItem = (this.props.facilitiesData || []).find(x => x.PKey_Facility === Number(event.target.value));
      if (facilityItem) {
        newState.B2_Address = facilityItem.Address1;
        newState.B2_City = facilityItem['City'];
        newState.B2_State = facilityItem['State'];
        newState.B2_ZipCode = facilityItem['Zip'];
        newState.B2_Phone = facilityItem['Phone'];
        newState.B2_Fax = facilityItem['Fax'];
      }
    }
    if (event.target.name === 'S2_FKey_Facility') {
      const facilityItem = (this.props.facilitiesData || []).find(x => x.PKey_Facility === Number(event.target.value));
      if (facilityItem) {
        newState.S2_Address = facilityItem.Address1;
        newState.S2_City = facilityItem['City'];
        newState.S2_State = facilityItem['State'];
        newState.S2_ZipCode = facilityItem['Zip'];
        newState.S2_Phone = facilityItem['Phone'];
        newState.S2_Fax = facilityItem['Fax'];
      }
    }
    const invoiceData = {
      ...this.state.invoiceData,
      ...newState
    };
    this.setState({
      invoiceData
    });
    if(event.target.name === "PO_Deposit" || event.target.name === "PO_Discount" || event.target.name === "PO_Tax" || event.target.name === "PO_SH"
      || event.target.name === "PO_Paid"){
      this.setTotal(invoiceData);
    }
  }

  onChangeSupplier = (value) => {
    if (this.state.invoiceDetails.length) {
      Modal.confirm({
        content: `There are bids in this invoice and you are trying to change the supplier.
              By changing the supplier you will be removing all bids from this po. Would you like to continue?`,
        okText: 'Yes',
        cancelText: 'Cancel',
        onOk: () => {
          this.setState({
            invoiceData: {
              ...this.state.invoiceData,
              FKey_OP_Supplier: value
            },
            invoiceDetails: [],
          });
        },
      });
    } else {
      this.setState({
        invoiceData: {
          ...this.state.invoiceData,
          FKey_OP_Supplier: value
        }
      });
    }
    if (value) {
      this.getSupplierBids(value)
    }
  }

  onEdit = () => {
    this.setState({
      isEditMode: true,
    })
  }

  toggleBillingModal = () => {
    this.setState({
      isBillingModal: !this.state.isBillingModal
    });
  }

  toggleShippingModal = () => {
    this.setState({
      isShippingModal: !this.state.isShippingModal
    });
  }
  toggleTotalModal = () => {
    this.setState({
      isTotalModal: !this.state.isTotalModal
    });
  }

  getInvoiceName = (id) => {
    const {paymentTypes} = this.state;
    const item = (paymentTypes || []).find(x => String(x.PKey_OP_PaymentType) === String(id));
    return item ? item.Name : '';
  }

  render() {
    const {isSaving, loading, poId, invoiceData, isEditMode, departments = [], supplierBidLoading,
      suppliers, isBillingModal, isShippingModal, isTotalModal, balance, paymentTypes, deliveryHistoryList, supplierBids} = this.state;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      labelAlign: 'right'
    };
    const modalFormItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      labelAlign: 'right'
    };
    const {facilitiesData = []} = this.props;
    const getFacilityName = (facilityId) => {
      if (!facilityId) {
        return '';
      }
      return facilitiesData.some(x => x.PKey_Facility === facilityId) ? facilitiesData.find(x => x.PKey_Facility === facilityId).Facility_Name : ''
    };
    const getDepartmentName = (departmentId) => {
      if (!departmentId) {
        return '';
      }
      return departments.some(x => x.PKey_OP_Department === departmentId) ? departments.find(x => x.PKey_OP_Department === departmentId).Name : ''
    };
    const getSupplierName = (supplierId) => {
      if (!supplierId) {
        return '';
      }
      return suppliers.some(x => x.PKey_OP_Supplier === supplierId) ? suppliers.find(x => x.PKey_OP_Supplier === supplierId).Name : ''
    };
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            {
              isEditMode ?
                <Menu.Item key="Order" onClick={this.submitInvoice}>
                  <Icon type="save" />
                  {isSaving ? <Spin size={"small"}/> : 'Save'}
                </Menu.Item> :
                <Menu.Item key="Order" onClick={this.onEdit}>
                  <Icon type="form"/>
                  Edit
                </Menu.Item>
            }
          </Menu>
        </div>
        <Form  {...formItemLayout} className={isEditMode ? 'view-mode' : ''}>
          <Row>
            <Col xs="12" sm="12" lg="12">
              <Card className="no-border">
                <CardBody className="pt-5 px-10 min-height-card">
                  {
                    loading ? <Loader className="mt-50"/> :
                      <>
                        <Row>
                          <Col md="12" sm="12" className="pr-5">
                            <Card className="mb-10">
                              <CardHeader>Po Information</CardHeader>
                              <CardBody>
                                <Row>
                                  <Col md="6" sm="12">
                                    <Form.Item label="Supplier">
                                      {
                                        isEditMode ? <Select value={invoiceData.FKey_OP_Supplier} autoFocus={true}
                                                             onChange={value => this.onChangeSupplier(value)}>
                                            {
                                              suppliers.map((supplier, index) => (<Option key={`supplier-${index}`} value={supplier.PKey_OP_Supplier}>{supplier.Name}</Option>))
                                            }
                                          </Select> :
                                          getSupplierName(invoiceData.FKey_OP_Supplier)
                                      }
                                    </Form.Item>
                                    <Form.Item label="PO Date">
                                      { isEditMode ?
                                        <DatePicker format={dateFormat} onChange={(date, dateString) => this.onChange({
                                          target: {
                                            name: 'PoDate',
                                            value: dateString
                                          }
                                        })}
                                                    value={invoiceData.PoDate ? moment(invoiceData.PoDate) : null}
                                        /> : (invoiceData.PoDate ? moment(invoiceData.PoDate).format(dateFormat) : '-') }
                                    </Form.Item>
                                    <Form.Item label="TBD">
                                      { isEditMode ? <Input value={invoiceData.PoNumber} name="PoNumber" onChange={this.onChange}/> : invoiceData.PoNumber }
                                    </Form.Item>
                                    <Form.Item label="Supplier Attn">
                                      { isEditMode ? <Input value={invoiceData.Supplier_Attn} name="Supplier_Attn"
                                                            onChange={this.onChange}/> : invoiceData.Supplier_Attn }
                                    </Form.Item>
                                    <Form.Item label="Billing Facility">
                                      { isEditMode ?
                                        <div className="d-flex">
                                          <Select
                                            value={invoiceData.B2_FKey_Facility ? invoiceData.B2_FKey_Facility.toString() : ''}
                                            name="B2_FKey_Facility"
                                            onChange={(value) => this.onChange({target: {name: 'B2_FKey_Facility', value}})}
                                          >
                                            {
                                              facilitiesData.map((d, i) => (
                                                <Option value={String(d.PKey_Facility)} key={i}>{d.Facility_Name}</Option>
                                              ))
                                            }
                                          </Select>
                                          {invoiceData.B2_FKey_Facility && <Icon type="edit" onClick={this.toggleBillingModal} className="ml-10 mt-10"/>}
                                        </div>
                                        :
                                        getFacilityName(invoiceData.B2_FKey_Facility)}
                                    </Form.Item>
                                    <Form.Item label="Shipping Facility">
                                      { isEditMode ?
                                        <div className="d-flex">
                                          <Select
                                            value={invoiceData.S2_FKey_Facility ? invoiceData.S2_FKey_Facility.toString() : ''}
                                            name="S2_FKey_Facility"
                                            onChange={(value) => this.onChange({target: {name: 'S2_FKey_Facility', value}})}
                                          >
                                            {
                                              facilitiesData.map((d, i ) => (
                                                <Option value={String(d.PKey_Facility)} key={i}>{d.Facility_Name}</Option>
                                              ))
                                            }
                                          </Select>
                                          {invoiceData.S2_FKey_Facility && <Icon type="edit" onClick={this.toggleShippingModal} className="ml-10 mt-10"/> }
                                        </div>
                                        :
                                        getFacilityName(invoiceData.S2_FKey_Facility)}
                                    </Form.Item>
                                    <Form.Item label="Ship Department">
                                      { isEditMode ?  <Select value={invoiceData.FKey_OP_Department} onChange={value => this.onChange({
                                        target: {
                                          name: 'FKey_OP_Department',
                                          value
                                        }
                                      })}>
                                        {
                                          departments.map((department, index) => (<Option key={`department-${index}`} value={department.PKey_OP_Department}>{department.Name}</Option>))
                                        }
                                      </Select> : getDepartmentName(invoiceData.FKey_OP_Department) }
                                    </Form.Item>
                                  </Col>
                                  <Col md="6" sm="12">
                                    <Form.Item label="Delivery Date">
                                      { isEditMode ?
                                        <DatePicker format={dateFormat} onChange={(date, dateString) => this.onChange({
                                          target: {
                                            name: 'DeliveryDate',
                                            value: dateString
                                          }
                                        })}
                                                    value={invoiceData.DeliveryDate ? moment(invoiceData.DeliveryDate) : null}
                                        /> : (invoiceData.DeliveryDate ? moment(invoiceData.DeliveryDate).format(dateFormat) : null)}
                                    </Form.Item>
                                    <Form.Item label="Account No.">
                                      { isEditMode ? <Input value={invoiceData.AccountNumber} name="AccountNumber"
                                                            onChange={this.onChange}/> : invoiceData.Supplier_Attn }
                                    </Form.Item>
                                    <Form.Item label="Sort Order">
                                      {isEditMode ?
                                        <Select
                                          value={invoiceData.SortOrder}
                                          name="SortOrder"
                                          onChange={(value) => this.onChange({target: {name: 'SortOrder', value}})}
                                        >
                                          <Option value={0}>Item Description</Option>
                                          <Option value={1}>Product Number</Option>
                                        </Select> : invoiceData.SortOrder === 0 ? 'Item Description' : invoiceData.SortOrder === 1 ? 'Product Number' : ''
                                      }
                                    </Form.Item>
                                    <Form.Item label="Payment Type">
                                      {isEditMode ?
                                        <div className="d-flex">
                                          <Select
                                            value={invoiceData.FKey_OP_PaymentType ? invoiceData.FKey_OP_PaymentType.toString() : ''}
                                            name="FKey_OP_PaymentType"
                                            onChange={(value) => this.onChange({target: {name: 'FKey_OP_PaymentType', value}})}
                                          >
                                            {
                                              paymentTypes.map((d, i) => (
                                                <Option value={String(d.PKey_OP_PaymentType)} key={i}>{d.Name}</Option>
                                              ))
                                            }
                                          </Select>
                                        </div>
                                        : <span>{invoiceData.FKey_OP_PaymentType ? this.getInvoiceName(invoiceData.FKey_OP_PaymentType) : '-'}</span>
                                      }
                                    </Form.Item>
                                    <Form.Item label="Total">
                                      {isEditMode ?
                                        <div className="d-flex">
                                          {formatNumber(invoiceData.PO_Total, 3)}
                                          <Icon type="edit" onClick={this.toggleTotalModal} className="ml-10 mt-10"/>
                                        </div>
                                        : <span>{formatNumber(invoiceData.PO_Total, 3)}</span>
                                      }
                                    </Form.Item>

                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col md="12" className="px-10">
                            <TabsComp defaultActiveKey="1">
                              <TabPane tab="Details" key="1">
                                <Row>
                                  <Col md="12" sm="12">
                                    <AddPoDetails supplierBidLoading={supplierBidLoading} poId={poId} saveInvoiceDetails={this.saveInvoiceDetails} isEditable={isEditMode} FKey_OP_Supplier={invoiceData.FKey_OP_Supplier} supplierBids={supplierBids}/>
                                  </Col>
                                </Row>
                              </TabPane>
                              <TabPane tab="Misc and Notes" key="2">
                                <Row>
                                  <Col md="4" sm="12">
                                    <Form.Item label="Revision Date">
                                      { isEditMode ? <DatePicker format={dateFormat} style={{width: "100%"}} onChange={(date, dateString) => this.onChange({
                                        target: {
                                          name: 'RevisionDate',
                                          value: dateString
                                        }
                                      })}
                                                                 value={invoiceData.RevisionDate ? moment(invoiceData.RevisionDate) : null}
                                      /> : (invoiceData.RevisionDate ? moment(invoiceData.RevisionDate).format(dateFormat) : '-')}
                                    </Form.Item>
                                    <Form.Item label="Revision">
                                      { isEditMode ? <Input value={invoiceData.RevisionDescription} name="RevisionDescription" onChange={this.onChange}/> : invoiceData.RevisionDescription }
                                    </Form.Item>
                                    <Form.Item label="Description">
                                      { isEditMode ?
                                        <TextArea
                                          autosize={{ minRows: 2, maxRows: 10 }}
                                          value={invoiceData.PaymentDescription || ''}
                                          name="PaymentDescription" onChange={this.onChange}
                                        /> :  invoiceData.PaymentDescription
                                      }
                                    </Form.Item>
                                    <Form.Item label="Note:">
                                      { isEditMode ?
                                        <TextArea
                                          autosize={{ minRows: 2, maxRows: 10 }}
                                          value={invoiceData.PoNotes || ''}
                                          name="PoNotes" onChange={this.onChange}
                                        /> :  invoiceData.PoNotes
                                      }
                                    </Form.Item>
                                    <Form.Item label="Private Note:">
                                      { isEditMode ?
                                        <TextArea
                                          autosize={{ minRows: 2, maxRows: 10 }}
                                          value={invoiceData.PrivateNote || ''}
                                          name="PrivateNote" onChange={this.onChange}
                                        /> :  invoiceData.PrivateNote
                                      }
                                    </Form.Item>
                                  </Col>
                                </Row>
                              </TabPane>
                              <TabPane tab="Delivery History" key="3">
                                {
                                  loading ?  <Loader className="mt-50"/> :
                                    <CustomGrid
                                      dataSource={deliveryHistoryList}
                                      showBorders={false}
                                      columnAutoWidth={false}
                                    >
                                      <Column alignment={'left'} caption={'Email ID'} dataField={'EmailID'} />
                                      <Column alignment={'left'} caption={'Type'} dataField={'TypeName'} />
                                      <Column alignment={'left'} caption={'Date'} dataField={'DateEntered'} cellRender={(record)=>{
                                        return <span>{record.data ? moment(record && record.DateEntered && record.data.DateEntered).format(dateFormat) : ''}</span>
                                      }}/>

                                    </CustomGrid>
                                }
                              </TabPane>
                            </TabsComp>
                          </Col>
                        </Row>
                      </>
                  }
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
        <Modal
          visible={isBillingModal}
          title="Billing Information"
          okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
          onCancel={this.toggleBillingModal}
          footer={null}
          cancelButtonProps={{className: 'pull-right ml-10'}}
        >
          <Form {...modalFormItemLayout}>
            <Form.Item label="Attention">
              { isEditMode ? <Input name="B2_Attn" value={invoiceData.B2_Attn} onChange={this.onChange}/> : invoiceData.B2_Attn }
            </Form.Item>
            <Form.Item label="Street">
              { isEditMode ? <Input name="B2_Address" value={invoiceData.B2_Address} onChange={this.onChange}/> : invoiceData.B2_Address }
            </Form.Item>
            <Form.Item label="City, State Zip">
              <Row>
                <Col md="4" sm="12" className="pr-5">
                  { isEditMode ? <Input name="B2_City" value={invoiceData.B2_City} onChange={this.onChange}/> : invoiceData.B2_City }
                </Col>
                <Col md="4" sm="12" className="pr-5 pl-5">
                  { isEditMode ? <Input name="B2_State" value={invoiceData.B2_State} onChange={this.onChange}/> : invoiceData.B2_State }
                </Col>
                <Col md="4" sm="12" className="pl-5">
                  { isEditMode ? <Input name="B2_ZipCode" value={invoiceData.B2_ZipCode} onChange={this.onChange}/> : invoiceData.B2_ZipCode }
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Phone">
              { isEditMode ? <Input name="B2_Phone" value={invoiceData.B2_Phone} onChange={this.onChange}/> : invoiceData.B2_Phone }
            </Form.Item>
            <Form.Item label="Fax">
              { isEditMode ? <Input name="B2_Fax" value={invoiceData.B2_Fax} onChange={this.onChange}/> : invoiceData.B2_Fax }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={isShippingModal}
          title="Ship Information"
          footer={null}
          onCancel={this.toggleShippingModal}
          cancelButtonProps={{className: 'pull-right ml-10'}}
        >
          <Form {...modalFormItemLayout} className="pt-19">
            <Form.Item label="Attention">
              { isEditMode ? <Input name="S2_Attn" value={invoiceData.S2_Attn} onChange={this.onChange}/> : invoiceData.S2_Attn }
            </Form.Item>
            <Form.Item label="Street">
              { isEditMode ? <Input name="S2_Address" value={invoiceData.S2_Address} onChange={this.onChange}/> : invoiceData.S2_Address }
            </Form.Item>
            <Form.Item label="City, State Zip">
              <Row>
                <Col md="4" sm="12" className="pr-5">
                  { isEditMode ? <Input name="S2_City" value={invoiceData.S2_City} onChange={this.onChange}/> : invoiceData.S2_City }
                </Col>
                <Col md="4" sm="12" className="pr-5 pl-5">
                  { isEditMode ? <Input name="S2_State" value={invoiceData.S2_State} onChange={this.onChange}/> : invoiceData.S2_State }
                </Col>
                <Col md="4" sm="12" className="pl-5">
                  { isEditMode ? <Input name="S2_ZipCode" value={invoiceData.S2_ZipCode} onChange={this.onChange}/> : invoiceData.S2_ZipCode }
                </Col>
              </Row>
            </Form.Item>
            <Form.Item label="Phone">
              { isEditMode ? <Input name="S2_Phone" value={invoiceData.S2_Phone} onChange={this.onChange}/> : invoiceData.S2_Phone }
            </Form.Item>
            <Form.Item label="Fax">
              { isEditMode ? <Input name="S2_Fax" value={invoiceData.S2_Fax} onChange={this.onChange}/> : invoiceData.S2_Fax }
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          visible={isTotalModal}
          title="Total"
          footer={null}
          onCancel={this.toggleTotalModal}
          cancelButtonProps={{className: 'pull-right ml-10'}}
        >
          <Form {...modalFormItemLayout} className="pt-19">
            <Form.Item label="Deposit">
              { isEditMode ? <InputNumber style={{width: "100%"}} value={invoiceData.PO_Deposit} name="PO_Deposit" onChange={value => this.onChange({
                target: {name: 'PO_Deposit', value}})}/> : invoiceData.PO_Deposit}
            </Form.Item>
            <Form.Item label="Discount">
              { isEditMode ?
                <InputNumber style={{width: "100%"}} value={invoiceData.PO_Discount} name="PO_Discount" onChange={value => this.onChange(
                  {target: {name: 'PO_Discount', value}})}/> : invoiceData.PO_Discount}
            </Form.Item>
            <Form.Item label="Sub Total:">
              ${invoiceData.PO_Sub_Total || 0}
            </Form.Item>
            <Form.Item label="Tax">
              { isEditMode ? <InputNumber style={{width: "100%"}} value={invoiceData.PO_Tax} name="PO_Tax" onChange={value => this.onChange(
                {target: {name: 'PO_Tax', value}})}/> : invoiceData.PO_Tax}
            </Form.Item>
            <Form.Item label="S/H">
              { isEditMode ? <InputNumber style={{width: "100%"}} value={invoiceData.PO_SH} name="PO_SH" onChange={value => this.onChange(
                {target: {name: 'PO_SH', value}})}/> : invoiceData.PO_SH}
            </Form.Item>
            <Form.Item label="Total">
              {formatNumber(invoiceData.PO_Total, 3)}
            </Form.Item>
            <Form.Item label="Paid">
              { isEditMode ? <InputNumber style={{width: "100%"}} value={invoiceData.PO_Paid} name="PO_Paid" onChange={value => this.onChange(
                {target: {name: 'PO_Paid', value}})}/> : invoiceData.PO_Paid}
            </Form.Item>
            <Form.Item label="Balance">
              {formatNumber(balance, 3)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
const AddInvoice = Form.create()(AddPo)
const mapStateToProps = (state) => ({
  facilitiesData: state.settings.facilitiesData,
});
export default connect(mapStateToProps)(AddInvoice);
