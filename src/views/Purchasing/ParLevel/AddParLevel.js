import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Form, Input, Modal, Spin} from "antd";

class AddParLevel extends Component {
  _apiService = new ApiService();

  state = {

  }

  onAddNewRecord = (objData) => {
    const {facilityKey} = this.props
    const data = {
      ...objData,
      PKey_OP_ParLevel: -1,
      FKey_Facility: facilityKey,
      DateEntered: new Date(),
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
        title="Add a New Par Level"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Name">
            {getFieldDecorator('Name', {
              rules: [{ required: true, message: 'Please input Par Level!' }],
            })(
              <Input autoFocus={true}/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddParLevelForm = Form.create()(AddParLevel)
export default AddParLevelForm
