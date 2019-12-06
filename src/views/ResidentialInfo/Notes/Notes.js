import React, {Component} from 'react';
import {Dropdown, Menu, message, Skeleton} from 'antd';
import {Col, Row} from 'reactstrap';
import moment from 'moment'
import {dateFormat} from "../../../services/common";
import {ApiService} from '../../../services/ApiService';
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import AddNewNotes from "./AddNewNotes";
import clonedeep from "lodash.clonedeep";

class Notes extends Component {
  _apiService = new ApiService();

  state = {
    notes: [],
    isNote: false,
    isSaving: false,
    isLoading: true,
    selectedRecord: {
      PKey_Notes: null,
      FKey_Patient: null,
      Note_Date: null,
      Note_Title: '',
      Note_Text: '',
      FKey_Note_Type: null
    }

  }

  async componentDidMount() {
    this.getNotes();
  }

  getNotes = async () => {
    const {patientId} = this.props;
    const data = await this._apiService.getNotes(patientId);
    if(!data || data.error){
      this.setState({
        isLoading: false
      })
      message.error('Something Wrong. Try again')
    } else {
      data.forEach(x => {
        x.noteType = this.getNoteName(x.FKey_Note_Type);
      });
      return this.setState({
        notes: data,
        isLoading: false
      })
    }
  }

  getNoteName = (noteTypeId) => {
    const {noteTypes} = this.props;
    if (noteTypes && noteTypes.length && noteTypeId) {
      const note = noteTypes.find(x => x.PKey_Note_Type === noteTypeId);
      if (note) {
        return note.NoteTitle;
      }
    }
    return '';
  }

  onToggleNote = () => {
    this.setState({
      isNote: !this.state.isNote
    })
  }

  noteAddOrUpdate = async () => {
    this.setState({
      isSaving: true
    });
    const {patientId} = this.props;
    const {selectedRecord, notes} = this.state;
    const payload = {
      ...selectedRecord,
      FKey_Patient: patientId,
      PKey_Notes: selectedRecord.PKey_Notes || 1
    }
    const data = await this._apiService.noteAddOrUpdate(patientId, payload)
    if(!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
      const Index = notes.findIndex(x => x.PKey_Notes === payload.PKey_Notes)
      notes.forEach(x => {
          x.noteType = this.getNoteName(x.FKey_Note_Type);
        })
      if(Index > -1){
        notes[Index] = payload
      } else {
        notes.push(payload)
      }
      this.setState({
        notes,
        isNote: false,
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
  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: {...selectedRecord},
      isNote: true,
    })
  }

  updateState = (selectedRecord) => {
    this.setState({
      selectedRecord
    })
  }

  deleteNotes = async (selectedRecord) => {
    const data = await this._apiService.deleteNote(selectedRecord.FKey_Patient,selectedRecord.PKey_Notes)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Note Deleted Successfully');
      const {notes} = this.state;
      this.setState({
        dietsLists: notes.filter(x => x.PKey_Notes !== selectedRecord.PKey_Notes)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  render() {
    const {isNote, isLoading, notes, selectedRecord, isSaving} = this.state;
    const {noteTypes} = this.props;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={notes || []}
                columnAutoWidth={false}
                keyExpr="PKey_Notes"
              >
                <Column alignment="left" caption={'Date'} width={"30%"} dataField={"Note_Date"} dataType={"date"}/>
                <Column alignment="left"  width={"30%"} caption={'Type'} dataField={'noteType'}/>
                <Column alignment="left"  width={"30%"} caption={'Title'} dataField={'Note_Title'}/>
                <Column alignment="left"  width={"10%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleNote}>New</span>}  cellRender={(record) => {
                  const menu = (
                    <Menu>
                      <Menu.Item>
                        <span className="text-primary ml-5 cursor-pointer" onClick={()=>this.deleteNotes(record.data)}>Delete</span>
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
                }}/>/>
              </CustomGrid>
          }
          {
            isNote &&
            <AddNewNotes
              isNote={isNote}
              noteTypes={noteTypes}
              selectedRecord={selectedRecord}
              isSaving={isSaving}
              onToggleNote={this.onToggleNote}
              updateState={this.updateState}
              noteAddOrUpdate={this.noteAddOrUpdate}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default Notes
