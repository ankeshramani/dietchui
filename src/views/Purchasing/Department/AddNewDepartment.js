import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Form, Input, InputNumber, Modal, Spin} from "antd";

class AddNewDepartment extends Component {
  _apiService = new ApiService();

  state = {
    name: '',
    poSuffix: '',

  }

  onAddNewRecord = (objData) => {
    const data = {
      ...objData,
      PKey_OP_Department: 0,
      FKey_Facility: this.props.facilityKey,
    }
    this.props.addNewRecord(data, true)
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
    const {isSaving, isModal, isModalOpen} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isModal}
        title="Add a New Department"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Name">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: 'Please input your  name!' }],
            })(
              <Input autoFocus={true}/>
            )}
          </Form.Item>
          <Form.Item label="PO Suffix">
            {getFieldDecorator('POSuffix', {
            })(
              <InputNumber/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewDepartmentForm = Form.create()(AddNewDepartment)
export default AddNewDepartmentForm
