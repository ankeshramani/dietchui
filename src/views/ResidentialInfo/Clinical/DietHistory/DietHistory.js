import React,{Component} from 'react';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import moment from "moment";
import {dateFormat, toColor} from "../../../../services/common";
import AddNewDietHistory from "./AddNewDietHistory";
import {Dropdown, Menu, message, Skeleton} from "antd";
import clonedeep from "lodash.clonedeep";
import {ApiService} from "../../../../services/ApiService";

class DietHistory extends Component{
  _apiService = new ApiService();

  state = {
    isLoading: this,
    isDietHistory: false,
    isSaving: false,
    isEdit: false,
    dietsLists: [],
    selectedRecord: {},
  }

  componentDidMount() {
    this.getDiets()
  }

  getDiets = async () => {
    const {patientId,} = this.props;
    const data = await this._apiService.getDiets(patientId);
    if(!data || data.error){
      this.setState({
        isLoading: false
      })
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        dietsLists: data,
        isLoading: false
      })
    }
  }

  onToggleDietHistory = () => {
    this.setState({
      isDietHistory: !this.state.isDietHistory,
      selectedRecord: {},
    })
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      isDietHistory: true,
    })
  }

  updateState = (selectedRecord) => {
    this.setState({
      selectedRecord
    })
  }

  dietHistoryAddOrUpdate = async () => {
    this.setState({
      isSaving: true
    });
    const {patientId} = this.props;
    const {selectedRecord, dietsLists} = this.state;
    const payload =  {
      Change_Date: selectedRecord.Change_Date || null,
      FKey_Consist1: selectedRecord.FKey_Consist1 || null,
      FKey_Consist2: selectedRecord.FKey_Consist2 || null,
      FKey_Consist3: selectedRecord.FKey_Consist3 || null,
      FKey_Consist4: selectedRecord.FKey_Consist4 || null,
      FKey_Consist5: selectedRecord.FKey_Consist5 || null,
      FKey_Diet_Type1: selectedRecord.FKey_Diet_Type1 || null,
      FKey_Diet_Type2: selectedRecord.FKey_Diet_Type2 || null,
      FKey_Diet_Type3: selectedRecord.FKey_Diet_Type3 || null,
      FKey_Diet_Type4: selectedRecord.FKey_Diet_Type4 || null,
      FKey_Diet_Type5: selectedRecord.FKey_Diet_Type5 || null,
      FKey_Patient: selectedRecord.FKey_Patient || patientId,
      PKey_Diet_Flucs: selectedRecord.PKey_Diet_Flucs || 1,
    }
    const data = await this._apiService.dietHistoryAddOrUpdate(patientId, payload);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
      const Index = dietsLists.findIndex(x => x.PKey_Diet_Flucs === payload.PKey_Diet_Flucs)
      if(Index > -1){
        dietsLists[Index] = payload
      } else {
        dietsLists.push(payload)
      }
     this.setState({
       dietsLists,
       isDietHistory: false,
       selectedRecord: {},
       isSaving: false,
     })
    }
    this.refreshGrid();
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  deleteDietHistory = async (selectedRecord) => {
    const data = await this._apiService.deleteDietHistory(selectedRecord.FKey_Patient,selectedRecord.PKey_Diet_Flucs)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Diet History Deleted Successfully');
      const {dietsLists} = this.state;
      this.setState({
        dietsLists: dietsLists.filter(x => x.PKey_Diet_Flucs !== selectedRecord.PKey_Diet_Flucs)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  render() {
    const {dietTypes, consistency} = this.props;
    const {isDietHistory, selectedRecord, dietsLists, isSaving, isLoading} = this.state;
    (dietsLists || []).forEach((x, index) => {
      const diet1 =  (dietTypes || []).find(y => (y.PKey_Diet_Type === x.FKey_Diet_Type1));
      const diet2 =  (dietTypes || []).find(y => (y.PKey_Diet_Type === x.FKey_Diet_Type2));
      const diet3 =  (dietTypes || []).find(y => (y.PKey_Diet_Type === x.FKey_Diet_Type3));
      const diet4 =  (dietTypes || []).find(y => (y.PKey_Diet_Type === x.FKey_Diet_Type4));
      const diet5 =  (dietTypes || []).find(y => (y.PKey_Diet_Type === x.FKey_Diet_Type5));
      const cons1 = (consistency || []).find(y => (y.PKey_Consist === x.FKey_Consist1));
      const cons2 = (consistency || []).find(y => (y.PKey_Consist === x.FKey_Consist2));
      const cons3 = (consistency || []).find(y => (y.PKey_Consist === x.FKey_Consist3));
      const cons4 = (consistency || []).find(y => (y.PKey_Consist === x.FKey_Consist4));
      const cons5 = (consistency || []).find(y => (y.PKey_Consist === x.FKey_Consist5));
      const diet = [];
      const cons = [];
      const dietName = [diet1,diet2, diet3, diet4, diet5];
      const consistencyName = [cons1,cons2, cons3, cons4, cons5];
      dietName.forEach(y => {
        if(y && Object.keys(y).length){
          diet.push(y)
        }
      })
      consistencyName.forEach(z => {
        if(z && Object.keys(z).length){
          cons.push(z)
        }
      })
      dietsLists[index].dietOrder = diet;
      dietsLists[index].consistency = cons;
    });
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton/> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={dietsLists}
                columnAutoWidth={false}
                keyExpr="PKey_Diet_Flucs"
              >
                <Column alignment="left" caption={'Date'} dataField={"Change_Date"} dataType={"date"}/>
                <Column alignment="left" caption={'Diet Order'} cellRender={(record) => {
                  return (
                    <span>{record.data.dietOrder.map((x) => <span style={{
                      backgroundColor: toColor(x.Argb_Back),
                      color: toColor(x.Argb_Fore)
                    }}>{x.Name},&nbsp;</span>)}</span>
                  )
                }}/>
                <Column alignment="left" caption={'Consistency'} cellRender={(record) => {
                  return (
                    <span>{record.data.consistency.map((x) => <span style={{
                      backgroundColor: toColor(x.Argb_Back),
                      color: toColor(x.Argb_Fore)
                    }}>{x.Name},&nbsp;</span>)}</span>
                  )
                }}/>
                <Column alignment="left" width={"10%"}
                        headerCellRender={() => <span className="mr-10 text-primary cursor-pointer"
                                                      onClick={this.onToggleDietHistory}>New</span>}
                        cellRender={(record) => {
                          const menu = (
                            <Menu>
                              <Menu.Item>
                                <span className="text-primary ml-5 cursor-pointer"
                                      onClick={() => this.deleteDietHistory(record.data)}>Delete</span>
                              </Menu.Item>
                            </Menu>
                          );
                          return (
                            <div className="flex-align-item-center cursor-pointer">
                              <span className="text-primary mr-5"
                                    onClick={() => this.onEditRecord(record.data)}>Edit</span>
                              <Dropdown overlay={menu} trigger={['click']}>
                                <i className="icon-options-vertical text-primary cursor-pointer"/>
                              </Dropdown>
                            </div>
                          )
                        }}/> />
              </CustomGrid>
          }
          {
            isDietHistory &&
            <AddNewDietHistory
              isDietHistory={isDietHistory}
              dietTypes={dietTypes}
              consistency={consistency}
              selectedRecord={selectedRecord}
              isSaving={isSaving}
              onToggleDietHistory={this.onToggleDietHistory}
              updateState={this.updateState}
              dietHistoryAddOrUpdate={this.dietHistoryAddOrUpdate}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default DietHistory
