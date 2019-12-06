import React,{Component} from 'react';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import moment from "moment";
import {dateFormat} from "../../../../services/common";
import {DatePicker, Dropdown, Form, Menu, message, Modal, Select, Spin} from "antd";
import clonedeep from "lodash.clonedeep";
import {ApiService} from "../../../../services/ApiService";

class IntakeStudy extends Component{
  _apiService = new ApiService();

  state = {
    isIntakeStudy: false,
    isSaving: false,
    isEdit: false,
    dietsLists: [],
    selectedRecord: {},
  }



  onToggleIntakeStudy = () => {
    this.setState({
      isIntakeStudy: !this.state.isIntakeStudy,
      selectedRecord: {},
    })
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      isIntakeStudy: true,
    })
  }



  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }


  render() {
    const {isIntakeStudy, isSaving} = this.state;
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
      labelAlign: 'left'
    };
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          <CustomGrid
            refCallback={(dg) => this.dg = dg}
            dataSource={[]}
            columnAutoWidth={false}
            keyExpr="PKey_Diet_Flucs"
          >
            <Column alignment="left" caption={'Date'} dataField={"Date"} dataType={"date"}/>
            <Column alignment="left"  width={"10%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleIntakeStudy}>New</span>} cellRender={(record) => {
              const menu = (
                <Menu>
                  <Menu.Item>
                    <span className="text-primary ml-5 cursor-pointer" onClick={() => this.deleteDietHistory(record.data)}>Delete</span>
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
            }}/> />
          </CustomGrid>
          {isIntakeStudy &&
            <Modal
              visible={isIntakeStudy}
              title="Add a New Intake Study..."
              okText={isSaving ?  <Spin className="white" size={"small"}/> : 'Save'}
              onCancel={this.onToggleIntakeStudy}
              onOk={this.onToggleIntakeStudy}
              width={500}
              cancelButtonProps={{className: 'pull-right ml-10'}}
            >
              <Form {...formItemLayout}>
                <Form.Item label="Start Date">
                  <DatePicker/>
                </Form.Item>
                <Form.Item label="Number od Days">
                 <Select>
                   <Select.Option value="1day">1 Day</Select.Option>
                   <Select.Option value="2day">2 Day</Select.Option>
                   <Select.Option value="3day">3 Day</Select.Option>
                 </Select>
                </Form.Item>
                <Form.Item label="Menu Cycle">
                  <span>Spring 2019</span><br/>
                  <span>Wed, Week 2, Day 4 | MC Day</span>
                </Form.Item>
              </Form>
            </Modal>
          }
        </Col>
      </Row>
    )
  }
}

export default IntakeStudy
