import React, {Component} from "react";
import {Checkbox, Form, Input, message, Modal, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";

class AddNewOrderGuide extends Component {
  _apiService = new ApiService();

  state = {
    PKey_OP_OrderGuide: -1,
    FKey_Facility: 13,
    isSaving: false,
  }

  onAddNewOrderGuide = async (objData) => {
    const {PKey_OP_OrderGuide, FKey_Facility} = this.state;
    const payload = {
      ...objData,
      PKey_OP_OrderGuide,
      FKey_Facility,
      DateEntered: new Date()
  }
    this.setState({
      isSaving: true,
    });
    const data =  await this._apiService.updateOrderGuide(payload)
    this.props.newOderGuideModalOpen()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      })
    } else {
      message.success('Order Guide Added Successfully!');
      payload.PKey_OP_OrderGuide = data;
      payload.OrderGuideName = payload.orderGuideName;
      this.setState({
        isSaving: false,
      });
      this.props.addOrderGuide(payload);
      this.props.refreshGrid()
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.onAddNewOrderGuide(values);
    });
  };

  render() {
    const {isSaving} = this.state;
    const { getFieldDecorator } = this.props.form;
    const { newOderGuide, newOderGuideModalOpen } = this.props;
    return(
      <Modal
        visible={newOderGuide}
        title="Add a New Order Guide"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={newOderGuideModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form layout="inline">
          <Form.Item label="Order Guide Name">
            {getFieldDecorator('orderGuideName', {
              rules: [{ required: true, message: 'Please input your order guide name!' }],
            })(
              <Input autoFocus={true}/>,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('defaultOrderGuide', {
              valuePropName: 'checked',
            })(
              <Checkbox>Default Order Guide</Checkbox>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('selected', {
              valuePropName: 'checked',
            })(
              <Checkbox>Selected</Checkbox>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewOrderGuideForm = Form.create()(AddNewOrderGuide)
export default AddNewOrderGuideForm
