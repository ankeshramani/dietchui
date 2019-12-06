import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {CancelToken} from "axios";
import {Form, Icon, Input, Menu, message, Select, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";
import {formatNumber} from "../../../services/common";

class SupplierItemLink extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefItemLink = React.createRef();
    this.state = {
      loading: false,
      dataSource: [],
      dataSource2: [],
      tableData: [],
      itemUnits: [],
      tblData: []
    }
  }

  componentDidMount() {
    this.getItemUnit();
    this.getTblItem()
    this.getAllSupplierBid()
  }

  getAllSupplierBid = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getAllSupplierBid()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        dataSource2: data,
        loading: false,
      })
    }
  }
  getTblItem = async () =>{
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
        tblData: data,
        loading: false,
      })
    }
  }

  getItemUnit = async () => {
    const data = await this._apiService.getItemUnit();
    if (!data || data.error) {
      return message.error('Something went wrong in fetching units. Please try again later!');
    }
    const itemUnits = (data || []).sort((a,b) => {
      return a.UnitName > b.UnitName ? 1 : -1;
    });
    this.setState({
      itemUnits
    });
  }

  handleSearch = async (value) => {
    if (value.trim().length < 3) {
      if (!value.trim()) {
        return this.setState({
          dataSource: []
        })
      }
      return;
    }
    const payload = {
      "Description": value,
      "MenuDescription": "",
      "OrderBy": "Itm_Descr desc",
      "Page": 1,
      "PageSize": 10,
      "UseLikeSearch": true
    };
    let dataSource = [];
    if (this.state.source) {
      this.state.source.cancel();
    }
    const source = CancelToken.source();
    this.setState({
      source,
    });
    const data = await this._apiService.searchItem(payload, source);
    if (!data.error) {
      dataSource = data.results || [];
    }
    this.setState({
      dataSource,
      source: null
    });
  };

  onSelect = async (value) => {

    const data = await this._apiService.getSupplierItemLinkByItem(value);
    if (!data || data.error) {
      return message.error('Something went wrong. Please try again later!');
    }
    this.setState({
      tableData: data,
      dataSource: [],
      selectedItem: value,
    });
  };

  handleSearch2 = async (value) => {
    if (value.trim().length < 3) {
      if (!value.trim()) {
        return this.setState({
          dataSource2: []
        })
      }
      return;
    }
    const payload = {
      "Name": value,
      "IdNumber": "",
      "Min": "",
      "Page": 1,
      "PageSize": 10,
      "UseLikeSearch": true,
    };
    let dataSource2 = [];
    if (this.state.source) {
      this.state.source.cancel();
    }
    const source = CancelToken.source();
    this.setState({
      source,
    });
    const data = await this._apiService.searchSupplierBid(payload, source);
    if (data && !data.error) {
      dataSource2 = data.results || [];
    }
    this.setState({
      dataSource2,
      source: null
    });
  };

  onSubmitSupplierLink = async () => {
    const {tableData = [], selectedItem, selectedIndex} = this.state;
    if (selectedItem) {
      const item = tableData[selectedIndex];
      if (item) {
        const payload = {
          "PKey_OP_Supplier_ItemLink": item.PKey_OP_Supplier_ItemLink || 0,
          "FKey_Item": selectedItem,
          "FKey_OP_Supplier_Bid": item.FKey_OP_Supplier_Bid,
          "FKey_Item_Unit": item.FKey_Item_Unit,
          "ConversionValue": item.ConversionValue,
          "PKey_OP_Supplier": item.PKey_OP_Supplier || 0,
        };
        const data = await this._apiService.postSupplierItemLink(payload);
        if (data && !data.error && (item.PKey_OP_Supplier_ItemLink || '0').toString() === '0') {
          tableData[selectedIndex].PKey_OP_Supplier_ItemLink = data;
        }
      }
    }
  }

  onSelect2 = (value) => {
    let {dataSource2 = [], tableData, selectedIndex} = this.state;
    const item = dataSource2.find(x => x.PKey_OP_Supplier_Bid === Number(value.selectedRowsData[0].PKey_OP_Supplier_Bid));
    if (item) {
      tableData[selectedIndex] = {
        ...(tableData[selectedIndex] || {}),
        FKey_OP_Supplier_Bid: item.PKey_OP_Supplier_Bid,
        FKey_OP_Supplier: (tableData[selectedIndex] || {}).FKey_OP_Supplier || item.PKey_OP_Supplier,
        SupplierName: item.SupplierName,
        ProductNo: item.IDNumber,
        BrandName: item.Brand,
        Name: item.Name,
        ItemPack: item.Pack,
        ItemSize: item.Size,
        Uom: item.Measure,
        UnitPrice: item.Price,
      };

      this.setState({
        tableData,
        Name: item.Name,
      });
    }
    this.widgetRefItemLink.current.instance.close();
    this.refreshGrid()
  };

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onSelectBid = (selectedIndex) => {
    this.setState({
      selectedIndex,
    })
  }

  onRecordChange = (event) => {
    const {selectedIndex, tableData} = this.state;
    const {name} = event.target;
    tableData[selectedIndex][event.target.name] = event.target.value;
    this.setState({
      tableData
    }, () => {
      if (name === 'FKey_Item_Unit') {
        this.onSubmitSupplierLink(selectedIndex);
      }
    });
  }

  onChange = (event) =>{
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onSelectionChanged = async (record) => {
    const PKey_Item = record.selectedRowsData[0].PKey_Item;
    const Itm_Descr = record.selectedRowsData[0].Itm_Descr;
    const data = await this._apiService.getSupplierItemLinkByItem(PKey_Item);
    if (!data || data.error) {
      return message.error('Something went wrong. Please try again later!');
    }
    this.setState({
      tableData: data,
      dataSource: [],
      selectedItem: PKey_Item,
      PKey_Item,
      Itm_Descr
    })
    this.widgetRef.current.instance.close();
    this.refreshGrid()
  }

  newSupplierLink = () => {
    const {tableData = [], selectedItem} = this.state;
    if (selectedItem) {
      const selectedIndex = tableData.length;
      tableData.push({
        "PKey_OP_Supplier_ItemLink": 0,
        "FKey_Item": selectedItem,
        "FKey_OP_Supplier_Bid": 0,
        "FKey_Item_Unit": null,
        "ConversionValue": 0,
        "PKey_OP_Supplier": 0,
        "BrandName": ''
      });
      this.setState({
        tableData,
        selectedIndex
      })
    }
    this.refreshGrid()
  }

  onCancel = () => {
    this.setState({
      selectedIndex: null
    })
  }

  submitSupplierItem = async (index) => {
    const {tableData = [], PKey_Item} = this.state;
    if (PKey_Item) {
      const data = tableData.map(x => {
        return {
          ...x,
          "PKey_OP_Supplier_ItemLink": x.PKey_OP_Supplier_ItemLink || 0,
          "FKey_Item": PKey_Item,
          "FKey_OP_Supplier_Bid": x.FKey_OP_Supplier_Bid,
          "FKey_Item_Unit": x.FKey_Item_Unit,
          "ConversionValue": x.ConversionValue,
          "PKey_OP_Supplier": x.PKey_OP_Supplier || 0,
        };
      });
      if (data.length) {
        this.setState({
          isSaving: true
        });
        const response = await this._apiService.postSupplierItemLink(data[index]);
        if (response && !response.error) {
          this.setState({
            isSaving: false,
            Name: '',
            selectedIndex: null
          });
          return message.success('Supplier Item Link Saved Successfully');
        } else {
          this.setState({
            isSaving: false,
            selectedIndex: null
          });
          return message.error('Something went wrong. Please try again later!');
        }
      }
    }
  }

  render() {
    const { loading, Name, tableData, isSaving, selectedItem, selectedIndex, dataSource2 = [], itemUnits = [], Itm_Descr, tblData = []} = this.state;
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
      labelAlign: 'right'
    };
    const getUnitItemName = (FKey_Item_Unit) => {
      const itemUnit =  itemUnits.find(x => x.PKey_Item_Unit === FKey_Item_Unit);
      if (itemUnit) {
        return itemUnit.UnitName;
      }
      return '-';
    }
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="Order">
              <Icon type="save" />
             Save
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
                        <Form {...formItemLayout}>
                          <Form.Item label="Search Item">
                            {/*<AutoComplete
                              style={{ width: '100%' }}
                              onSelect={this.onSelect}
                              onSearch={this.handleSearch}
                              defaultValue={searchValue}
                              placeholder="Enter 3 letters to Start Searching"
                            >
                              {
                                dataSource.map(item => <Option key={item.PKey_Item}>{item.Itm_Descr}</Option>)
                              }
                            </AutoComplete>*/}
                            <DropDownBox
                              ref={this.widgetRef}
                              value={Itm_Descr}
                              valueExpr={'PKey_Item'}
                              deferRendering={false}
                              displayExpr={(item) => item && `${item.Itm_Descr }`}
                              placeholder={'Select a value...'}
                              dataSource={tblData}
                              width={300}
                              contentRender={(record)=>{
                                return (
                                  <CustomGrid
                                    dataSource={tblData}
                                    hoverStateEnabled={true}
                                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                                    height={'100%'}>
                                    <Selection mode={'single'} />
                                    <Scrolling mode={'infinite'} />
                                    <Paging enabled={true} pageSize={10} />
                                    <Column sortOrder={'asc'} caption={'Name'} dataField={'Itm_Descr'}/>
                                  </CustomGrid>
                                )
                              }}
                            />
                          </Form.Item>
                        </Form>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <CustomGrid
                          refCallback={(dg) => this.dg = dg}
                          dataSource={tableData}
                          columnAutoWidth={false}
                          keyExpr="PKey_OP_Supplier_ItemLink"
                          columnHidingEnabled={false}
                          gridClass="supplier-item-link"
                        >
                          <Column alignment="left" width={"15%"} caption={'Bid'} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex) {
                              const data = dataSource2 && dataSource2.find(x => x.PKey_OP_Supplier_Bid === record.data.FKey_OP_Supplier_Bid)
                              return (
                                <div>
                               {/* <AutoComplete
                                  style={{ width: '100%' }}
                                  onSelect={(value) => this.onSelect2(value, record.rowIndex)}
                                  onSearch={this.handleSearch2}
                                  defaultValue={record.data.Name}
                                  placeholder="Enter 3 letters to Start Searching"
                                >
                                  {
                                    dataSource2.map(item => <Option key={item.PKey_OP_Supplier_Bid}>{item.Name}</Option>)
                                  }
                                </AutoComplete>*/}

                              <DropDownBox
                                ref={this.widgetRefItemLink}
                                value={Name ? Name : data && data.Name}
                                valueExpr={'PKey_OP_Supplier_ItemLink'}
                                deferRendering={false}
                                displayExpr={(item) => item && `${item.Name }`}
                                placeholder={'Select a value...'}
                                dataSource={dataSource2}
                                width={300}
                                contentRender={(record)=>{
                                  return (
                                    <CustomGrid
                                      dataSource={dataSource2}
                                      hoverStateEnabled={true}
                                      onSelectionChanged={(record) => this.onSelect2(record)}
                                      height={'100%'}>
                                      <Selection mode={'single'} />
                                      <Scrolling mode={'infinite'} />
                                      <Paging enabled={true} pageSize={10} />
                                      <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                                    </CustomGrid>
                                  )
                                }}
                              />
                                </div>
                              );
                            } else {
                              const data = dataSource2 && dataSource2.find(x => x.PKey_OP_Supplier_Bid === record.data.FKey_OP_Supplier_Bid)
                              return (<span className="link" onClick={() => this.onSelectBid(record.rowIndex)}>{(data && data.Name) || 'Select Bid'}</span>);
                            }
                          }
                          }/>
                          <Column alignment="left" caption={'Supplier'} dataField={'SupplierName'}/>
                          <Column alignment="left" caption={'Product No'} dataField={'ProductNo'}/>
                          <Column alignment="left" caption={'Brand'} dataField={'BrandName'}/>
                          <Column alignment="left" caption={'Pack/Size'} cellRender={(record) => {
                            return <span>{`${record.data.ItemPack || record.data.ItemPack === 0 ? record.data.ItemPack : ''}/${record.data.ItemSize || record.data.ItemSize === 0 ? record.data.ItemSize : ''} ${record.data.Uom || ''}`}</span>
                          }}/>
                          <Column alignment="left" caption={'Price'} dataField={'UnitPrice'} cellRender={(record)=>{
                            return <span>{formatNumber(record.data.UnitPrice, 2)}</span>
                          }}/>
                          <Column alignment="left" caption={'Yields'} dataField={'ConversionValue'} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex) {
                              return (
                                <Input name="ConversionValue" onBlur={this.onSubmitSupplierLink} value={record.data.ConversionValue} onChange={this.onRecordChange} />
                              );
                            } else {
                              return (<span>{record.data.ConversionValue}</span>);
                            }
                          }}/>
                          <Column alignment="left" caption={'Item Unit'} dataField={'ItemUnit'} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex) {
                              return (
                                <Select name="FKey_Item_Unit" style={{minxWidth: 60, width: '100%'}} value={record.data.FKey_Item_Unit}
                                        onChange={(value) => this.onRecordChange({target: {name: 'FKey_Item_Unit', value}})}>
                                  {
                                    itemUnits.map(x => <Select.Option key={x.PKey_Item_Unit} value={x.PKey_Item_Unit}>{x.UnitName}</Select.Option>)
                                  }
                                </Select>

                              );
                            } else {
                              return (<span>{getUnitItemName(record.data.FKey_Item_Unit)}</span>);
                            }
                          }}/>
                          <Column alignment="left" width={100}  headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.newSupplierLink} disabled={!selectedItem} >New</span>} cellRender={(record) => {
                            if (record.rowIndex === selectedIndex && record.data.FKey_OP_Supplier_Bid) {
                              return (
                                <div>
                                  <span className="mr-10 text-primary cursor-pointer" onClick={() => this.submitSupplierItem(record.rowIndex)}> {isSaving ? <Spin size={"small"}/> : 'Save'}</span>
                                  <span className="mr-10 text-primary cursor-pointer" onClick={this.onCancel} >Cancel</span>
                                </div>
                                )
                            }
                          }}/>
                        </CustomGrid>
                      </Col>
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

export default connect(mapStateToProps)(SupplierItemLink);
