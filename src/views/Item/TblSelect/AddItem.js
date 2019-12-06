import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, Modal, Spin} from "antd/lib/index";

class AddNewContact extends Component {
  _apiService = new ApiService();

  state = {

  }

  onAddNewRecord = (dataObj) => {
    const {selectedDepartment} = this.props
    const data = {
      ...dataObj,
      FKey_OP_Department: selectedDepartment  ? selectedDepartment.PKey_OP_Department : null,
      FKey_OP_Supplier: null,
      PKey_OP_Contact: -1,
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
    const {isSaving, isModal, isModalOpen} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'left'
    };
    return(
      <Modal
        visible={isModal}
        title="Create a New Contact"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="First Name">
            {getFieldDecorator('FirstName',{
              rules: [{ required: true, message: 'Please input First Name!' }],
            })(
              <Input autoFocus={true}/>
            )}
          </Form.Item>
          <Form.Item label="Last Name">
            {getFieldDecorator('LastName', {
              rules: [{ required: true, message: 'Please input Last Name!' }],
            })(
              <Input/>
            )}
          </Form.Item>
          <Form.Item label="Email">
            {getFieldDecorator('Email', {
              rules: [{ required: true, message: 'Please input Email!' }],
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="Ext">
            {getFieldDecorator('PhoneExt', {
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="Phone">
            {getFieldDecorator('Phone', {
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('PrimaryContact', {
              valuePropName: 'checked',
            })(
              <Checkbox>Primary Contact</Checkbox>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewContactForm = Form.create()(AddNewContact)
export default AddNewContactForm
