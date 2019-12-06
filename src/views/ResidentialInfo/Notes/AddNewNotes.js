import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Row, Col} from "reactstrap"
import {DatePicker,Form, Input, Modal, Spin,} from "antd";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";
import {dateFormat} from "../../../services/common";
import moment from "moment";
const { TextArea } = Input;
class AddNewNotes extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      Name: ''
    }
  }

  onSelectionChanged = (record) => {
    let {selectedRecord} = this.props;
    selectedRecord.FKey_Note_Type= record.selectedRowsData[0].PKey_Note_Type;
    this.setState({
      Name : record.selectedRowsData[0].NoteTitle
    })
    this.widgetRefdep.current.instance.close();
    this.props.updateState(selectedRecord)
  }

  onChange = (event) => {
    let {selectedRecord} = this.props;
    selectedRecord[event.target.name] = event.target.value
    this.props.updateState(selectedRecord)
  }

  onDateChange = (event) => {
    let {selectedRecord} = this.props;
    selectedRecord.Note_Date = event._d;
    this.props.updateState(selectedRecord)
  }

  render() {
    const {isNote, onToggleNote, noteTypes, selectedRecord, noteAddOrUpdate, isSaving} = this.props;
    const {Name} = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isNote}
        title="Add a Note..."
        okText={isSaving ? <Spin className="white" size={"small"}/> : 'Save'}
        onCancel={onToggleNote}
        onOk={noteAddOrUpdate}
        width={555}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label="Date">
                <DatePicker onChange={this.onDateChange} format={dateFormat} value={selectedRecord.Note_Date ? moment(selectedRecord.Note_Date) : null} name="Note_Date"/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Type">
                <DropDownBox
                  ref={this.widgetRefdep}
                  value={Name}
                  valueExpr={'PKey_Note_Type'}
                  deferRendering={false}
                  displayExpr={(item) => item && `${item && item.NoteTitle }`}
                  placeholder={'Select a value...'}
                  dataSource={noteTypes}
                  defaultOpened={false}
                  contentRender={(record)=>{
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={noteTypes}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onSelectionChanged(record)}
                        height={'100%'}>
                        <Selection mode={'single'} />
                        <Scrolling mode={'infinite'} />
                        <Paging enabled={true} pageSize={10} />
                        <Column caption={'Name'} dataField={'NoteTitle'} width={"65%"}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Title">
                <Input name="Note_Title" value={selectedRecord.Note_Title} onChange={this.onChange}/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Notes">
                <TextArea rows={8} name="Note_Text" value={selectedRecord.Note_Text} onChange={this.onChange}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default AddNewNotes
