import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Row, Col, Spin, Input, Modal, InputNumber} from "antd";
const { TextArea } = Input;
class AddAndUpdateSupplier extends Component {
  _apiService = new ApiService();

  state = {
    PKeyG_OP_Supplier: null,
    PKey_OP_Supplier: -1,
  }

  componentDidMount() {
    const { selectedRecord = {}, isEdit } = this.props;
    if(isEdit){
      this.setState({
        PKeyG_OP_Supplier: selectedRecord.PKeyG_OP_Supplier,
        PKey_OP_Supplier: selectedRecord.PKey_OP_Supplier,
      });
      this.props.form.setFieldsValue({
        ...selectedRecord,
      });
    }
  }

  onSave =  (data) => {
    const { saveRecord } = this.props;
    const { PKeyG_OP_Supplier, PKey_OP_Supplier } = this.state;
    const payload = {
      PKeyG_OP_Supplier,
      PKey_OP_Supplier,
      ...data,
    }
    saveRecord(payload)
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.onSave({...values});
    });
  };

  render() {
    const {isEdit, isSaving, isModalOpen, isModal } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        md: {
          span: 8
        }
      },
      wrapperCol: {
        md: {
          span: 16
        }
      },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isModal}
        title={isEdit  ? 'Update Supplier' : 'Add New Supplier'}
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={isModalOpen}
        width={700}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Name">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: 'Please input Name!' }],
                })(
                  <Input autoFocus={true}/>
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="Payment Terms">
                {getFieldDecorator('PaymentTerms', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Free On Board">
                {getFieldDecorator('FreeOnBoard', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="Min Order">
                {getFieldDecorator('MinOrder', {
                })(
                  <InputNumber />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Address 1">
                {getFieldDecorator('Street', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="Address 2">
                {getFieldDecorator('Street2', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="City">
                {getFieldDecorator('City', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="State">
                {getFieldDecorator('State', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Zip ">
                {getFieldDecorator('Zip', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="Delivery">
                {getFieldDecorator('Delivery', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Phone">
                {getFieldDecorator('Phone', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="Notes">
                {getFieldDecorator('Notes', {
                })(
                  <TextArea />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col md={12} sm={24}>
              <Form.Item label="Fax">
                {getFieldDecorator('Fax', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col md={12} sm={24} className="pl-5">
              <Form.Item label="WebPage">
                {getFieldDecorator('WebPage', {
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="">
            {getFieldDecorator('PrimarySupplier', {
              valuePropName: 'checked',
            })(
              <Checkbox>Primary Supplier</Checkbox>
            )}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}
const AddAndUpdateSupplierForm = Form.create()(AddAndUpdateSupplier)
export default AddAndUpdateSupplierForm;
