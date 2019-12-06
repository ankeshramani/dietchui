import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Form, Input, InputNumber, Modal, Spin} from "antd";

class AddNewLedgar extends Component {
  _apiService = new ApiService();

  state = {

  }

  onAddNewRecord = (objData) => {
    const {facilityKey} = this.props;
    const data = {
      ...objData,
      PKey_OP_Ledger: -1,
      FKey_Facility: facilityKey,
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
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isModal}
        title="Add a New Ledger"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Ledger Number">
            {getFieldDecorator('LedgerNumber', {
              rules: [{ required: true, message: 'Please input your Ledger Number!' }],
            })(
              <InputNumber autoFocus={true}/>
            )}
          </Form.Item>
          <Form.Item label="Description">
            {getFieldDecorator('Description', {
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewLedgarForm = Form.create()(AddNewLedgar)
export default AddNewLedgarForm
