import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import { DropDownBox } from 'devextreme-react';
import { Selection, Paging, Scrolling, Column } from 'devextreme-react/data-grid';
import {Form, InputNumber, Modal, Select, Spin} from "antd";
import CustomGrid from "../../../components/CustomGrid";

class AddNewOrderDetails extends Component {
  _apiService = new ApiService();
    constructor(props){
      super(props);
      this.widgetRef = React.createRef();
      this.widgetRefdep = React.createRef();
      this.state = {
        ParLevel: '',
        Qty: '',
        QtyInventory: '',
        QtyNeeded: '',
        dataSource: [],
        departments: [],
        supplierBids: [],
        FKey_OP_Department: null,
        FKey_Item_Unit: null,
        FKey_OP_InventoryLocation: null,
        FKey_OP_Ledger: null,
        itemUnits: [],
        PKey_Item: null,
        PKey_OP_Supplier_ItemLink: null,
        LedgerNumber: null,
        DepartmentName: ''
      }
    }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.orderDetailRecord.PKey_OP_OrderGuide_Detail !== this.props.orderDetailRecord.PKey_OP_OrderGuide_Detail &&
      this.props.orderDetailRecord.PKey_OP_OrderGuide_Detail) {
      const {orderDetailRecord} = this.props;
      const stateData = {
        FKey_OP_Department: orderDetailRecord.FKey_OP_Department,
        FKey_Item_Unit: orderDetailRecord.FKey_Item_Unit,
        FKey_OP_InventoryLocation: orderDetailRecord.FKey_OP_InventoryLocation,
        FKey_OP_Ledger: orderDetailRecord.FKey_OP_Ledger,
      };
      this.setState({
        ...stateData
      });
      this.props.form.setFieldsValue({
        ...this.props.orderDetailRecord,
      });
    }
  }

  onAddNewRecord = (objData) => {
    const payload = {
      ...this.props.orderDetailRecord,
      FKey_OP_Department: this.state.FKey_OP_Department,
      FKey_Item_Unit: this.state.FKey_Item_Unit,
      FKey_OP_InventoryLocation: this.state.FKey_OP_InventoryLocation,
      FKey_OP_Ledger: this.state.FKey_OP_Ledger,
      ...objData
    };
    this.setState({
      LedgerNumber: null,
      DepartmentName: ''
    });
    this.props.saveRecord(payload, true)
    this.refreshGrid()
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.onAddNewRecord(values);
    });
  };

  onRecordChange = (e,) => {
    this.setState({
     [e.target.name]:e.target.value
    });
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onSelectionChanged = (record) => {
    let {FKey_OP_Ledger , LedgerNumber} = this.state;
       FKey_OP_Ledger = record.selectedRowsData[0].PKey_OP_Ledger;
       LedgerNumber = record.selectedRowsData[0].LedgerNumber;
    this.setState({
      FKey_OP_Ledger,
      LedgerNumber,
    })
    this.widgetRef.current.instance.close();
  }

  onSelectionChangedDepartment = (record) => {
    let {FKey_OP_Department, DepartmentName} = this.state;
    FKey_OP_Department = record.selectedRowsData[0].PKey_OP_Department;
       DepartmentName = record.selectedRowsData[0].Name;
    this.setState({
      FKey_OP_Department,
      DepartmentName
    })
    this.widgetRefdep.current.instance.close();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {FKey_OP_Department, FKey_Item_Unit, FKey_OP_InventoryLocation, FKey_OP_Ledger, LedgerNumber, DepartmentName} = this.state;
    const {isModal, newOderGuideModalOpen, isSaving, departments, inventoryLocations, ledgers, itemUnits  } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'right'
    };
    const findLedgerNumber = ledgers && ledgers.find(x => x.PKey_OP_Ledger === FKey_OP_Ledger)
    const findDepartment = departments && departments.find(x => x.PKey_OP_Department === FKey_OP_Department);

    return(
      <Modal
        visible={isModal}
        title="Update Order Guide Detail"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={newOderGuideModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form  {...formItemLayout} className="pt-19">
          <Form.Item label="Department:">
            <DropDownBox
              ref={this.widgetRefdep}
              value={DepartmentName ? DepartmentName : findDepartment && findDepartment.Name}
              valueExpr={'FKey_OP_Department'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={departments}
              defaultOpened={false}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={departments}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChangedDepartment(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                    <Column caption={'POS'} dataField={'POSuffix'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
          {/*<Form.Item label="Catalog:">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a Catalog"
              value={FKey_OP_Catalog}
              onChange={(value) => this.onRecordChange({target: {name: 'FKey_OP_Catalog', value}})}
            >
              {
                (catalogs || []).map((d) => (
                  <Select.Option value={d.PKey_OP_Catalog}>{d.Name}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>*/}
          <Form.Item label="Inventory Location:">
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Select a Inventory Location"
              value={FKey_OP_InventoryLocation}
              onChange={(value) => this.onRecordChange({target: {name: 'FKey_OP_InventoryLocation', value}})}
            >
              {
                (inventoryLocations || []).map((d, index) => (
                  <Select.Option value={d.PKey_OP_InventoryLocation} key={index}>{d.InventoryLocation}</Select.Option>
                ))
              }
            </Select>
          </Form.Item>
          <Form.Item label="Ledger:">
            <DropDownBox
              ref={this.widgetRef}
              value={LedgerNumber ? LedgerNumber : findLedgerNumber && findLedgerNumber.LedgerNumber}
              valueExpr={'FKey_OP_Ledger'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.LedgerNumber }`}
              placeholder={'Select a value...'}
              dataSource={ledgers}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={ledgers}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column sortOrder={'asc'} caption={'Code No.'} dataField={'LedgerNumber'}/>
                    <Column caption={'Description'} dataField={'Description'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
          <Form.Item label="Item Unit:">
            <Select name="FKey_Item_Unit" style={{minxWidth: 60, width: '100%'}} value={FKey_Item_Unit}
                    onChange={(value) => this.onRecordChange({target: {name: 'FKey_Item_Unit', value}})}>
              {
                (itemUnits || []).map(x => <Select.Option key={x.PKey_Item_Unit} value={x.PKey_Item_Unit}>{x.UnitName}</Select.Option>)
              }
            </Select>
          </Form.Item>
            <Form.Item label="ParLevel:">
            {getFieldDecorator('ParLevel', {
            })(
              <InputNumber  style={{ width: "100%" }}/>
            )}
          </Form.Item>
          <Form.Item label="Qty :">
            {getFieldDecorator('Qty', {
            })(
              <InputNumber  style={{ width: "100%" }}/>
            )}
          </Form.Item>
          <Form.Item label="Qty. Inventory:">
            {getFieldDecorator('QtyInventory', {
            })(
              <InputNumber  style={{ width: "100%" }}/>
            )}
          </Form.Item>
          <Form.Item label="Qty. Needed:">
            {getFieldDecorator('QtyNeeded', {
            })(
              <InputNumber  style={{ width: "100%" }}/>
            )}
          </Form.Item>
        </Form>
      </Modal>

    )
  }

}
const AddNewOrderDetailsForm = Form.create()(AddNewOrderDetails)
export default AddNewOrderDetailsForm
