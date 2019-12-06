import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Row, Col} from "reactstrap"
import {Checkbox, TimePicker , Form, Input, Modal, Select, Button} from "antd";

class AddNewTubeFeedLabels extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      isAddTime: false,
      customTime: '',
      mealTime: [
        {
          value: 'Breakfast'
        },
        {
          value: 'Lunch'
        },
        {
          value: 'Supper'
        },
        {
          value: 'EAM'
        },
      ]
    }
  }

  onSelectionChanged = (record) => {
    this.widgetRef.current.instance.close();
  }

  onToggleTime = () => {
    this.setState({
      isAddTime: !this.state.isAddTime,
    })
  }

  onTimeChange = (time, timeString) => {
   this.setState({
     customTime: timeString
   })
  }

  onAddTime = () => {
    const {customTime, mealTime } = this.state;
    if(customTime){
      mealTime.push({value:customTime})
      this.setState({
        mealTime,
        isAddTime: false
      })
    }
  }

  render() {
    const {isTubeFeedLabel, onToggleTubeFeedLabel} = this.props;
    const {isAddTime,mealTime} = this.state;
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      labelAlign: 'left'
    };
    const formItemLayout2 = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isTubeFeedLabel}
        title="Add a New Tube Feed Label"
        okText={'Save'}
        onCancel={onToggleTubeFeedLabel}
        onOk={onToggleTubeFeedLabel}
        width={555}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout}>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item label="Products">
                <Select>
                  <Select.Option value="1">1</Select.Option>
                  <Select.Option value="2">2</Select.Option>
                  <Select.Option value="3">3</Select.Option>
                  <Select.Option value="4">4</Select.Option>
                  <Select.Option value="5">5</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form {...formItemLayout2}>
          <Row>
            <Col md={6} sm={12}>
              <Form.Item label="Size">
                <Input/>
              </Form.Item>
            </Col>
            <Col md={6} sm={12}>
              <Form.Item label="UMO">
                <Select>
                  <Select.Option value="1">cc</Select.Option>
                  <Select.Option value="2">can</Select.Option>
                  <Select.Option value="3">btl</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form>
          <Row>
            <Col md={12} sm={12}>
              <Form.Item>
                <Checkbox>Active Days</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Monday</Checkbox>
              </Form.Item>
            </Col>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Tuesday</Checkbox>
              </Form.Item>
            </Col>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Wednesday</Checkbox>
              </Form.Item>
            </Col>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Thursday</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Friday</Checkbox>
              </Form.Item>
            </Col>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Saturday</Checkbox>
              </Form.Item>
            </Col>
            <Col md={3} sm={12}>
              <Form.Item>
                <Checkbox>Sunday</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Form {...formItemLayout2}>
          <Row>
            <Col md={6} sm={12}>
              <Form.Item label="Mealtime">
                <Select>
                  {
                    mealTime.map((x) => {
                      return(
                        <Select.Option value={x.value}>{x.value}</Select.Option>
                      )
                    })
                  }

                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={12}>
              <Form.Item>

                 <Button onClick={this.onToggleTime}>Add</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {
          isAddTime &&   <Modal
            visible={isAddTime}
            title="Custom Time..."
            okText={'Save'}
            onCancel={this.onToggleTime}
            onOk={this.onAddTime}
            width={500}
            cancelButtonProps={{className: 'pull-right ml-10'}}
          >
            <Form>
              <Row>
                <Col md={1} sm={12}/>
                <Col md={10} sm={12}>
                  <Form.Item label="Select Custom Time">
                    <TimePicker use12Hours format="h:mm a" style={{width: "100%"}} onChange={this.onTimeChange}/>
                  </Form.Item>
                </Col>
                <Col md={1} sm={12}/>
              </Row>
            </Form>
          </Modal>
        }
      </Modal>
    )
  }
}

export default AddNewTubeFeedLabels
