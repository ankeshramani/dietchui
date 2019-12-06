import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Row, Col} from "reactstrap"
import {Checkbox, DatePicker, Form, Modal, Tabs, Icon, Spin} from "antd";
import TabsComp from "../../../components/TabsComp";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";
import {dateFormat} from "../../../services/common";
import moment from "moment";
const TabPane = Tabs.TabPane;

class AddNewAdjustment extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      fields: this.props.fields,
    }

  }

  onSelectionChanged = (record, field, key) => {
    const { fields } = this.state
    fields[key] = record && record.selectedRowsData && record.selectedRowsData[0] && record.selectedRowsData[0][field]
    this.setState({
      [key]:  record && record.selectedRowsData && record.selectedRowsData[0] && record.selectedRowsData[0].Name,
      ...fields
    }, () => {
      this.props.updateState(fields)
    });

    this.widgetRef.current.instance.close();
  }

  onCheckBoxChange = (event) => {
    const { fields } = this.state
    fields[event.target.name] = event.target.value
    this.setState({
      ...fields
    },() => {
      this.props.updateState(fields)
    });
  }

  onDatePickerChange = (name, date, dateString) => {
    const {fields} = this.state;
    fields[name] = dateString;
    this.setState({
      ...fields,
    },() => {
      this.props.updateState(fields)
    });
  }

  render() {
    const {Reason, Type, FKey_Prd_Food_Group, ActionType, fields} = this.state;
    const {isAdjustment, onToggleAdjustment, foodGroups, postPatientAdjustments, isSaving} = this.props;
    const reason = [{pkey: 1, Name: "Res choice"}, {pkey: 2, Name: "Pre scriber"}];
    const type = [{pkey: 1, Name: "Allergy Group"}, {pkey: 2, Name: "Food Group"}, {pkey: 3, Name: "Item"}, {pkey: 4, Name: "Mealtime"}, {pkey: 4, Name: "Menu Category"}];
    const action = [{pkey: 1, Name: "Never Sever"}, {pkey: 2, Name: "Never Sever When"}, {pkey: 3, Name: "Next Available"}, {pkey: 4, Name: "Replace With"}];
    const days = [
      {
        PKEY_MEAL_PATTERN: 1,
        m: true,
        t: true,
        w: true,
        r: true,
        f: true,
        s: true,
        u: true,
        week: true,
        groupBy: 'BreakFast'
      },
      {
        PKEY_MEAL_PATTERN: 2,
        menuCategory: 'Category 1',
        m: true,
        t: true,
        w: true,
        r: true,
        f: true,
        s: true,
        u: true,
        week: true,
        groupBy: 'Lunch'
      },
      {
        PKEY_MEAL_PATTERN: 3,
        m: true,
        t: true,
        w: true,
        r: true,
        f: true,
        s: true,
        u: true,
        week: true,
        groupBy: 'Supper'
      },
  ]
    const formItemLayout = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isAdjustment}
        title="Add a New Adjustments"
        okText={isSaving ? <Spin className="white" size="small"/>: 'Save'}
        onCancel={onToggleAdjustment}
        onOk={postPatientAdjustments}
        width={530}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <TabsComp defaultActiveKey='adjustment' animated={false}>
          <TabPane tab="Adjustment" key={'adjustment'}>
            <Form {...formItemLayout}>
              <Row>
                <Col md={12} sm={12}>
                  <Form.Item label="Reason">
                    <DropDownBox
                      ref={this.widgetRef}
                      value={Reason}
                      valueExpr={'pkey'}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item.Name}`}
                      placeholder={'Select a value...'}
                      dataSource={reason}
                      contentRender={(record) => {
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={reason}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onSelectionChanged(record, "pkey", "Reason")}
                            height={'100%'}>
                            <Selection mode={'single'}/>
                            <Scrolling mode={'infinite'}/>
                            <Paging enabled={true} pageSize={10}/>
                            <Column caption={'Name'} dataField={'Name'}/>
                          </CustomGrid>
                        )
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Item label="Type">
                    <DropDownBox
                      ref={this.widgetRef}
                      value={Type}
                      valueExpr={'pkey'}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item.Name}`}
                      placeholder={'Select a value...'}
                      dataSource={type}
                      contentRender={(record) => {
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={type}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onSelectionChanged(record, "pkey", "Type")}
                            height={'100%'}>
                            <Selection mode={'single'}/>
                            <Scrolling mode={'infinite'}/>
                            <Paging enabled={true} pageSize={10}/>
                            <Column caption={'Name'} dataField={'Name'}/>
                          </CustomGrid>
                        )
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Item label="Food Group">
                    <DropDownBox
                      ref={this.widgetRef}
                      value={FKey_Prd_Food_Group}
                      valueExpr={'PKey_Prd_Food_Group'}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item.Name}`}
                      placeholder={'Select a value...'}
                      dataSource={foodGroups}
                      contentRender={(record) => {
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={foodGroups}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onSelectionChanged(record, "PKey_Prd_Food_Group", "FKey_Prd_Food_Group")}
                            height={'100%'}>
                            <Selection mode={'single'}/>
                            <Scrolling mode={'infinite'}/>
                            <Paging enabled={true} pageSize={10}/>
                            <Column caption={'Name'} dataField={'Name'}/>
                          </CustomGrid>
                        )
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Item label="Action">
                    <DropDownBox
                      ref={this.widgetRef}
                      value={ActionType}
                      valueExpr={'pkey'}
                      deferRendering={false}
                      displayExpr={(item) => item && `${item.Name}`}
                      placeholder={'Select a value...'}
                      dataSource={action}
                      contentRender={(record) => {
                        return (
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={action}
                            hoverStateEnabled={true}
                            onSelectionChanged={(record) => this.onSelectionChanged(record, "pkey", "ActionType")}
                            height={'100%'}>
                            <Selection mode={'single'}/>
                            <Scrolling mode={'infinite'}/>
                            <Paging enabled={true} pageSize={10}/>
                            <Column caption={'Name'} dataField={'Name'}/>
                          </CustomGrid>
                        )
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Item label="Mealtime">
                    <Row>
                      <Col md={4}>
                        <Checkbox>Breakfast</Checkbox>
                      </Col>
                      <Col md={4}>
                        <Checkbox>Lunch</Checkbox>
                      </Col>
                      <Col md={4}>
                        <Checkbox>Supper</Checkbox>
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
                <Col md={12} sm={12}>
                  <Form.Item>
                    <Checkbox onChange={(event) => this.onCheckBoxChange({target: {name: 'Inactive', value: event.target.checked}})} >Inactive</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </TabPane>
          <TabPane tab="Days" key={'day'}>
            <Row>
              <Col md={12} sm={12}>
                <CustomGrid
                  refCallback={(dg) => this.dg = dg}
                  dataSource={days || []}
                  columnAutoWidth={false}
                  keyExpr="PKEY_MEAL_PATTERN"
                >
                  <Column alignment="left" caption={'Mealtime'} width={'20%'} dataField={'groupBy'}/>
                  <Column alignment="left" caption={'Week'} width={'8%'} dataField={'week'}/>
                  <Column alignment="left" caption={'M'} dataField={'m'} width={'8%'}/>
                  <Column alignment="left" width={'8%'} headerCellRender={() => <Icon type="snippets" theme="twoTone" />} cellRender={() => {
                    return (<Icon type="snippets" theme="twoTone" />)
                  }} />
                  <Column alignment="left" caption={'T'} dataField={'t'} width={'8%'}/>
                  <Column alignment="left" caption={'W'} dataField={'w'} width={'8%'}/>
                  <Column alignment="left" caption={'R'} dataField={'r'} width={'8%'}/>
                  <Column alignment="left" caption={'F'} dataField={'f'} width={'8%'}/>
                  <Column alignment="left" caption={'S'} dataField={'s'} width={'8%'}/>
                  <Column alignment="left" caption={'U'} dataField={'u'} width={'8%'}/>
                </CustomGrid>
              </Col>
            </Row>
            <Row className="mt-10">
              <Col md={12} sm={12}>
                <Form {...formItemLayout}>
                  <Form.Item label="Start Date">
                    <DatePicker format={dateFormat} onChange={(date, dateString) => this.onDatePickerChange('StartDate', date, dateString)}
                                value={fields.StartDate ? moment(fields.StartDate) : null}/>
                  </Form.Item>
                  <Form.Item label="End Date">
                    <DatePicker  format={dateFormat} onChange={(date, dateString) => this.onDatePickerChange('EndDate', date, dateString)}
                                 value={fields.EndDate ? moment(fields.EndDate) : null}/>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Menu Days" key={'menuDays'}>
            <Row>
              <Col md={12} sm={12}>
                <CustomGrid
                  refCallback={(dg) => this.dg = dg}
                  dataSource={ []}
                  columnAutoWidth={false}
                  keyExpr="PKEY_MEAL_PATTERN"
                >
                  <Column alignment="left" caption={'Menu'}  dataField={'groupBy'}/>
                  <Column alignment="left" caption={'Recurring Days'}  dataField={'week'}/>
                  <Column alignment="left" caption={'Except On'} dataField={'m'}/>
                </CustomGrid>
              </Col>
            </Row>
          </TabPane>
        </TabsComp>
      </Modal>
    )
  }
}

export default AddNewAdjustment
