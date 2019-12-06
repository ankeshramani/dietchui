import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Form, InputNumber, Modal, Select, Spin} from "antd";

const Option = Select.Option;

class AddNewFacilitie extends Component {
  _apiService = new ApiService();

  state = {
    FKey_Facility: '',
  }

  onAddNewRecord = (objData) => {
    const {FKey_Facility } = this.state;
    const {selectedSupplier} = this.props;
    const data = {
      ...objData,
      FKey_Facility,
      FKey_OP_Supplier: selectedSupplier.PKey_OP_Supplier,
      PKey_OP_Supplier_Facility: -1,
    }
    this.props.addNewFacility(data)
  }

  handleChange = (FKey_Facility) => {
    this.setState({
      FKey_Facility
    });
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
    const {facilitiesData, isFacilityModal, isFacilityModalOpen, isSaving} = this.props;
    const {FKey_Facility} = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isFacilityModal}
        title="Add a New Facility"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isFacilityModalOpen}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="Facility">
            {getFieldDecorator('FKey_Facility', {
              rules: [{ required: true, message: 'Please input Facility!' }],
            })(
              <Select
                autoFocus={true}
                style={{ width: 200 }}
                value={FKey_Facility}
                placeholder="Select facility"
                onChange={this.handleChange}
              >
                {
                  facilitiesData.map((d) => (
                    <Option value={d.PKey_Facility}>{d.Facility_Name}</Option>
                  ))
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="AccountNumber">
            {getFieldDecorator('AccountNumber', {
            })(
              <InputNumber/>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddNewFacilitieForm = Form.create()(AddNewFacilitie)
export default AddNewFacilitieForm
