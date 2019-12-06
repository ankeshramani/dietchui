import React,{Component} from 'react';
import {Radio, Form, Select, Input, Button} from "antd";
import {Row, Col} from 'reactstrap'

class CalorieAndProteinAndFoodNeed extends Component{
  
  state={
    calorieNeeds: 'HarrisBenedict',
    weightGoal: 'Loss',
  }
  
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const {calorieNeeds, weightGoal} = this.state;
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 17},
      labelAlign: 'left'
    };
    const formItemLayout2 = {
      labelCol: {span: 3},
      wrapperCol: {span: 17},
      labelAlign: 'left'
    };
    return(
    <div>
      <Row>
        <Col md={6} sm={12}>
          <Form {...formItemLayout}>
            <Row>
              <Col md={12}>
                <Form.Item>
                  <p className="mb-0">Calorie Needs</p>
                </Form.Item>
                <hr/>
              </Col>
            </Row>
            <Row className="mt-10">
              <Col md={12}>
                <Form.Item>
                  <Radio.Group onChange={this.onChange} name="calorieNeeds" value={calorieNeeds}>
                    <Radio value="HarrisBenedict">Harris-Benedict</Radio>
                    <Radio value="EnergyPerKilogram">Energy per Kilogram</Radio>
                    <Radio value="MiffinStJoer">Miffin St. Joer</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <Form.Item label="Weight To Use">
                  <Select style={{width: "100%"}}>
                    <Select.Option value="1day">ABW</Select.Option>
                    <Select.Option value="2day">IBW</Select.Option>
                    <Select.Option value="3day">ADJ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={2}>
                <Form.Item>
                  <p className="mb-0">15 lbs</p>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <Form.Item label="Active Factor">
                  <Input style={{width: "100%"}} disabled={calorieNeeds === 'EnergyPerKilogram'} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={7}>
                <Form.Item label="Injury Factor">
                  <Input style={{width: "100%"}} disabled={calorieNeeds === 'EnergyPerKilogram'}/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Item>
                  <p className="mb-0">717 - 914 Calories(TEE) = 625.25 (BEE) x 1.3 AF x 1 IF</p>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Form.Item>
                  <p className="mb-0">Protein Needs</p>
                </Form.Item>
                <hr/>
              </Col>
            </Row>
            <Row className="mt-8">
                <Col md={7}>
                  <Form.Item label="Weight To Use">
                    <Select style={{width: "100%"}}>
                      <Select.Option value="1day">ABW</Select.Option>
                      <Select.Option value="2day">IBW</Select.Option>
                      <Select.Option value="3day">ADJ</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={2}>
                  <Form.Item>
                    <p className="mb-0">15 lbs</p>
                  </Form.Item>
                </Col>
            </Row>
            <Form {...formItemLayout2}>
              <Row>
                <Col md={12}>
                  <Form.Item label="Low">
                    <p className="mb-0">108 g Protein = 90 Kg x 1.2 Protein Factor</p>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Item label="High">
                    <p className="mb-0">108 g Protein = 90 Kg x 1.5 Protein Factor</p>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col md={12}>
                <Form.Item>
                  <p className="mb-0">Fluid Needs</p>
                </Form.Item>
                <hr/>
              </Col>
            </Row>
            <Row className="mt-8">
              <Col md={7}>
                <Form.Item label="Weight To Use">
                  <Select style={{width: "100%"}}>
                    <Select.Option value="1day">ABW</Select.Option>
                    <Select.Option value="2day">IBW</Select.Option>
                    <Select.Option value="3day">ADJ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={2}>
                <Form.Item>
                  <p className="mb-0">15 lbs</p>
                </Form.Item>
              </Col>
            </Row>
            <Form {...formItemLayout2}>
              <Row>
                <Col md={12}>
                  <Form.Item label="Low">
                    <p className="mb-0">2,694cc = 90 Kg x 30 cc/Kg (BW)</p>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Item label="High">
                    <p className="mb-0">3,143cc = 90 Kg x 35 cc/Kg (BW)</p>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col md={12}>
                <Form.Item>
                  <p className="mb-0">Summary</p>
                </Form.Item>
                <hr/>
              </Col>
            </Row>
            <Row>
              <Col md={6} label=" ">
                <Form.Item>
                  <p className="mb-0">ENN</p>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item>
                  <p className="mb-0">MPP</p>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Item label="Calories">
                 <Input value='2,071 - 2,271'/>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item>
                  <Input value='1850 - 2000'/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Item label="Protein (g)">
                  <Input value='108 - 135'/>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item>
                  <Input value='100 - 102'/>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Item label="Fluid (cc)">
                  <Input value='2,694 - 3,143'/>
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item>
                  <Input value='2000'/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col md={6} sm={12}>
          {
            calorieNeeds === "EnergyPerKilogram" ?
              <Form {...formItemLayout}>
                <Row>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Calorie Needs - Guidelines</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                </Row>
                <Row className="mt-10">
                  <Col md={6}>
                    <Form.Item>
                      <p className="mb-0">Weight Goal</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                  <Col md={6}>
                    <Form.Item>
                      <p className="mb-0">Range</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={6}>
                    <Form.Item>
                      <Radio.Group name="weightGoal" onChange={this.onChange} value={weightGoal}>
                        <Radio style={{display: 'block', height: '30px', lineHeight: '30px',}} value="Loss">Loss</Radio>
                        <Radio style={{display: 'block', height: '30px', lineHeight: '30px',}} value="Maintenance">Maintenance</Radio>
                        <Radio style={{display: 'block', height: '30px', lineHeight: '30px',}} value="Gain">Gain</Radio>
                        <Radio style={{display: 'block', height: '30px', lineHeight: '30px',}} value="Other">Other</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col md={6}>
                    <Form.Item>
                      <p className="mb-0">20 - 25 Kcal/kg/bw</p>
                      <p className="mb-0">25 - 30 Kcal/kg/bw</p>
                      <p className="mb-0">30 - 35 Kcal/kg/bw</p>
                      {weightGoal === "Other" ? <div><Input style={{ width: 80}} /> - <Input style={{ width: 80}} /> Kcal/kg/bw</div> : null}
                    </Form.Item>
                  </Col>
                </Row>
              </Form> :
              <Form {...formItemLayout}>
                <Row>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Calorie Needs - Guidelines</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                </Row>
                <Row className="mt-10">
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Activity Factor</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Confined to Chair or
                        Bed..........................................................1.20</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Out of
                        Bed........................................................................1.30</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Seated with Little
                        Activity.......................................................1.30 - 1.50</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Seated with
                        Movement..............................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Injury Factor</p>
                    </Form.Item>
                    <hr/>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Post Operative(no
                        complcations)...................................................1.30 - 1.50</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">
                        Peritonitis.......................................................................1.30 -
                        1.50</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">
                        Cancer............................................................................1.30 -
                        1.50</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Long Bone
                        Fracture................................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Wound
                        Healing.....................................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Blunt
                        Trauma......................................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Server Infection/Multiple
                        Trauma..................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Multiple Trauma with Res on
                        Venitlator............................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Trauma with
                        Steroids..............................................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">
                        Sepsis............................................................................1.30 -
                        1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Burns(% total body surface) 0 -
                        20...............................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Burns(% total body surface) 20 -
                        20..............................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item>
                      <p className="mb-0">Burns(% total body surface) 40 -
                        100.............................................1.30 - 1.70</p>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
          }
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <div className="pull-right">
            <Button type="primary" className="mr-10">Save</Button>
            <Button >Cancel</Button>
          </div>
         
        </Col>
      </Row>
    </div>
    )
  }

}

export default CalorieAndProteinAndFoodNeed
