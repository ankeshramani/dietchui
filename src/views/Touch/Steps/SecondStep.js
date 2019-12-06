import React, {Component} from 'react'
import {Row, Col, Card, CardBody} from 'reactstrap'

class SecondStep extends Component {
  render() {
    const {userList, onShowUserDetails} = this.props;
    return (
      <div>
        <Row className="mt-10 align-items-center">
          <Col md="12" sm="12" lg="12">
            <Card style={{width: 200}} className="pull-right mb-10">
              <CardBody>
                        <span className="text-center">
                          Fri 11/22
                        </span>
                <br/>
                <span className="text-center">
                          supper
                        </span>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className="mt-10 card-list custom-card-body">
          {
            userList.map((x) => {
              return (
                <Card>
                  <CardBody>
                    <div className="cursor-pointer" onClick={() => onShowUserDetails(x)}>
                      <Row>
                        {
                          x.img ? <Col md="4" className="p-0">
                            <img src={x.img}/>
                          </Col> : null
                        }
                        <Col md="8" className="p-0">
                          <div>{x.firstName}</div>
                          <div className="small">{x.lastName}</div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <div className="small pull-right">{x.date}</div>
                        </Col>
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              )
            })
          }
        </div>
      </div>
    )
  }

}

export default SecondStep;
