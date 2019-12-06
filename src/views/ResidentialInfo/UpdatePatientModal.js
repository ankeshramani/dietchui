import React, {Component} from "react";
import {Form, Input, Checkbox, Modal, Radio, Select, Spin, DatePicker, Button, Dropdown, Menu, Icon} from "antd";
import {DropDownBox} from "devextreme-react";
import { Col, Row} from "reactstrap";
import CustomGrid from "../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {toColor} from "../../services/common";
const { Option } = Select;

class UpdatePatientModal extends Component {

  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
  }

  onSpecialNeedChange = (checked, PKey_Special_Needs) => {
    let {specialNeeds, specialNeed} = this.props;
    if (checked) {
      const need = specialNeeds.find(x => Number(x.PKey_Special_Needs) === Number(PKey_Special_Needs));
      specialNeed.push({
        FKey_Special_Needs: PKey_Special_Needs,
        Name: need.Name
      });
    } else {
      specialNeed = specialNeed.filter(x => Number(x.FKey_Special_Needs) === Number(PKey_Special_Needs))
    }
    this.props.onRecordChange({target: {name: 'specialNeed', value: specialNeed}});

  }

  getColorsDiets = (value) => {
    const {dietTypes} = this.props;
    if (dietTypes && dietTypes.length && value) {
      const diet = dietTypes.find(y => y.PKey_Diet_Type === value);
      if (diet) {
        return {
          backgroundColor: toColor(diet.Argb_Back),
          color: toColor(diet.Argb_Fore)
        }
      }
    }
    return {}
  }

  getColorsConsistency = (value) => {
    const {consistency} = this.props;
    if (consistency && consistency.length && value) {
      const cons = consistency.find(y => y.PKey_Consist === value);
      if (cons) {
        return {
          backgroundColor: toColor(cons.Argb_Back),
          color: toColor(cons.Argb_Fore)
        }
      }
    }
    return {}
  }

  onChangeDietType = (name, record) => {
    let {latestDiet} = this.props;
    latestDiet[name] = record.selectedRowsData[0].PKey_Diet_Type;
    this.widgetRefdep.current.instance.close();
    this.props.updateState(latestDiet, '')
  }

  onChangeConsistency = (name, record) => {
    let {latestDiet} = this.props;
    latestDiet[name] = record.selectedRowsData[0].PKey_Consist;
    this.widgetRef.current.instance.close();
    this.props.updateState(latestDiet, '')
  }

  onChangeSpecialDevice = (name, record) => {
    let {patientDetails} = this.props;
    patientDetails[name] = record.selectedRowsData[0].PKEY_Spec_Devices;
    this.widgetRef.current.instance.close();
    this.props.updateState('', patientDetails)
  }

  onChangeFoodAllergy = (name, record) => {
    let {patientDetails} = this.props;
    patientDetails[name] = record.selectedRowsData[0].PKEY_Food_Allergy;
    this.widgetRef.current.instance.close();
    this.props.updateState('', patientDetails)
  }

  render() {
    let {isSaving, isModal, onModalOpen, patientDetails, onRecordChange, latestDiet, dietTypes, onSelectChange, consistency, specialNeeds, updatePatient, specialNeed, specialDevices, foodAllergy, onDateChange, onClearSelect, onClearPatientDetails} = this.props;
    const {FKey_Diet_Type1, FKey_Diet_Type2, FKey_Diet_Type3, FKey_Diet_Type4, FKey_Diet_Type5, FKey_Consist1, FKey_Consist2, FKey_Consist3, FKey_Consist4, FKey_Consist5} = latestDiet || {};
    const {FKey_Spec_Devices_1, FKey_Spec_Devices_2, FKey_Spec_Devices_3, FKey_Spec_Devices_4, FKey_Spec_Devices_5, FKey_Food_Allergy_1, FKey_Food_Allergy_2, FKey_Food_Allergy_3, FKey_Food_Allergy_4, FKey_Food_Allergy_5} = patientDetails || {};
    const dietNames = [
      {
        name: 'FKey_Diet_Type1',
        value: FKey_Diet_Type1,
        style: this.getColorsDiets(FKey_Diet_Type1)
      },
      {
        name: 'FKey_Diet_Type2',
        value: FKey_Diet_Type2,
        style: this.getColorsDiets(FKey_Diet_Type2)
      },
      {
        name: 'FKey_Diet_Type3',
        value: FKey_Diet_Type3,
        style: this.getColorsDiets(FKey_Diet_Type3)
      },
      {
        name: 'FKey_Diet_Type4',
        value: FKey_Diet_Type4,
        style: this.getColorsDiets(FKey_Diet_Type4)
      },
      {
        name: 'FKey_Diet_Type5',
        value: FKey_Diet_Type5,
        style: this.getColorsDiets(FKey_Diet_Type5)
      },
    ];
    const consistencyNames = [
      {
        name: 'FKey_Consist1',
        value: FKey_Consist1,
        style: this.getColorsConsistency(FKey_Consist1)
      },
      {
      name: 'FKey_Consist2',
      value: FKey_Consist2,
        style: this.getColorsConsistency(FKey_Consist2)
      },
      {
        name: 'FKey_Consist3',
        value: FKey_Consist3,
        style: this.getColorsConsistency(FKey_Consist3)
      },
      {
        name: 'FKey_Consist4',
        value: FKey_Consist4,
        style: this.getColorsConsistency(FKey_Consist4)
      },
      {
        name: 'FKey_Consist5',
        value: FKey_Consist5,
        style: this.getColorsConsistency(FKey_Consist5)
      },
    ];
    const specialDeviceList = [
      {
        name: 'FKey_Spec_Devices_1',
        value: FKey_Spec_Devices_1,
      },
      {
        name: 'FKey_Spec_Devices_2',
        value: FKey_Spec_Devices_2,
      },
      {
        name: 'FKey_Spec_Devices_3',
        value: FKey_Spec_Devices_3,
      },
      {
        name: 'FKey_Spec_Devices_4',
        value: FKey_Spec_Devices_4,
      },
      {
        name: 'FKey_Spec_Devices_5',
        value: FKey_Spec_Devices_5,
      },
    ];
    const foodAllergyList = [
      {
        name: 'FKey_Food_Allergy_1',
        value: FKey_Food_Allergy_1,
      },
      {
        name: 'FKey_Food_Allergy_2',
        value: FKey_Food_Allergy_2,
      },
      {
        name: 'FKey_Food_Allergy_3',
        value: FKey_Food_Allergy_3,
      },
      {
        name: 'FKey_Food_Allergy_4',
        value: FKey_Food_Allergy_4,
      },
      {
        name: 'FKey_Food_Allergy_5',
        value: FKey_Food_Allergy_5,
      },
    ];
    const formItemLayout = {
      labelCol: {span: 3},
      wrapperCol: {span: 21},
      labelAlign: 'right'
    };
    dietTypes = dietTypes.sort((a, b) => {
      return a.Name > b.Name ? 1 : -1;
    });
    consistency = consistency.sort((a, b) => {
      return a.Name > b.Name ? 1 : -1;
    });
    specialDevices = specialDevices.sort((a, b) => {
      return a.Spec_Device_Name > b.Spec_Device_Name ? 1 : -1;
    });
    foodAllergy = foodAllergy.sort((a, b) => {
      return a.Allergy_Name > b.Allergy_Name ? 1 : -1;
    });
    return(
      <Modal
        visible={isModal}
        title="Edit Patient"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={onModalOpen}
        onOk={updatePatient}
        width={"98%"}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout} className="pt-19">
          <Form.Item label="First Name">
              <Input autoFocus={true} name="FirstName" value={patientDetails.FirstName} onChange={onRecordChange}/>
          </Form.Item>
          <Form.Item label="LastName">
            <Input name="LastName" value={patientDetails.LastName} onChange={onRecordChange}/>
          </Form.Item>
          <Form.Item label="Location">
            <Input name="L_Location" value={patientDetails.L_Location} onChange={onRecordChange}/>
          </Form.Item>
          <Form.Item label="Admit Date">
            <DatePicker  onChange={onDateChange} style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group name="Gender" defaultValue={patientDetails.Gender} onChange={onRecordChange}>
              <Radio value="M">Male</Radio>
              <Radio value="F">Female</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Doctor">
            <Input name="Doc_Name" value={patientDetails.Doc_Name} onChange={onRecordChange}/>
          </Form.Item>
          <Form.Item label="Diet Order">
            <Row>
            {
              (dietNames || []).map((x)=> {
                let displayName = (dietTypes || []).find((y) => y.PKey_Diet_Type === x.value);
                return (
                  <Col md="3" sm="12" lg="2" className="pr-0 d-flex">
                    <DropDownBox
                      style={{width: 240, ...x.style}}
                      ref={this.widgetRefdep}
                      value={displayName && displayName.Name}
                      valueExpr={x.name}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item && item.Name }`}
                      placeholder={'Select a value...'}
                      dataSource={dietTypes}
                      defaultOpened={false}
                      contentRender={(record)=>{
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={dietTypes}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onChangeDietType(x.name, record)}
                            height={'100%'}>
                            <Selection mode={'single'} />
                            <Scrolling mode={'infinite'} />
                            <Paging enabled={true} pageSize={10} />
                            <Column caption={'Name'} dataField={'Name'} width={"65%"}/>
                            <Column caption={'In Mc'} dataField={'InMenuCycle'} width={"35%"}/>
                          </CustomGrid>
                        )
                      }}
                    />
                    {x.value ? <span><Icon style={{color: "red"}} type="close" onClick={()=> onClearSelect(x.name, '')}/></span> : null}
                  </Col>
                )
              })
            }
            </Row>
          </Form.Item>
          <Form.Item label="Consistency">
            <Row>
              {
                (consistencyNames || []).map((x)=> {
                  let displayName = (consistency || []).find((y) => y.PKey_Consist === x.value);
                  return (
                    <Col md="3" sm="12" lg="2" className="pr-0 d-flex">
                      <DropDownBox
                        ref={this.widgetRef}
                        style={{width: 240, ...x.style}}
                        value={displayName && displayName.Name}
                        valueExpr={x.name}
                        deferRendering={false}
                        displayExpr={(item) => item && `${item && item.Name }`}
                        placeholder={'Select a value...'}
                        dataSource={consistency}
                        defaultOpened={false}
                        contentRender={(record)=>{
                          return (
                            <CustomGrid
                              refCallback={(dg) => this.dg = dg}
                              dataSource={consistency}
                              hoverStateEnabled={true}
                              onSelectionChanged={(record) => this.onChangeConsistency(x.name, record)}
                              height={'100%'}>
                              <Selection mode={'single'} />
                              <Scrolling mode={'infinite'} />
                              <Paging enabled={true} pageSize={10} />
                              <Column caption={'Name'} dataField={'Name'} width={"65%"}/>
                              <Column caption={'In Mc'} dataField={'InMenuCycle'} width={"33%"}/>
                            </CustomGrid>
                          )
                        }}
                      />
                      {x.value ? <span><Icon style={{color: "red"}} type="close" onClick={()=> onClearSelect(x.name, '')}/></span> : null}
                    </Col>
                  )
                })
              }
            </Row>
          </Form.Item>
          <Form.Item label="Special Devices">
            <Row>
            {
              (specialDeviceList || []).map((x)=> {
                const menu = (
                  <Menu>
                    <Menu.Item>
                      <Checkbox>(Select All)</Checkbox>
                    </Menu.Item>
                    <Menu.Item>
                      <Checkbox>Breakfast</Checkbox>
                    </Menu.Item>
                    <Menu.Item>
                      <Checkbox>Lunch</Checkbox>
                    </Menu.Item>
                    <Menu.Item>
                      <Checkbox>Dinner</Checkbox>
                    </Menu.Item>
                    <hr/>
                    <Menu.Item>
                      <Button size="small" className="mr-5">Ok</Button>
                      <Button size="small">Cancel</Button>
                    </Menu.Item>
                  </Menu>
                );
                let displayName = (specialDevices || []).find((y) => y.PKEY_Spec_Devices === x.value);
                return (
                  <Col md="3" sm="12" lg="2" className="pr-0 d-flex">
                    <DropDownBox
                      ref={this.widgetRef}
                      style={{width: 240}}
                      value={displayName && displayName.Spec_Device_Name}
                      valueExpr={x.name}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item && item.Spec_Device_Name }`}
                      placeholder={'Select a value...'}
                      dataSource={specialDevices}
                      defaultOpened={false}
                      contentRender={(record)=>{
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={specialDevices}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onChangeSpecialDevice(x.name, record)}
                            height={'100%'}>
                            <Selection mode={'single'} />
                            <Scrolling mode={'infinite'} />
                            <Paging enabled={true} pageSize={10} />
                            <Column caption={'Name'} dataField={'Spec_Device_Name'}/>
                          </CustomGrid>
                        )
                      }}
                    />
                    {x.value ? <span><Icon style={{color: "red"}} type="close" onClick={()=> onClearPatientDetails(x.name, '')}/></span> : null}
                    <Dropdown overlay={menu} trigger={['click']} className="mr-10">
                      <Icon type="check" className="mt-10 ml-5"/>
                    </Dropdown>
                  </Col>
                )
              })
            }
            </Row>
          </Form.Item>
          <Form.Item label="Food Allergies">
            <Row>
              {
                (foodAllergyList || []).map((x)=> {
                  let displayName = (foodAllergy || []).find((y) => y.PKEY_Food_Allergy === x.value);
                  return (
                    <Col md="3" sm="12" lg="2" className="pr-0 d-flex">
                      <DropDownBox
                        ref={this.widgetRef}
                        style={{width: 240}}
                        value={displayName && displayName.Allergy_Name}
                        valueExpr={x.name}
                        deferRendering={false}
                        displayExpr={(item) => item && `${item && item.Allergy_Name }`}
                        placeholder={'Select a value...'}
                        dataSource={foodAllergy}
                        defaultOpened={false}
                        contentRender={(record)=>{
                          return (
                            <CustomGrid
                              refCallback={(dg) => this.dg = dg}
                              dataSource={foodAllergy}
                              hoverStateEnabled={true}
                              onSelectionChanged={(record) => this.onChangeFoodAllergy(x.name, record)}
                              height={'100%'}>
                              <Selection mode={'single'} />
                              <Scrolling mode={'infinite'} />
                              <Paging enabled={true} pageSize={10} />
                              <Column caption={'Name'} dataField={'Allergy_Name'}/>
                            </CustomGrid>
                          )
                        }}
                      />
                      {x.value ? <span><Icon style={{color: "red"}} type="close" onClick={()=> onClearPatientDetails(x.name, '')}/></span> : null}
                    </Col>
                  )
                })
              }
            </Row>
          </Form.Item>
          <Form.Item label="special Needs">
            {
              (specialNeeds || []).map((x)=> {
                const checked = specialNeed.some(y => y.FKey_Special_Needs === x.PKey_Special_Needs);
                return (
                  <Checkbox onChange={(event) => this.onSpecialNeedChange(event.target.checked, x.PKey_Special_Needs)} value={x.PKey_Special_Needs} checked={checked}>{x.Name}</Checkbox>
                )
              })
            }
          </Form.Item>
        </Form>
      </Modal>
    )
  }
}

export default UpdatePatientModal
