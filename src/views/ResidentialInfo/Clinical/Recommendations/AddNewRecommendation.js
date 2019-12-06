import React, {Component} from "react";
import {Row, Col} from "reactstrap"
import {DatePicker, Form, Input, Modal, Select, Spin,} from "antd";
const { TextArea } = Input;
class AddNewRecommendation extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    const {isRecommendation, onToggleRecommendation, isSaving} = this.props;
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isRecommendation}
        title="Add a New Recommendation..."
        okText={isSaving ? <Spin className="white" size={"small"}/> : 'Save'}
        onCancel={onToggleRecommendation}
        onOk={onToggleRecommendation}
        width={555}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label="Date">
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Discipline">
                <Select>
                  <Select.Option value="Dietary">Dietary</Select.Option>
                  <Select.Option value="MD">MD</Select.Option>
                  <Select.Option value="Nursing">Nursing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Title">
              <Input/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Recommendation">
                <TextArea rows={8}/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Date Completed">
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Reevaluation Date">
                <DatePicker/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default AddNewRecommendation
