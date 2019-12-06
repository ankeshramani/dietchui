import React, {Component} from 'react'
import {Row, Col, Card, CardBody, CardHeader} from 'reactstrap'
import {Button, Checkbox, DatePicker} from "antd";

class FirstStep extends Component {
  render() {
    const {cardList, onConfirm, onCheckBoxChange} = this.props;
    return (
      <div>
        <Row className="mt-10 align-items-center">
          <Col md="11" sm="12" lg="11">
            <span>Select the date and mealtime to use for your session</span>
          </Col>
        </Row>
        <Row className="mt-10">
          <Col md="12" sm="12" lg="12">
            <DatePicker/>
          </Col>
        </Row>
        <Row className="mt-10">
          {
            (cardList || []).map((record, i) => {
              return (
                <Col md="" sm="12">
                  <Card>
                    <CardHeader>
                      <Checkbox className="pull-right" checked={record && !!record.defaultChecked}
                                onChange={(event) => onCheckBoxChange(event, record)}/></CardHeader>
                    <CardBody>
                      <span>{record.name}</span>
                    </CardBody>
                  </Card>
                </Col>
              )
            })
          }
        </Row>
        <Row>
          <Col md="3" sm="12">
            <Button type="primary" onClick={onConfirm}>Continue</Button>
          </Col>
        </Row>
      </div>
    )
  }

}

export default FirstStep;
