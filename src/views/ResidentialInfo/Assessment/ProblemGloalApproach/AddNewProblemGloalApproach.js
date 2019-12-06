import React, {Component} from "react";
import {Row, Col} from "reactstrap"
import {Checkbox, DatePicker, Form, Input, Modal, Select, Spin,} from "antd";
const { TextArea } = Input;

class AddNewProblemGloalApproach extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    const {isProblem, onToggleProblem, isSaving} = this.props;
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isProblem}
        title="Add a New Problem/Goal/Approach for Mary Clark..."
        okText={isSaving ? <Spin className="white" size={"small"}/> : 'Save'}
        onCancel={onToggleProblem}
        onOk={onToggleProblem}
        width={600}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label="Problem No">
               <Input type="number"/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Start Date">
               <DatePicker/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="End Date">
                <DatePicker/>
                <Checkbox className="ml-10">Resolved</Checkbox>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Reviewed Date">
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col md={12} sm={12}>
              <Form.Item label="Title">
                <Input/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form>
          <Row>
            <Col md={6} sm={12}>
              <Form.Item label="Problem">
                <TextArea rows={4}/>
              </Form.Item>
              <Form.Item label="Goal">
                <TextArea rows={4}/>
              </Form.Item>
            </Col>
            <Col md={6} sm={12}>
              <Form.Item label="Approach">
                <TextArea rows={11}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default AddNewProblemGloalApproach
