import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Icon, Menu, message, notification, Radio, Spin} from "antd";
import {ApiService} from "../../../services/ApiService";

const RadioGroup = Radio.Group;

class Birthday extends Component {
  _apiService = new ApiService();
  
  state = {
    loading: true,
    selectedMonth: 1,
    name: '',
    isSaving: false,
  }
  
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  
  onPrint = async () => {
    const { selectedMonth } = this.state;
    const payload = {
      ReportsPKey: 1,
      Month: selectedMonth,
    };
    this.setState({
      isSaving: true,
    })
    const data = await this._apiService.onBirthdayPrint(payload);
    if (!data || data.error) {
      this.setState({
        isSaving: false,
      })
      return message.error(' Something went wrong! Please try again later!');
    }
    if (data) {
      this.setState({
        isSaving: false,
      });
      const args = {
        message: 'Birthday Submitted',
        description:
          'You will be notified when reports has been finished generating.',
        duration: 0,
        placement: 'bottomRight',
        bottom: 30
      };
      return notification.open(args);
    }
  }
  
  render() {
    const { isSaving, selectedMonth } = this.state;
    return (
      <div className="animated fadeIn with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="new">
              <Icon type="printer" />
              {
                isSaving ? <span><Spin size="small" /></span> : <span onClick={this.onPrint}>Print</span>
              }
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="min-height-card">
                <Col xs="12" sm="12" lg="12">
                  <div>
                    <p>Please select month:</p>
                    <RadioGroup defaultValue={1} value={selectedMonth} className="w-50" name="selectedMonth" onChange={this.onChange}>
                      <Radio value={1}>January</Radio>
                      <Radio value={2}>February</Radio>
                      <Radio value={3}>March</Radio>
                      <Radio value={4}>April</Radio>
                      <Radio value={5}>May</Radio>
                      <Radio value={6}>June</Radio>
                      <Radio value={7}>July</Radio>
                      <Radio value={8}>August</Radio>
                      <Radio value={9}>September</Radio>
                      <Radio value={10}>October</Radio>
                      <Radio value={11}>November</Radio>
                      <Radio value={12}>December</Radio>
                    </RadioGroup>
                   
                  </div>
                </Col>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
  
}

export default Birthday;
