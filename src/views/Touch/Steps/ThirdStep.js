import React, {Component} from 'react'
import {Row, Col, Card, CardBody} from 'reactstrap'
import {Checkbox, Icon} from "antd";

class ThirdStep extends Component {
  render() {
    const {isShowCategory, selectedUser, onShowCategory} = this.props;
    return (
      <div>
        <div className="step-3">
          <div className="custom-card-body-user-detail">
            <Row>
              <Col md={1} className="p-0">
                <Card className="mb-0">
                  <CardBody>
                    <div className="text-center fs-12">
                      <span style={{background: 'red'}}>FA</span><span> (0)</span><br/>
                      <span style={{background: 'green'}}>AE</span><span> (0)</span><br/>
                      <span style={{background: 'orange'}}>SN</span><span> (0)</span><br/>
                      <span style={{background: 'gray'}}>N</span><span>  (0)</span>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col md={9} className="p-0">
                <div className="d-flex"><h3>ACOSTA, GUEST 1</h3>&nbsp;&nbsp;&nbsp;<h4>141 F | 1</h4></div>
              </Col>
              <Col md={2} className="p-0">
                <Card className="mb-0">
                  <CardBody>
                    <div className="text-center">
                      <span>Sat 11/23</span><br/>
                      <span>Breakfast</span>
                      <br/>
                      <br/>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
          <Row className="align-items-center">
            {
              isShowCategory ?

                <Col md={2}>
                  <span>Menu Categories</span>
                </Col> : <Col md={2}/>

            }
            <Col md={7}>
              <h4>HOUSE</h4>
            </Col>
          </Row>
          <Row className="mb-80">
            {
              isShowCategory ?
                <>
                <Col md={1} className="pr-0">
                  {
                    ((selectedUser && selectedUser.categories && selectedUser && selectedUser.categories.menuCategories) || []).map((x) => {
                      return (
                        <div className="custom-card-body-menu-categories">
                          <Card>
                            <CardBody className="fs-12" style={{backgroundColor: x.color}}>
                              <span>{x.name}</span><br/>
                              <span className="pull-right">1</span>
                            </CardBody>
                          </Card>
                        </div>
                      )
                    })
                  }
                </Col>
              <div className="cursor-pointer pt-180" onClick={onShowCategory}><Icon type="left" className="fs-26"/></div>
                </> :
                <Col md={1} className="pr-0">
                  <div className="cursor-pointer pt-180" onClick={onShowCategory}><Icon type="right" className="fs-26"/></div>
                </Col>
            }


            <Col md={7}>
              <Row className="category-card-body">
                <Col md={2} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={2} className="pr-2 pl-0">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={2} className="pr-2 pl-0">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="category-card-body">
                <Col md={4} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={2} className="pr-2 pl-0">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="category-card-body">
                <Col md={4} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="category-card-body">
                <Col md={4} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="category-card-body">
                <Col md={2} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={2} className="pr-2 pl-0">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <Row className="category-card-body">
                <Col md={2} className="pr-2">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
                <Col md={2} className="pr-2 pl-0">
                  <Card>
                    <CardBody>
                      <span className="fs-14">Oatmeal</span><Checkbox className="pull-right"/>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col md={3} className="side-box">
              <Row>
                <Col md={12}>
                  <span><b>CEREAL</b></span>
                </Col>
                <Col md={10}>
                  <span>6 oz Oatmeal</span>
                </Col>
                <Col md={2}>
                  <span className="pull-right">$0.00</span>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <span><b>CEREAL</b></span>
                </Col>
                <Col md={10}>
                  <span>6 oz Oatmeal</span>
                </Col>
                <Col md={2}>
                  <span className="pull-right">$0.00</span>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <span><b>CEREAL</b></span>
                </Col>
                <Col md={10}>
                  <span>6 oz Oatmeal</span>
                </Col>
                <Col md={2}>
                  <span className="pull-right">$0.00</span>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <span><b>CEREAL</b></span>
                </Col>
                <Col md={10}>
                  <span>6 oz Oatmeal</span>
                </Col>
                <Col md={2}>
                  <span className="pull-right">$0.00</span>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <span><b>CEREAL</b></span>
                </Col>
                <Col md={10}>
                  <span>6 oz Oatmeal</span>
                </Col>
                <Col md={2}>
                  <span className="pull-right">$0.00</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    )
  }

}

export default ThirdStep;
