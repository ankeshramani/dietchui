import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Checkbox, DatePicker, Form, Icon, Input, InputNumber, Menu, message, Modal, Select, Spin, Tabs} from "antd";
import Loader from "../../Common/Loader";
import {ApiService} from "../../../services/ApiService";
import TabsComp from "../../../components/TabsComp/index";
import {connect} from "react-redux";
import {changeSettings} from "../../../redux/actions/settings/index";
import moment from "moment";
import {dateFormat, formatNumber} from "../../../services/common";
import clonedeep from "lodash.clonedeep";
import {Column, Editing, Summary, TotalItem} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const Option = Select.Option;

class NewOrderGuide extends Component {
  _apiService = new ApiService();

  state = {
    loading: true,
    activeTab: '1',
    orders: [],
    selectedIndex: -1,
    selectedRowIndex: null,
    isTotal: false
  }

   componentDidMount () {
    this.onOrder()
    // this.getEnumDetailsBidStatus()
  }

  /*getEnumDetailsBidStatus = async () => {
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getEnumDetailsBidStatus()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        bidStatus: data,
        loading: false,
      })
    }
  }*/

  onOrder = async () => {
    if (this.props.orderPayload){
      const payload = this.props.orderPayload;
      let data = await this._apiService.onOrder(payload)
      const newState = {loading: false};
      if (!data || data.error) {
        message.error('something went wrong!');
        newState.orders = [];
      } else {
       (data || []).forEach(x => {
         if (!x.OpPo) {
           x.OpPo = {};
         }
       });
        newState.orders = data;
        newState.selectedIndex = data.length ? 0 : -1;
        newState.orders.forEach(x => {
          this.setSubTotal(x);
        })
      }
      this.setState({
        ...newState,
      });
      this.props.onChangeSettings({
        orderPayload: null,
      });
    } else {
      this.props.history.push('/purchasing/order-guides');
      this.setState({
        loading: false,
      });
    }
  }

  toggleShippingModal = () => {
    this.setState({
      isShippingModal: !this.state.isShippingModal
    });
  }

  toggleTotalModal = () => {
    this.setState({
      isTotal: !this.state.isTotal
    });
  }

  submitOrder = async () => {
    const {orders} = this.state;
    this.setState({
      isSaving: true,
    });
    orders.forEach((item)=> {
      if(item && item.OpPo){
        (item.OpPo.DeliveryHistory || []).forEach((d) => {
         const data =  ['Body', 'DateEntered', 'EmailID', 'ErrorMessage', 'FKey_OP_PO', 'FirstName', 'LastName', 'PKey_OP_PO_DeliveryHistory', 'Subject', 'SucessfullySent', 'TypeName']
          data.forEach(f => {
            if((d && !d[f]) || d[f] === undefined){
              if (f === 'FKey_OP_PO'){
                d[f] = -1;
              }else if(f === 'SucessfullySent'){
                d[f] = false
              }else if(f === 'ErrorMessage'){
                d[f] = null
              }else if(f === 'DateEntered'){
                d[f] = new Date()
              } else if (f === 'PKey_OP_PO_DeliveryHistory' && d && !d[f]) {
                d[f] = 0;
              }else {
                d[f] = '';
              }
            } else if(f === 'PKey_OP_PO_DeliveryHistory' && d && d[f] && String(d[f]).length > 10){
              d[f] = 0;
            }
          })
        })
      }
    });
    const data = await this._apiService.insertPOOrder(orders)
    if (!data || data.error) {
      message.error('something went wrong!');
    } else {
      message.success('Order Saved Successfully!');
      this.props.history.push('/purchasing/order-guides');
    }
    this.setState({
      isSaving: false,
    });
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab
    })
  }

  onEditRecord = (selectedRowIndex) => {
    this.setState({
      selectedRowIndex: clonedeep(selectedRowIndex)
    })
  }

  setSubTotal = (orderData) => {
    let PO_Sub_Total = 0;
    orderData.OpPoDetails.forEach((record) => {
      PO_Sub_Total += (Number(record.Quantity || 0) * Number(record.Price || 0));
    });
    if (orderData.OpPo) {
      orderData.OpPo.PO_Sub_Total = PO_Sub_Total;
    }
    this.setTotal(orderData);
  }

  setTotal = (orderData) => {
    if (!orderData.OpPo) {
      orderData.OpPo = {};
    }
    const {PO_Sub_Total, PO_Deposit, PO_Discount, PO_Tax, PO_SH } = orderData.OpPo;
    orderData.OpPo.PO_Total = (Number(PO_Sub_Total || 0) + Number(PO_Tax || 0) + Number(PO_SH || 0)) -
      Number(PO_Deposit || 0) - Number(PO_Discount || 0);
  }

  onChangeDetailedRow = (event, rowIndex) => {
    let {selectedIndex, orders} = this.state;
    orders[selectedIndex]['OpPoDetails'][rowIndex][event.target.name] = event.target.value;
    if(event.target.name === "Quantity" || event.target.name === "Price"){
      this.setSubTotal(orders[selectedIndex]);
    }
    this.setState({
      orders,
    });
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onSelectionChange = (selectedIndex) => {
    this.setState({
      selectedIndex: selectedIndex.rowIndex,
    });
  }

  onChange = (event) => {
    const {selectedIndex, orders} = this.state;
    if(orders.length){
      orders[selectedIndex]['OpPo'][event.target.name] = event.target.value;
      if(event.target.name === "PO_Deposit" || event.target.name === "PO_Discount" || event.target.name === "PO_Tax" || event.target.name === "PO_SH"){
        this.setTotal(orders[selectedIndex]);
      }
      this.setState({
        orders,
      });
    }
  }

  onDatePickerChange = (name, date, dateString) => {
    const {selectedIndex, orders} = this.state;
    orders[selectedIndex]['OpPo'][name] = dateString;
    this.setState({
      orders,
    });
  }

  onRowUpdating = (selectedVewData) => {
    let {selectedIndex, orders} = this.state;
    const data = {
      ...selectedVewData.oldData,
      ...selectedVewData.newData
    }
    orders[selectedIndex].OpPo["DeliveryHistory"][selectedVewData.key] = data;
    this.setState({
      orders
    })

  }

  onRowRemoved = (record) => {
    let {selectedIndex, orders} = this.state;
    const index = orders[selectedIndex].OpPo["DeliveryHistory"].findIndex(f => f.PKey_OP_PO_DeliveryHistory ===  record.data.PKey_OP_PO_DeliveryHistory);
    orders[selectedIndex].OpPo["DeliveryHistory"].splice(index, 1);
    this.setState({
      orders
    });
    this.refreshGrid();
  }

  onRowInserted = () => {
    let { orders} = this.state;
    this.setState({
      orders,
    });
    this.refreshGrid();
  }


  render() {
    const {loading, orders, selectedIndex, isSaving, selectedRowIndex, isShippingModal, isTotal,} = this.state;
    const { facilitiesData = [] } = this.props;
    const newOpPo = (orders || []).map((item)=>{
      return item.OpPo;
    }).filter(x => x.PKey_OP_PO);
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'right'
    };
    const modalFormItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 19},
      labelAlign: 'right'
    };
    facilitiesData.sort((a,b)=> {
      if ( a.Facility_Name < b.Facility_Name )
        return -1;
      if ( a.Facility_Name > b.Facility_Name )
        return 1;
      return 0;
    });
    const orderData = orders[selectedIndex] || {};
    const OpPo = orderData.OpPo || {} ;
    const OrdersToBeConfirmed = newOpPo.filter((x)=> x.Method  === 1)
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order" onClick={this.submitOrder} disabled={!(Number(selectedIndex) > -1)}>
              <Icon type="save" />
              {isSaving ? <Spin size={"small"}/> : `Confirm Order (${OrdersToBeConfirmed.length})`}
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-0 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50" /> :
                    <>
                      <Row>
                        <Col sm="12">
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={newOpPo}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_PO"
                            title={'Pending Orders'}
                          >
                            <Column alignment="left" width={"6%"} caption={'Selected'} cellRender={(record) => {
                              return  <Checkbox checked={selectedIndex === record.rowIndex} onChange={() => this.onSelectionChange(record)} />
                            }}/>
                            <Column alignment="left" width={"10%"} caption={'Supplier'} dataField={'Supplier_Name'}/>
                            <Column alignment="left" width={"10%"} caption={'Department Name'} dataField={'DepartmentName'}/>
                            <Column alignment="left" width={"10%"} caption={'Order Number'} dataField={'PoNumber'} cellRender={(record) => {
                              if(selectedIndex === record.data.rowIndex){
                                return <Input name="PoNumber" value={record.data.PoNumber}  onChange={(event) => this.onChange(event, record)} />
                              }else {
                                return (
                                  <span>{record.data.PoNumber}</span>
                                )
                              }
                            }}/>
                            <Column alignment="left" width={"10%"} caption={'Order Date'} dataField={'PoDate'} cellRender={(record) => {
                              if(selectedIndex === record.rowIndex){
                                return(
                                  <DatePicker format={dateFormat} onChange={(date, dateString) => this.onDatePickerChange('PoDate', date, dateString)}
                                              value={record.data.PoDate ? moment(record.data.PoDate) : null} />
                                )

                              }else {
                              return (<span>{record.data.PoDate ? moment(record.data.PoDate).format(dateFormat) : '-'}</span>)
                            }
                            }}/>
                            <Column alignment="left" width={"10%"} caption={'Create'} dataField={'Method'} cellRender={(record) => {
                              if(selectedIndex === record.rowIndex){
                                return  <Select
                                  showSearch
                                  style={{ width: "100%" }}
                                  value={record.data.Method}
                                  onChange={(value) => this.onChange({target: {name: 'Method', value}})}
                                >
                                  <Select.Option value={0}>No</Select.Option>
                                  <Select.Option value={1}>Yes</Select.Option>
                                  <Select.Option value={2}>Add</Select.Option>
                                </Select>
                              }else {
                                return (
                                  <span>{(record.data.Method === 0) ? 'No' : (record.data.Method === 1) ? 'Yes' : (record.data.Method === 2) ? 'Add' : null }</span>
                                )
                              }
                            }}/>

                            <Column alignment="left" width={"15%"} caption={'Account No'} dataField={'AccountNumber'}/>
                            <Column alignment="left" width={"15%"} caption={'Dlvy Date'} dataField={'DeliveryDate'} cellRender={(record) => {
                              return (<span>{record.data.DeliveryDate ? moment(record.data.DeliveryDate).format(dateFormat) : '-'}</span>)
                            }}/>
                            <Column alignment="left" width={"15%"} caption={'Req Dlvy Date'} dataField={'DeliveryDate'} cellRender={(record) => {
                              return (<span>{record.data.RequestedDeliveryDate ? moment(record.data.RequestedDeliveryDate).format(dateFormat): '-'}</span>)
                            }}/>
                            <Column alignment="left" width={"15%"} caption={'Min Met'} dataField={'MinimumMet'} cellRender={(record) => {
                              return (<span>{record.data.MinimumMet ? 'Yes': 'No'}</span>)
                            }}/>
                            <Column alignment={'left'} width={"20%"} caption={'Total'} dataField={'PO_Total'} cellRender={(record) => {
                              return <span>{formatNumber(record.data.PO_Total, 2)}</span>
                            }}/>
                            <Summary recalculateWhileEditing={true}>
                              <TotalItem
                                column={'PO_Total'}
                                summaryType={'sum'}
                                displayFormat={(record) => {
                                  return formatNumber(record , 2)
                                }}
                              />
                            </Summary>
                          </CustomGrid>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12" className="mt-50">
                          <TabsComp defaultActiveKey="1" onChange={this.onTabChange}>
                            <TabPane tab={(OpPo.Supplier_Name || OpPo.DepartmentName) ? `${OpPo.Supplier_Name} ${(OpPo.Supplier_Name && OpPo.DepartmentName) ? '-' : ''}  ${OpPo.DepartmentName ? OpPo.DepartmentName : ''}` : 'Details' } key="1">
                              <Row>
                                <Col md="4">
                                  <Form  {...formItemLayout}>
                                    <Form.Item label="Acc. No:">
                                        <Input value={OpPo.AccountNumber || ''} name="AccountNumber" onChange={this.onChange} />
                                    </Form.Item>
                                    <Form.Item label="Attention:">
                                        <Input value={OpPo.Supplier_Attn || ''} name="Supplier_Attn" onChange={this.onChange} />
                                    </Form.Item>
                                    <Form.Item label="Billing Facility:">
                                      <div className="d-flex">
                                      <Select
                                        value={OpPo.B2_FKey_Facility ? OpPo.B2_FKey_Facility.toString() : ''}
                                        name="B2_FKey_Facility" onChange={(value) => this.onChange({target: {name: 'B2_FKey_Facility', value}})}
                                      >
                                        {
                                          facilitiesData.map((d, i) => (
                                            <Option value={String(d.PKey_Facility)} key={i}>{d.Facility_Name}</Option>
                                          ))
                                        }
                                      </Select>
                                        {OpPo.B2_FKey_Facility && <Icon type="edit" onClick={this.toggleShippingModal} className="ml-10 mt-10"/> }
                                      </div>
                                    </Form.Item>
                                    <Form.Item label="Shipping Facility:">
                                      <div className="d-flex">
                                      <Select
                                        value={OpPo.S2_FKey_Facility ? OpPo.S2_FKey_Facility.toString() : ''}
                                        name="S2_FKey_Facility" onChange={(value) => this.onChange({target: {name: 'S2_FKey_Facility', value}})}
                                      >
                                        {
                                          facilitiesData.map((d, i) => (
                                            <Option value={String(d.PKey_Facility)} key={i}>{d.Facility_Name}</Option>
                                          ))
                                        }
                                      </Select>
                                      {OpPo.S2_FKey_Facility && <Icon type="edit" onClick={this.toggleShippingModal} className="ml-10 mt-10"/> }
                                      </div>
                                    </Form.Item>
                                    <Form.Item label="Dlvy Date">
                                        <DatePicker format={dateFormat} onChange={(date, dateString) => this.onDatePickerChange('DeliveryDate', date, dateString)}
                                                     value={OpPo.DeliveryDate ? moment(OpPo.DeliveryDate) : null} />
                                    </Form.Item>
                                    <Form.Item label="Req Dlvy Date">
                                        <DatePicker format={dateFormat} onChange={(date, dateString) => this.onDatePickerChange('RequestedDeliveryDate', date, dateString)}
                                                     value={OpPo.RequestedDeliveryDate ? moment(OpPo.RequestedDeliveryDate) : null} />
                                    </Form.Item>
                                    <Form.Item label="Sort Order">
                                      <Select
                                        value={OpPo.SortOrder}
                                        name="SortOrder" onChange={(value) => this.onChange({target: {name: 'SortOrder', value}})}
                                      >
                                        <Option value={0}>Item Description</Option>
                                        <Option value={1}>Product Number</Option>
                                      </Select>
                                    </Form.Item>
                                    <Form.Item label="Total">
                                      <div className="d-flex">
                                        <span className="w-100-p"> {formatNumber(OpPo.PO_Total, 3)}</span>
                                         <Icon type="edit" onClick={this.toggleTotalModal} className="ml-10 mt-10"/>
                                      </div>
                                    </Form.Item>
                                    <Form.Item label="Notes:">
                                        <TextArea
                                          autosize={{ minRows: 2, maxRows: 10 }}
                                          value={OpPo.PoNotes || ''}
                                          name="PoNotes" onChange={this.onChange}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Private Note:">
                                        <TextArea
                                          autosize={{ minRows: 2, maxRows: 10 }}
                                          value={OpPo.Supplier_Notes || ''}
                                          name="Supplier_Notes" onChange={this.onChange}
                                        />
                                    </Form.Item>
                                  </Form>
                                </Col>
                                <Col md="8">
                                  <CustomGrid
                                    refCallback={(dg) => this.dg = dg}
                                    dataSource={orderData.OpPoDetails || []}
                                    columnAutoWidth={false}
                                    keyExpr="PKey_OP_PO_Detail"
                                    title={'Bids'}
                                  >
                                    <Column alignment="left" caption={'Description'} dataField={'BidName'}/>
                                    <Column alignment="left" caption={'Brand'} dataField={'Brand'}/>
                                  <Column alignment="left" caption={'Pack/Size'} cellRender={(record) => {
                                      return ( <span>{`${record.data.Pack || record.data.Pack === 0 ? record.data.Pack : ''}/${record.data.Size || record.data.Size === 0 ? record.data.Size : ''} ${record.data.UOM || ''}`}</span>);
                                    }}/>
                                    <Column alignment="left" caption={'Qty.'} width={"8%"} dataField={'Quantity'} cellRender={(record) => {
                                      if (record.rowIndex === selectedRowIndex) {
                                        return (
                                          <Input value={record.data.Quantity} name="Quantity" size="small" onChange={(event) => this.onChangeDetailedRow(event, record.rowIndex)}/>
                                        );
                                      } else {
                                        return ( <span>{record.data.Quantity}</span>);
                                      }
                                    }}/>
                                    <Column alignment="left" caption={'Price'} width={"8%"} dataField={'Price'} cellRender={(record) => {
                                      if (record.rowIndex === selectedRowIndex) {
                                        return (
                                          <Input value={record.data.Price}  name="Price" size="small" onChange={(event) => this.onChangeDetailedRow(event, record.rowIndex)}/>
                                        );
                                      } else {
                                        return ( <span>{formatNumber(record.data.Price, 3)}</span>);
                                      }
                                    }}/>
                                    <Column alignment="left" caption={'Extended'} width={"10%"} cellRender={(record) => {
                                      const Extended = Number(record.data.Price || 0) * Number(record.data.Quantity || 0)
                                      return ( <span>{formatNumber(Extended, 3)}</span>);
                                    }}/>
                                    <Column alignment="left" width={100} cellRender={(record) => {
                                      return  <div className="flex-align-item-center">
                                        {
                                          record.rowIndex !== selectedRowIndex ?
                                            <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onEditRecord(record.rowIndex)}>Edit</span>
                                            :
                                            <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onEditRecord(-1)}>Save</span>
                                        }
                                      </div>
                                    }}/>
                                  </CustomGrid>
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tab={`Emails (${OpPo && OpPo.DeliveryHistory && OpPo.DeliveryHistory.length})`} key="2">
                              <Row>
                                <Col md="12">
                                  <CustomGrid
                                    refCallback={(dg) => this.dg = dg}
                                    dataSource={OpPo.DeliveryHistory || []}
                                    columnAutoWidth={false}
                                    keyExpr="PKey_OP_PO_DeliveryHistory"
                                    title={'Emails to be Sent'}
                                    onRowUpdating={this.onRowUpdating}
                                    onRowRemoved={this.onRowRemoved}
                                    onRowInserted={this.onRowInserted}
                                  >
                                    <Editing
                                      refreshMode={'full'}
                                      mode={'row'}
                                      allowUpdating={true}
                                      allowDeleting={true}
                                      allowAdding={true}
                                      useIcons={false}
                                    />
                                    <Column alignment="left" caption={'First Name'} dataField={'FirstName'}/>
                                    <Column alignment="left" caption={'Last Name'} dataField={'LastName'} c/>
                                    <Column alignment="left" caption={'Email ID'} dataField={'EmailID'} />
                                    <Column alignment="left" caption={'Subject'} dataField={'Subject'}/>
                                    <Column alignment="left" caption={'Body'} dataField={'Body'}/>
                                    <Column alignment="left" caption={'Date'} dataField={'DateEntered'} dataType={'date'}/>
                                  </CustomGrid>
                                </Col>
                              </Row>
                            </TabPane>
                          </TabsComp>
                        </Col>
                      </Row>
                    </>
                }
              </CardBody>
            </Card>
            <Modal
              visible={isShippingModal}
              title="Ship Information"
              footer={null}
              onCancel={this.toggleShippingModal}
              cancelButtonProps={{className: 'pull-right ml-10'}}
            >
              <Form {...modalFormItemLayout} className="pt-19">
                <Form.Item label="Attention">
                  <Input value={OpPo.B2_Attn || ''} name="B2_Attn" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="Street">
                  <Input value={OpPo.S2_Address || ''} name="S2_Address" onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="City, State Zip">
                  <Row>
                    <Col md="4" sm="12" className="pr-5">
                      <Input value={OpPo.S2_City || ''} name="S2_City" onChange={this.onChange}/>
                    </Col>
                    <Col md="4" sm="12" className="pr-5 pl-5">
                      <Input value={OpPo.S2_State || ''} name="S2_State" onChange={this.onChange}/>
                    </Col>
                    <Col md="4" sm="12" className="pl-5">
                      <Input value={OpPo.S2_ZipCode || ''} name="S2_ZipCode" onChange={this.onChange}/>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item label="Phone">
                 <Input name="S2_Phone" value={OpPo.S2_Phone} onChange={this.onChange}/>
                </Form.Item>
                <Form.Item label="Fax">
                  <Input name="S2_Fax" value={OpPo.S2_Fax} onChange={this.onChange}/>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              visible={isTotal}
              title="Totals"
              footer={null}
              onCancel={this.toggleTotalModal}
              cancelButtonProps={{className: 'pull-right ml-10'}}
            >
              <Form {...modalFormItemLayout} className="pt-19">
                <Form.Item label="Deposit:">
                  <InputNumber value={OpPo.PO_Deposit} className="w-100-p" name="PO_Deposit" onChange={(value) => this.onChange({target: {name: 'PO_Deposit', value}})}/>
                </Form.Item>
                <Form.Item label="Discount:">
                  <InputNumber value={OpPo.PO_Discount} className="w-100-p" name="PO_Discount" onChange={(value) => this.onChange({target: {name: 'PO_Discount', value}})}/>
                </Form.Item>
                <Form.Item label="Sub Total:">
                  <span className="w-100-p">{formatNumber(OpPo.PO_Sub_Total, 3)}</span>
                </Form.Item>
                <Form.Item label="Tax:">
                  <InputNumber value={OpPo.PO_Tax} className="w-100-p" name="PO_Tax" onChange={(value) => this.onChange({target: {name: 'PO_Tax', value}})}/>
                </Form.Item>
                <Form.Item label="S/H:">
                  <InputNumber value={OpPo.PO_SH} className="w-100-p" name="PO_SH" onChange={(value) => this.onChange({target: {name: 'PO_SH', value}})}/>
                </Form.Item>
                <Form.Item label="Total:">
                  <span className="w-100-p">{formatNumber(OpPo.PO_Total, 3)}</span>
                </Form.Item>
              </Form>
            </Modal>
          </Col>
        </Row>
      </div>
    )
  }

}
const mapStateToProps = (state) => ({
  orderPayload: state.settings.orderPayload,
  facilitiesData: state.settings.facilitiesData,
});
const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});
const NewOrderGuideForm = Form.create()(NewOrderGuide)
export default connect(mapStateToProps, mapDispatchToProps) (NewOrderGuideForm);
