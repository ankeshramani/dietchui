import React, {Component} from "react";
import {Col, Row} from "reactstrap";
import { Dropdown, InputNumber, Menu, message, Spin} from "antd";
import clonedeep from "lodash.clonedeep";
import {ApiService} from "../../../services/ApiService";
import CustomGrid from "../../../components/CustomGrid";
import Loader from "../../Common/Loader";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {formatNumber} from "../../../services/common";
import {DropDownBox} from "devextreme-react";

class InvoiceDetails extends Component {
  _apiService = new ApiService();
  constructor(props){
    super(props);
    this.widgetRef = React.createRef();
    this.state = {
      invoiceDetails: [],
      loading: false,
      searchKey: '',
      selectedRecord: null,
      selectedIndex: -1,
      dataSources: [],
      supplierBidList: [],
    }
  }


  componentDidMount() {
    if (this.props.invoiceId && this.props.invoiceId !== 'new') {
      this.getInvoiceDetails()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.FKey_OP_Supplier !== this.props.FKey_OP_Supplier) {
      this.setState({
        invoiceDetails: [],
      });
    }
  }

  getInvoiceDetails = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoiceDetails(this.props.invoiceId)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      if (this.props.saveInvoiceDetails) {
        this.props.saveInvoiceDetails(data);
      }
      this.setState({
        invoiceDetails: data,
        loading: false,
      })
    }
  }

  onCancelSaveRecord = () => {
    this.setState({
      selectedRecord: null,
      selectedIndex: -1,
    })
  }

  saveRecord = async () => {
    const {selectedRecord, invoiceDetails = [],selectedIndex} = this.state;
    await this.setState({
      isSaving: true
    });
    invoiceDetails[selectedIndex] = selectedRecord;
    this.setState({
      selectedRecord: null,
      selectedIndex: -1,
      isSaving: false,
      invoiceDetails
    }, () => this.refreshGrid());
    if (this.props.saveInvoiceDetails) {
      this.props.saveInvoiceDetails(invoiceDetails);
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onEditRecord = (selectedRecord, index) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      selectedIndex: index,
    })
  }

  onDeleteRecord = async (selectedRecord) => {
    if (selectedRecord.PKey_OP_Invoice_Detail && String(selectedRecord.PKey_OP_Invoice_Detail) !== '-1') {
      const data = await this._apiService.deleteInvoiceDetail(selectedRecord.PKey_OP_Invoice_Detail)
      if (!data || data.error){
        message.error('Something Wrong. Try again')
      } else {
        message.success('Invoice Detail Deleted Successfully');
        const {invoiceDetails} = this.state;
        this.setState({
          invoiceDetails: invoiceDetails.filter(x => x.PKey_OP_Invoice_Detail !== selectedRecord.PKey_OP_Invoice_Detail)
        })
      }
    }
    this.setState({
      invoiceDetails: this.state.invoiceDetails.filter(x => x.PKey_OP_Invoice_Detail !== selectedRecord.PKey_OP_Invoice_Detail)
    });
    this.refreshGrid()
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord
    });
  }

  onNewInvoiceDetail = () => {
    const {invoiceDetails = []} = this.state;
    const selectedRecord = {
      "PKey_OP_Invoice_Detail": -1,
      "PO_Line": 0,
      "FKey_OP_Ledger": null,
      "LedgerNumber": "",
      "LedgerDescription": "",
      "FKey_OP_Supplier_Bid": -1,
      "FKey_Item": 6042,
      "Quantity": 0,
      "BidIDNumber": "",
      "BidName": "",
      "Brand": "",
      "Pack": "",
      "Size": "",
      "Measure": "",
      "Price": 0,
      "MIN": "",
      "Kosher": false,
      "SingleServe": false,
      "PerPound": false,
      "Split": false,
      "Rebate": 0,
      "UOM": "",
      "FKey_OP_Catalog": null,
      "CategoryName": "1",
      "FKey_OP_OrderGuide_Detail": null,
      "FKey_OP_PO_Detail": null,
      "Extended_Formula": 0,
      "QuantityReceived": 0,
      "Version": 0
    };
    invoiceDetails.splice(0, 0, selectedRecord);
    this.setState({
      invoiceDetails,
      selectedRecord,
      selectedIndex: 0,
    });
    this.refreshGrid();
  }

  onBidSelectionChanged = async (record) => {
    const {selectedIndex, invoiceDetails, selectedRecord} = this.state;
    const selectedRowsData = record.selectedRowsData[0];
    invoiceDetails[selectedIndex].BidName = record.selectedRowsData[0].Name;
    const data = {
      ...selectedRecord,
      BidName: selectedRowsData.Name,
      BidIDNumber: selectedRowsData.IDNumber,
      Brand: selectedRowsData.Brand,
      FKey_OP_Supplier_Bid: selectedRowsData.PKey_OP_Supplier_Bid,
      Kosher: selectedRowsData.Kosher,
      MIN: selectedRowsData.MIN,
      Measure: selectedRowsData.Measure,
      Pack: selectedRowsData.Pack,
      Price: selectedRowsData.Price,
      Size: selectedRowsData.Size,
    };
    this.setState({
      supplierBidId: record.selectedRowsData[0].PKey_OP_Supplier_Bid,
      supplierBidName: record.selectedRowsData[0].Name,
      invoiceDetails,
      selectedRecord: data,
    });
    this.widgetRef.current.instance.close();
    this.refreshGrid();
  };

  render() {
    const { loading, invoiceDetails, selectedIndex, isSaving, selectedRecord, supplierBidName,} = this.state;
    return (
        <Col xs="12" sm="12" lg="12">
          {
            loading ? <Loader className="mt-50"/> :
              <>
              <Row>
                <Col md="12" sm="12" xs="12" className="mb-30">
                  <React.Fragment>
                    {
                      loading ?  <Loader className="mt-50"/> :
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={invoiceDetails}
                            columnAutoWidth={false}
                            keyExpr="PKey_OP_Invoice_Detail"
                            columnHidingEnabled={false}
                            showBorders={false}
                            title="Bids"
                          >
                            <Column alignment={'left'} caption={'#'} dataField={'SerialNumber'} />
                          <Column alignment="left" width={"10%"} caption={'Qty'} dataField={'Quantity'} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex) {
                              return (
                                <InputNumber value={selectedRecord.Quantity} name="Quantity" size="small" onChange={(value) => this.onRecordChange({target: {name: 'Quantity', value}})}/>
                              );
                            } else {
                              return (<span>{record.data.Quantity}</span>);
                            }
                          }}/>
                          <Column width={"20%"} caption={'Product No.'} dataField={'BidIDNumber'} />
                          <Column width={"20%"} caption={'Description'} dataField={'BidName'} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex && this.props.FKey_OP_Supplier && !this.props.supplierBidLoading) {
                              return (
                                <div>
                                  <DropDownBox
                                    ref={this.widgetRef}
                                    value={supplierBidName}
                                    valueExpr={'PKey_OP_Supplier'}
                                    deferRendering={false}
                                    displayExpr={(item) => item && `${item.Name}`}
                                    placeholder={'Select Supplier Bid'}
                                    dataSource={this.props.supplierBids}
                                    contentRender={() => {
                                      return (
                                        <CustomGrid
                                          refCallback={(dg) => this.dg = dg}
                                          dataSource={this.props.supplierBids}
                                          hoverStateEnabled={true}
                                          onSelectionChanged={(record) => this.onBidSelectionChanged(record)}
                                          height={'100%'}>
                                          <Selection mode={'single'}/>
                                          <Scrolling mode={'infinite'}/>
                                          <Paging enabled={true} pageSize={10}/>
                                          <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                                        </CustomGrid>
                                      )
                                    }}
                                  />
                                </div>
                              );
                            } else {
                              return (<span>{record.data.BidName}</span>);
                            }
                          }} />
                            <Column alignment={'left'} width={"10%"} caption={'Notes'} dataField={'PurchaseNotes'}/>
                          <Column alignment="left" width={"15%"} caption={'Pack/Size'}  cellRender={(record) => {
                              return <span>{`${record.data.Pack || record.data.Pack === 0 ? record.data.Pack : ''}/${record.data.Size || record.data.Size === 0 ? record.data.Size : ''} ${record.data.Measure || ''}`}</span>
                            }}/>
                          <Column alignment="left" width={"15%"} caption={'Unit Price'} dataField={'Price'} cellRender={(record) => {
                            return<span>{formatNumber(record.data.Price, 2)}</span>
                          }}/>
                          <Column alignment="left" width={"10%"} caption={'Extended'} dataField={'Extended'} cellRender={(record) => {return <span>{formatNumber(record && record.data && record.data.Extended, 2)}</span>}}/>
                          <Column width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onNewInvoiceDetail}>New</span>} visible={!!this.props.isEditable} dataField={''} cellRender={(record) => {
                            const menu = (
                              <Menu>
                                <Menu.Item onClick={() => this.onDeleteRecord(record.data, record.rowIndex)}>
                                  <span className="text-primary ml-5 cursor-pointer">Delete</span>
                                </Menu.Item>
                              </Menu>
                            );
                            if (record.rowIndex === selectedIndex) {
                              return (
                                <div>
                                  <span className="mr-10 text-primary cursor-pointer" onClick={this.saveRecord}>{ isSaving ? <Spin size={"small"}/> : 'Save'}</span>
                                  <span className="text-primary cursor-pointer" onClick={this.onCancelSaveRecord}>Cancel</span>
                                </div>
                              );
                            } else {
                              return (
                                <div className="flex-align-item-center">
                                  <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onEditRecord(record.data, record.rowIndex)}>Edit</span>
                                  <Dropdown overlay={menu} trigger={['click']}>
                                    <i className="icon-options-vertical text-primary cursor-pointer" />
                                  </Dropdown>
                                </div>
                              );
                            }
                          }}/>
                        </CustomGrid>
                    }

                  </React.Fragment>
                </Col>
              </Row>
              </>
          }
        </Col>
    )

  }
}

export default InvoiceDetails;
