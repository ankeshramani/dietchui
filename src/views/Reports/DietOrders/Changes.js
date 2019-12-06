import React, {Component} from "react";
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import moment from "moment";
import {connect} from "react-redux";
import {DatePicker, Icon, Menu} from "antd";

const { RangePicker } = DatePicker;

class Changes extends Component {
  
  state = {
    loading: true,
    name: '',
  }
  
  render() {
    const {datePickerSize} = this.props;
    return (
      <div className="animated fadeIn with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="new">
              <Icon type="printer" />
              Print
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="min-height-card">
                <Row>
                  <Col sm="12">
                    <p>Please select date:</p>
                    <RangePicker
                      size={datePickerSize || 'default'}
                      defaultValue={[moment().add(-1, 'week'), moment()]}
                    />
                  </Col>
                  <Col sm="12" className="mt-10">
                    <Button color="primary">Submit</Button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
  
}

const mapStateToProps = (state) => ({
  datePickerSize: state.settings.datePickerSize,
});

export default connect(mapStateToProps)(Changes)
