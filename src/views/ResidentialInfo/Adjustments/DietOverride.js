import React, {Component} from 'react';
import {Dropdown, Menu, message, Skeleton,} from 'antd';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import {ApiService} from "../../../services/ApiService";
import clonedeep from "lodash.clonedeep";
import AddNewAdjustment from "./AddNewAdjustment";

class DietOverride extends Component {
  _apiService = new ApiService();
  state = {
    isAdjustment: false,
    isSaving: false,
    fields: {}
  }


  onToggleAdjustment = () => {
    this.setState({
      isAdjustment: !this.state.isAdjustment
    })
  }

  postPatientAdjustments = async () => {
    this.setState({
      isSaving: true
    });
    const {patientId} = this.props;
    const {fields} = this.state;
    const payload = {
      PKey_Prd_Adjustment: fields.PKey_Prd_Adjustment || 1,
      FKey_Patient: patientId,
      Reason: fields.Reason || null,
      Type: fields.Type || null,
      FKey_Item: fields.FKey_Item || null,
      FKey_Prd_Food_Group: fields.FKey_Prd_Food_Group || null,
      FKey_Prd_Menu_Category: fields.FKey_Prd_Menu_Category || null,
      FKey_Prd_Allergy_Group: fields.FKey_Prd_Allergy_Group || null,
      ActionType: fields.ActionType || null,
      FKey_Item_Adj: fields.FKey_Item_Adj || null,
      FKey_Itm_Size_Adj: fields.FKey_Itm_Size_Adj || null,
      FKey_Consist_Adj: fields.FKey_Consist_Adj || null,
      FKey_Prd_Portion_Adj: fields.FKey_Prd_Portion_Adj || null,
      FKey_Prd_Service_Item_Adj: fields.FKey_Prd_Service_Item_Adj || null,
      Inactive: fields.Inactive || false,
      Active_B1: fields.Active_B1 || true,
      Active_L1: fields.Active_L1 || true,
      Active_D1: fields.Active_D1 || true,
      Active_B2: fields.Active_B2 || true,
      Active_L2: fields.Active_L2 || true,
      Active_D2: fields.Active_D2 || true,
      Active_B3: fields.Active_B3 || true,
      Active_L3: fields.Active_L3 || true,
      Active_D3: fields.Active_D3 || true,
      Active_B4: fields.Active_B4 || true,
      Active_L4: fields.Active_L4 || true,
      Active_D4: fields.Active_D4 || true,
      Active_B5: fields.Active_B5 || true,
      Active_L5: fields.Active_L5 || true,
      Active_D5: fields.Active_D5 || true,
      Active_B6: fields.Active_B6 || true,
      Active_L6: fields.Active_L6 || true,
      Active_D6: fields.Active_D6 || true,
      Active_B7: fields.Active_B7 || true,
      Active_L7: fields.Active_L7 || true,
      Active_D7: fields.Active_D7 || true,
      Priority: fields.Priority || 1,
      AdjustmentNotes: fields.AdjustmentNotes || null,
      StartDate: fields.StartDate || null,
      EndDate: fields.EndDate || null,
      FKey_Item_Prd_ItemType: fields.FKey_Item_Prd_ItemType || null,
      MultipleIndex: fields.MultipleIndex || null,
      Item_Locked: fields.Item_Locked || false,
      Itm_Size_Locked: fields.Itm_Size_Locked || false,
      Consist_Locked: fields.Consist_Locked || false,
      ItemType_Locked: fields.ItemType_Locked || false,
      Service_Item_Locked: fields.Service_Item_Locked || false,
      Item_Adj_Locked: fields.Item_Adj_Locked || false,
      IgnoreMenuCategorySkips: fields.IgnoreMenuCategorySkips || false,
      IgnoreDietRestriction: fields.IgnoreDietRestriction || false,
    }
    const data = await this._apiService.postPatientAdjustments(patientId, payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!');
      this.setState({
        isSaving: false,
      });
    } else {
      this.setState({
        isSaving: false,
        isAdjustment: false,
      })
    }
  }

  updateState = (fields) => {
    this.setState({
      ...fields
    })
  }

  onEditRecord = (fields) => {
    this.setState({
      fields: clonedeep(fields),
      isAdjustment: true
    })
  }

  onDelete = async (selectedRecord) => {
    const data = await this._apiService.deletePatientadAustments(selectedRecord.FKey_Patient,selectedRecord.PKey_Prd_Adjustment)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Adjustment Deleted Successfully');
      this.refreshGrid();
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {dietOverride, isLoading, foodGroups} = this.props;
    const {isAdjustment, fields, isSaving} = this.state;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={dietOverride || []}
                columnAutoWidth={false}
                keyExpr="PKey_Notes"
              >
                <Column alignment="left" caption={'Reason'} width={'10%'} dataField={'reason'}/>
                <Column alignment="left" caption={'Type'} width={'15%'} dataField={'type'}/>
                <Column alignment="left" caption={'Allergy/Item/Food/Menu'} width={'30%'} dataField={'menu'}/>
                <Column alignment="left" caption={'B'} dataField={'b'} width={'3%'}/>
                <Column alignment="left" caption={'L'} dataField={'l'} width={'3%'}/>
                <Column alignment="left" caption={'S'} dataField={'s'} width={'3%'}/>
                <Column alignment="left" caption={'Item'} dataField={'item'} width={'10%'}/>
                <Column alignment="left" caption={'Size'} dataField={'size'} width={'10%'}/>
                <Column alignment="left" caption={'Consist'} dataField={'consist'} width={'6%'}/>
                <Column alignment="left" caption={'Item Type'} dataField={'itemType'} width={'10%'}/>
                <Column alignment="left" width={'10%'} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleAdjustment}>New</span>} cellRender={(record) => {
                  const menu = (
                    <Menu>
                      <Menu.Item>
                        <span className="text-primary ml-5 cursor-pointer" onClick={()=>this.onDelete(record.data)}>Delete</span>
                      </Menu.Item>
                    </Menu>
                  );
                  return(
                    <div className="flex-align-item-center cursor-pointer">
                      <span className="text-primary mr-5" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                      <Dropdown overlay={menu} trigger={['click']}>
                        <i className="icon-options-vertical text-primary cursor-pointer" />
                      </Dropdown>
                    </div>
                  )
                }}/>
              </CustomGrid>
          }
          {
            isAdjustment &&
            <AddNewAdjustment
              isAdjustment={isAdjustment}
              foodGroups={foodGroups}
              isSaving={isSaving}
              fields={fields || {}}
              onToggleAdjustment={this.onToggleAdjustment}
              postPatientAdjustments={this.postPatientAdjustments}
              updateState={this.updateState}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default DietOverride
