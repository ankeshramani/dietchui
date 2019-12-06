import React, {Component} from "react";
import {Form, Input, Checkbox, Modal, Radio, Select, Spin, DatePicker, Col, Row, InputNumber, message} from "antd";
import {ApiService} from "../../../services/ApiService";

const { Option } = Select;

class AddNewTubeFeed extends Component {
  _apiService = new ApiService();

  state = {
    tubeFeedMethods: [],
    tubeFeedTypeOfTubes: [],
  }

  componentDidMount() {
    this.getTubeFeedSizeMethod()
    this.getTubeFeedTypeOfTube()
  }

  getTubeFeedSizeMethod = async () => {
    const data = await this._apiService.getTubeFeedSizeMethod()
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        tubeFeedMethods: data
      })
    }
  }

  getTubeFeedTypeOfTube = async () => {
    const data = await this._apiService.getTubeFeedTypeOfTube()
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        tubeFeedTypeOfTubes: data
      })
    }
  }

  render() {
    const {isTubeFeed, isSaving, onToggleTubeFeed, tubeFeedProducts} = this.props;
    const {tubeFeedMethods, tubeFeedTypeOfTubes} = this.state;
    const formItemLayout = {
      labelCol: {
        md: {
          span: 6
        }
      },
      wrapperCol: {
        md: {
          span: 18
        }
      },
      labelAlign: 'right'
    };
    return(
      <Modal
        visible={isTubeFeed}
        title="Add a new tube feed"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={onToggleTubeFeed}
        onOk={onToggleTubeFeed}
        width={900}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Row className="align-items-center">
            <Col md={12} sm={24}>
              <Form.Item label="Date">
                <DatePicker/>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={12} sm={24}>
              <Form.Item label="Type of Tube">
                <Select style={{width: 185}}>
                  {
                    (tubeFeedTypeOfTubes || []).map((x) => {
                      return(
                        <Option value={x.Item1}>{x.Item2}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
              <p className="ml-10">Method:</p>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
              <p>Delivery Comments:</p>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={12} sm={24}>
              <Form.Item label="Tube Size">
               <Input/>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
                <Select className="ml-10">
                  {
                    (tubeFeedMethods || []).map((x) => {
                      return(
                        <Option value={x.Item1}>{x.Item2}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
               <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={12} sm={24}>
              <Form.Item label="Change Tube">
               <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={2} sm={24}>
              <Form.Item label="1">
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
             <p className="text-center mb-0">cc</p>
              </Form.Item>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
                <Select name={"Product_Name"} value={""} style={{width: 220}}>
                  {
                    tubeFeedProducts.map((x)=> {
                      return (
                        <Option value={(x && x.PKey_Products) || ""}>{(x && x.Product_Name) || ""}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">@</p>
              </Form.Item>
            </Col>
            <Col md={2} sm={24}>
              <Form.Item>
                <Input style={{width:70}}/>
              </Form.Item>
            </Col>
            <Col md={3} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">% per hr x</p>
              </Form.Item>
            </Col>
            <Col md={2} sm={24}>
              <Form.Item>
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">hrs</p>
              </Form.Item>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={2} sm={24}>
              <Form.Item label="2">
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <p className="text-center mb-0">cc</p>
            </Col>
            <Col md={6} sm={24}>
              <Form.Item>
                  <Select name={"Product_Name"} value={""} style={{width: 220}}>
                  {
                    tubeFeedProducts.map((x)=> {
                      return (
                        <Option value={(x && x.PKey_Products) || ""}>{(x && x.Product_Name) || ""}</Option>
                      )
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <p className="text-center mb-0">@</p>
            </Col>
            <Col md={2} sm={24}>
              <Form.Item>
                <Input style={{width:70}}/>
              </Form.Item>
            </Col>
            <Col md={3} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">% per hr x</p>
              </Form.Item>
            </Col>
            <Col md={2} sm={24}>
              <Form.Item>
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">hrs</p>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={2} sm={24}>
              <Form.Item label="3">
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">cc</p>
              </Form.Item>
            </Col>
            <Col md={4} sm={24}>
              <Form.Item>
              <p className="mb-0">Free H20 Flush</p>
              </Form.Item>
            </Col>
            <Col md={2} sm={24}>
              <Form.Item>
                <Input type="number"/>
              </Form.Item>
            </Col>
            <Col md={3} sm={24}>
              <Form.Item>
              <p className="mb-0">X per day</p>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col md={2} sm={24}>
              <Form.Item label="4">
                <Input/>
              </Form.Item>
            </Col>
            <Col md={1} sm={24}>
              <Form.Item>
              <p className="text-center mb-0">cc</p>
              </Form.Item>
            </Col>
            <Col md={3} sm={24}>
              <Form.Item>
              <p className="mb-0">Medications</p>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default AddNewTubeFeed
