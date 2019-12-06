import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Form, Input, Modal, Spin} from "antd";

class AddPaymentType extends Component {
  _apiService = new ApiService();

  state = {

  }

  onAddNewRecord = (objData) => {
    const data = {
      ...objData,
      PKey_OP_PaymentType: 0,
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
    const {isModal, isSaving, isModalOpen} = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelAlign: 'left'
    };
    return(
      <Modal
        visible={isModal}
        title="Add a New Payment Type"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Payment Type">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: 'Please input Payment Type!' }],
            })(
              <Input autoFocus={true}/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddPaymentTypeForm = Form.create()(AddPaymentType)
export default AddPaymentTypeForm
