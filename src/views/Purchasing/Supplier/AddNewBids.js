import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Spin, Input, Modal, InputNumber, DatePicker, Select, message } from "antd";
import {Row, Col} from 'reactstrap';
const { Option } = Select;

class AddNewBids extends Component {
  _apiService = new ApiService();

  state ={
    bidStatus: []
  }

  onSave = (data) => {
    const { selectedRecord = {}, selectedSupplier = {}} = this.props;
    const payload = {
      ...data,
      BidStatus_ReturnToInStockDate: selectedRecord.BidStatus_ReturnToInStockDate || null,
      ModelNumber: selectedRecord.ModelNumber || null,
      BidStatus_Note: selectedRecord.BidStatus_Note || null,
      PKey_OP_Supplier: selectedRecord.PKey_OP_Supplier,
      FKey_OP_Supplier: selectedSupplier.PKey_OP_Supplier,
      PKeyG_OP_Supplier_Bid: selectedRecord.PKeyG_OP_Supplier_Bid || null,
      PKey_OP_Supplier_Bid: selectedRecord.PKey_OP_Supplier_Bid || 0,
      BidStatus_Replacement_FKey_OP_Supplier_Bid: data.BidStatus || 1,
      IDNumber: selectedSupplier.IDNumber || '',
    };
    this.props.saveRecord(payload);
  };

  componentDidMount() {
    const { selectedRecord = {}, isEdit } = this.props;
    this.getEnumDetailsBidStatus()
    if(isEdit){
      this.props.form.setFieldsValue({
        ...selectedRecord,
      });
    }
  }

  getEnumDetailsBidStatus = async () => {
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getEnumDetailsBidStatus()
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        bidStatus: data,
        loading: false,
      })
    }
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
    const {isSaving, isModalOpen, isModal, isEdit} = this.props;
    const { bidStatus = [] } = this.state;
    const {getFieldDecorator} = this.props.form;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
      labelAlign: 'right'
    };
    return (
      <Modal
        visible={isModal}
        title={isEdit ? 'Update Bids': 'Add New Bids'}
        okText={isSaving ? <Spin className="white" size={"small"}/> : 'Save'}
        onCancel={isModalOpen}
        width={700}
        onOk={this.handleSubmit}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Row className="pt-19">
          <Col md="6" sm="12" xs="12">
            <Form {...formItemLayout}>
              <Form.Item label="Name">
                {getFieldDecorator('Name', {
                  rules: [{ required: true, message: 'Please input Name!' }],
                })(
                  <Input autoFocus={true}/>,
                )}
              </Form.Item>
              <Form.Item label="Start Date">
                {getFieldDecorator('StartDate', {})(
                  <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                )}
              </Form.Item>
              <Form.Item label="Brand">
                {getFieldDecorator('Brand', {})(
                  <Input/>
                )}
              </Form.Item>
              <Form.Item label="Bid Status">
                {getFieldDecorator('BidStatus', {
                })(
                  <Select>
                    {
                      (bidStatus || []).map((x)=>(
                        <Option value={x.Item1}>{x.Item2}</Option>
                      ))
                    }
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Option">
                <Row>
                  <Col md="6">
                    <Form.Item >
                      {getFieldDecorator('Kosher', {
                        valuePropName: 'checked',
                      })(
                        <Checkbox>Kosher</Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md="6">
                    <Form.Item>
                      {getFieldDecorator('Split', {
                        valuePropName: 'checked',
                      })(
                        <Checkbox>Split </Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md="6">
                    <Form.Item>
                      {getFieldDecorator('PerPound', {
                        valuePropName: 'checked',
                      })(
                        <Checkbox>Per Lb.</Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                  <Col md="6">
                    <Form.Item>
                      {getFieldDecorator('SingleServe', {
                        valuePropName: 'checked',
                      })(
                        <Checkbox>Single Serve </Checkbox>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
          <Col md="6" sm="12" xs="12">
            <Form {...formItemLayout}>
              <Form.Item label="Min:">
                {getFieldDecorator('MIN', {})(
                  <InputNumber style={{width: "100%"}}/>
                )}
              </Form.Item>
              <Form.Item label="Price">
                {getFieldDecorator('Price', {})(
                  <InputNumber style={{width: "100%"}}/>
                )}
              </Form.Item>
              <Form.Item label="End Date">
                {getFieldDecorator('EndDate', {})(
                  <DatePicker style={{width: "100%"}} format="YYYY-MM-DD"/>
                )}
              </Form.Item>
              <Form.Item label="Pack/Size">
                <Row>
                  <Col md="5" className="pr-0">
                    <Form.Item >
                      {getFieldDecorator('Pack', {})(
                        <Input />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md="3" className="pl-2 pr-2">
                    <Form.Item>
                      {getFieldDecorator('Size', {})(
                        <Input />
                      )}
                    </Form.Item>
                  </Col>
                  <Col md="4" className="pl-0">
                    <Form.Item>
                      {getFieldDecorator('Measure', {})(
                        <Input/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>
    )
  }
}

const AddNewBidsForm = Form.create()(AddNewBids)
export default AddNewBidsForm;
