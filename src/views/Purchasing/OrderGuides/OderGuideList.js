import React, {Component} from "react";
import {Checkbox, Input, message, Spin} from "antd";
import clonedeep from "lodash.clonedeep";
import AddNewOrderGuide from "./AddNewOrderGuide";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";

class OrderGuideList extends Component {
  state = {
    visible: false,
    selectedRecord: null,
    modal: false,
    newOderGuide: false,
    isSaving: false,
    searchKey: '',
    isDataFilter: false,
  }

  onSelectAll = (event) => {
    const orderGuides = this.props.orderGuides;
    for (const index in orderGuides) {
      orderGuides[index].Selected = event.target.checked ? 1 : 0;
      this.props.onUpdateOrderGuide(orderGuides[index]);
    }
    this.props.orderGuidesList(orderGuides)
    this.setState({selectAll: event.target.checked})
  }

  onSelectRecord = (event, record) => {
      record.Selected = event.target.checked ? 1 : 0;
      this.props.onUpdateOrderGuide(record);
      this.refreshGrid()

  }

  newOderGuideModalOpen = () => {
    this.setState({
      newOderGuide: !this.state.newOderGuide,
    });
  }
  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
  }

  saveRecord = () => {
    this.setState({
      isSaving: true
    })
    this.props.onUpdateOrderGuide(this.state.selectedRecord, () => {
      this.setState({
        selectedRecord: null,
        isSaving: false,
      });
      message.success('Order Guide Updated Successfully!');
    });
    this.refreshGrid()
  }

  onCancelSaveRecord = () => {
    this.setState({
      selectedRecord: null,
    });
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord.OrderGuideName = event.target.value;
    this.setState({
      selectedRecord
    });
    this.refreshGrid()
  }

  onSelectDefaultOrderGuide = (e, selectedRecord, key) => {
    selectedRecord.DefaultOrderGuide = e.target.checked;
    let orderGuides = this.props.orderGuides;
    if(key === "defaultOrderGuide"){
      orderGuides.forEach((item, index) => {
        if(item.PKey_OP_OrderGuide === selectedRecord.PKey_OP_OrderGuide){
          orderGuides[index] = selectedRecord;
          this.props.onUpdateOrderGuide(selectedRecord, null, true)
        } else {
          if (orderGuides[index].DefaultOrderGuide) {
            orderGuides[index].DefaultOrderGuide = false;
            this.props.onUpdateOrderGuide(orderGuides[index], null, true)
          }
        }
      });
    }
    this.props.orderGuidesList(orderGuides)
    this.refreshGrid()
  }

  render() {
    const { selectedRecord, isSaving,selectAll } = this.state;
    let orderGuides = this.props.orderGuides;
    return(
    <div>
      <CustomGrid
        refCallback={(dg) => this.dg = dg}
        dataSource={orderGuides}
        columnAutoWidth={false}
        keyExpr="PKey_OP_OrderGuide"
        gridClass="order-guid"
      >
        <Column alignment="left" width={"15%"} headerCellRender={(record)=> { return <Checkbox checked={selectAll} onChange={this.onSelectAll}/>}} cellRender={(record) => {
          return <Checkbox checked={record && !!record.data.Selected} onChange={(event) => this.onSelectRecord(event, record && record.data)}/>
        }}/>
        <Column alignment="left" width={"40%"} caption={'Name'} dataField={'OrderGuideName'} sortOrder={'asc'} cellRender={(record) => {
          if (selectedRecord && selectedRecord.PKey_OP_OrderGuide === record.data.PKey_OP_OrderGuide) {
            return (
              <Input value={selectedRecord.OrderGuideName} size="small" onChange={this.onRecordChange}/>
            );
          }
          return record.data.OrderGuideName;
        }} />
        <Column alignment="left" width={"40%"} caption={' Default Order Guide'} cellRender={(record) => {
            return <Checkbox checked={record && !!record.data.DefaultOrderGuide} onChange={(event) => this.onSelectDefaultOrderGuide(event, record.data, "defaultOrderGuide")}/>
        }}/>
        <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.newOderGuideModalOpen}>New</span>}  cellRender={(record) => {
          if (selectedRecord && selectedRecord.PKey_OP_OrderGuide === record.data.PKey_OP_OrderGuide) {
            return (
              <div>
                <span className="mr-10 text-primary cursor-pointer" onClick={this.saveRecord}>{ isSaving ? <Spin size={"small"}/>  : 'Save'}</span>
                <span className="text-primary cursor-pointer" onClick={this.onCancelSaveRecord}>Cancel</span>
              </div>
            );

          } else {
            return (<span className="text-primary cursor-pointer" onClick={() => this.onEditRecord(record.data)}>
              Edit
            </span>);
          }
        }}/>

      </CustomGrid>
      <div>
        <AddNewOrderGuide newOderGuideModalOpen={this.newOderGuideModalOpen} refreshGrid={this.refreshGrid} addOrderGuide={this.props.addOrderGuide}
                          newOderGuide={this.state.newOderGuide}/>
      </div>
    </div>
    )
  }
}
export default OrderGuideList
