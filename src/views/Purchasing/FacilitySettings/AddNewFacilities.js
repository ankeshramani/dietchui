import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, Modal, Spin, Select} from "antd";
import {getSettings} from "../../../services/common";
const { Option } = Select;

class AddNewFacilities extends Component {
  _apiService = new ApiService();

  state = {

  }

  onAddNewRecord = (dataObj) => {
    const  facilityKey = getSettings('facilityKey')
    const data = {
      ...dataObj,
      FKey_Facility: facilityKey,
      FKey_Facility_SharedBids: facilityKey,
      PKey_Facility_OP: 0,
    }
    this.props.addNewRecord(data)
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

  render() {
    const {isSaving, isFacilities, toggleFacilitiesModal} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isFacilities}
        title="Create a New Facilities"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={toggleFacilitiesModal}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Notes">
            {getFieldDecorator('DefaultNotes')(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="PO Prefix">
            {getFieldDecorator('POPrefix')(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="Email Subject">
            {getFieldDecorator('OrderGuide_EmailSubjectTemplate')(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="Email Body">
            {getFieldDecorator('OrderGuide_EmailBodyTemplate')(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="OrderFlow">
            {getFieldDecorator('OrderFlow')(
              <Select defaultValue="1">
                <Option value={1}>Straight to Invoice</Option>
                <Option value={2}>PO First and then Invoice</Option>
                <Option value={3}>Approval Flow</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('UseDepartments', {
              valuePropName: 'checked',
            })(
              <Checkbox>Use Departments</Checkbox>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewFacilitiesForm = Form.create()(AddNewFacilities)
export default AddNewFacilitiesForm
