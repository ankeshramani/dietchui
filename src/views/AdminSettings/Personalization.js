import React, {Component} from "react";
import {Card, CardBody, CardHeader, Col, FormGroup, Label, Row} from "reactstrap";
import {Radio, Select} from "antd";
import {connect} from "react-redux";
import {changeSettings} from "../../redux/actions/settings";

const colors = ['#20a8d8', '#a4b7c1', '#4dbd74', '#f86c6b', '#ffc107', '#63c2de', '#ffffff', '#f0f3f5', '#29363d', '#c2cfd6', '#151b1e', '#000000'];

const { Option } = Select;
class Personalization extends Component {

  state = {}

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleSizeChange = (e) => {
    this.props.onChangeSettings({[e.target.name]: e.target.value});
  }

  render() {
    const {tabSize, datePickerSize, theme, buttonBGColor, buttonTextColor, menuIconColor, menuTextColor, menuBGColor, menuBorderColor, sectionTextColor, sectionBGColor,
      rowHoverColor, rowHoverBGColor, deptChartColor, monthChartColor} = this.props;
    return (
      <div className="animated fadeIn page-view pt-20">
        <Row>
          <Col xs="12" sm="12" lg="12">
            {/*<Card className="no-border mb-10">*/}
              {/*<CardHeader>Grid Style</CardHeader>*/}
              {/*<CardBody>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Table size</Label>*/}
                  {/*<Radio.Group value={tableSize} className="ml-5" size="small" name="tableSize" default="default" onChange={this.handleSizeChange}>*/}
                    {/*<Radio.Button value="default">Default</Radio.Button>*/}
                    {/*<Radio.Button value="middle">Middle</Radio.Button>*/}
                    {/*<Radio.Button value="small">Small</Radio.Button>*/}
                  {/*</Radio.Group>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Is Table Bordered?</Label>*/}
                  {/*<Checkbox checked={isTableBordered} className="ml-5" onChange={(event) => this.handleSizeChange({target: {name: 'isTableBordered', value: event.target.checked}})} />*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Header color</Label>*/}
                  {/*<Select name="headerColor" value={headerColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'headerColor', value}})}>*/}
                    {/*<Option value="">Default</Option>*/}
                    {/*{*/}
                      {/*colors.map(x => <Option key={`header-color-${x}`}  value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Header BG color</Label>*/}
                  {/*<Select name="headerBGColor" value={headerBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'headerBGColor', value}})}>*/}
                    {/*<Option value="">Default</Option>*/}
                    {/*{*/}
                      {/*colors.map(x => <Option key={`header-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Body color</Label>*/}
                  {/*<Select name="bodyColor" value={bodyColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'bodyColor', value}})}>*/}
                    {/*<Option value="">Default</Option>*/}
                    {/*{*/}
                      {/*colors.map(x => <Option key={`header-body-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Body BG color</Label>*/}
                  {/*<Select name="bodyBGColor" value={bodyBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'bodyBGColor', value}})}>*/}
                    {/*<Option value="">Default</Option>*/}
                    {/*{*/}
                      {/*colors.map(x => <Option key={`body-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Even Row BG color</Label>*/}
                  {/*<Select name="evenRowBgColor" value={evenRowBgColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'evenRowBgColor', value}})}>*/}
                    {/*<Option value="">Default</Option>*/}
                    {/*{*/}
                      {/*colors.map(x => <Option key={`even-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)*/}
                    {/*}*/}
                  {/*</Select>*/}
                {/*</FormGroup>*/}
                {/*<FormGroup>*/}
                  {/*<Label for="exampleEmail">Show Filter Row?</Label>*/}
                  {/*<Checkbox checked={isShowFilterRow} className="ml-5" onChange={(event) => this.handleSizeChange({target: {name: 'isShowFilterRow', value: event.target.checked}})} />*/}
                {/*</FormGroup>*/}
              {/*</CardBody>*/}
            {/*</Card>*/}
            <Card className="no-border mb-10">
              <CardHeader>Devexpress Grid Style</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail">Row Hover BG color</Label>
                  <Select name="rowHoverBGColor" value={rowHoverBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'rowHoverBGColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`row-hover-bg-color-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Row Hover color</Label>
                  <Select name="rowHoverColor" value={rowHoverColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'rowHoverColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`row-hover-color-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="no-border mb-10">
              <CardHeader>Button Style</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail">Font color</Label>
                  <Select name="buttonTextColor" value={buttonTextColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'buttonTextColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`font-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">BG color</Label>
                  <Select name="buttonBGColor" value={buttonBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'buttonBGColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`button-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="no-border mb-10">
              <CardHeader>Menu Style</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail">Icon color</Label>
                  <Select name="menuIconColor" value={menuIconColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuIconColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`menu-icon-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Menu text color</Label>
                  <Select name="menuTextColor" value={menuTextColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuTextColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`menu-text-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">BG color</Label>
                  <Select name="menuBGColor" value={menuBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuBGColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`menu-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Border color</Label>
                  <Select name="menuBorderColor" value={menuBorderColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'menuBorderColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`border-bg-${x}`}  value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="no-border mb-10">
              <CardHeader>Other Settings</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail" className="mr-10">Tab size</Label>
                  <Radio.Group size="small" value={tabSize} name="tabSize" default="default" onChange={this.handleSizeChange}>
                    <Radio.Button value="default">Default</Radio.Button>
                    <Radio.Button value="large">Large</Radio.Button>
                    <Radio.Button value="small">Small</Radio.Button>
                  </Radio.Group>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail" className="mr-10">DatePicker size</Label>
                  <Radio.Group size="small" value={datePickerSize} name="datePickerSize" default="default" onChange={this.handleSizeChange}>
                    <Radio.Button value="large">Large</Radio.Button>
                    <Radio.Button value="default">Default</Radio.Button>
                    <Radio.Button value="small">Small</Radio.Button>
                  </Radio.Group>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail" className="mr-10">Theme</Label>
                  <Radio.Group value={theme} size="small" name="theme" default="light" onChange={this.handleSizeChange}>
                    <Radio.Button value="light">Light</Radio.Button>
                    <Radio.Button value="dark">Dark</Radio.Button>
                  </Radio.Group>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="no-border mb-10">
              <CardHeader>Font and Colors for Box sections</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail">text color</Label>
                  <Select value={sectionTextColor} name="sectionTextColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'sectionTextColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`section-text-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">BG color</Label>
                  <Select name="sectionBGColor" value={sectionBGColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'sectionBGColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`section-bg-${x}`} value={`color-${x.substr(1)}`}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
              </CardBody>
            </Card>
            <Card className="no-border mb-10">
              <CardHeader>Chart Settings</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="deptChartColor">Department invoice color</Label>
                  <Select value={deptChartColor} name="deptChartColor" placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'deptChartColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`section-text-${x}`} value={x}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label for="monthChartColor">Month invoice color</Label>
                  <Select name="monthChartColor" value={monthChartColor} placeholder="default" className="ml-5" style={{width: 150}} onChange={(value) => this.handleSizeChange({target: {name: 'monthChartColor', value}})}>
                    <Option value="">Default</Option>
                    {
                      colors.map(x => <Option key={`section-bg-${x}`} value={x}><div className={`preview-${x.substr(1)}`}>{' '}</div>{x}</Option>)
                    }
                  </Select>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  theme: state.settings.theme,
  sideBarCollapsed: state.settings.sideBarCollapsed,
  headerColor: state.settings.headerColor,
  headerBGColor: state.settings.headerBGColor,
  bodyColor: state.settings.bodyColor,
  bodyBGColor: state.settings.bodyBGColor,
  evenRowBgColor: state.settings.evenRowBgColor,
  buttonBGColor: state.settings.buttonBGColor,
  buttonTextColor: state.settings.buttonTextColor,
  menuIconColor: state.settings.menuIconColor,
  menuTextColor: state.settings.menuTextColor,
  menuBGColor: state.settings.menuBGColor,
  menuBorderColor: state.settings.menuBorderColor,
  sectionTextColor: state.settings.sectionTextColor,
  sectionBGColor: state.settings.sectionBGColor,
  datePickerSize: state.settings.datePickerSize,
  tabSize: state.settings.tabSize,
  tableSize: state.settings.tableSize,
  isTableBordered: state.settings.isTableBordered,
  isShowFilterRow: state.settings.isShowFilterRow,
  rowHoverColor: state.settings.rowHoverColor,
  rowHoverBGColor: state.settings.rowHoverBGColor,
  deptChartColor: state.settings.deptChartColor,
  monthChartColor: state.settings.monthChartColor,
});

const mapDispatchToProps = (dispatch) => ({
  onChangeSettings: (state) => {
    return dispatch(changeSettings(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Personalization)
