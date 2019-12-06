import React, {Component} from "react";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row} from "reactstrap";
import {Checkbox, message} from "antd";
import {getSettings} from "../../services/common";

class AdminSettings extends Component {
  state = {
    signalRUrl: getSettings('signalRUrl'),
    signalRMethod: getSettings('signalRMethod'),
    api: getSettings('apiEndPoint'),
    reportsApi: getSettings('reportsApiEndPoint'),
    logoText: getSettings('logoText'),
    copyRightText: getSettings('copyRightText'),
    supportUrl: getSettings('supportUrl'),
    isShowHiddenFeatures: getSettings('isShowHiddenFeatures') ? true : false,
  }

  saveItems = () => {
    const {signalRMethod, signalRUrl, api, reportsApi} = this.state;
    localStorage.setItem('signalRMethod', signalRMethod);
    localStorage.setItem('signalRUrl', signalRUrl);
    localStorage.setItem('apiEndPoint', api);
    localStorage.setItem('reportsApiEndPoint', reportsApi);
    message.success('Items Saved Successfully', 2, () => window.location.reload());
  }

  saveWhiteLabels = () => {
    const {logoText, copyRightText, supportUrl} = this.state;
    localStorage.setItem('logoText', logoText);
    localStorage.setItem('copyRightText', copyRightText);
    localStorage.setItem('supportUrl', supportUrl);
    message.success('Items Saved Successfully', 2, () => window.location.reload());
  }

  saveHiddenFeatures = () => {
    const {isShowHiddenFeatures} = this.state;
    if (isShowHiddenFeatures) {
      localStorage.setItem('isShowHiddenFeatures', 'true');
    } else {
      localStorage.removeItem('isShowHiddenFeatures');
    }
    window.location.reload()
  }

  onCheckboxChange = (e) => {
    this.setState({
      isShowHiddenFeatures: e.target.checked
    })
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    const {signalRUrl, signalRMethod, api, logoText, copyRightText, supportUrl, reportsApi, isShowHiddenFeatures} = this.state;
    return (
      <div className="animated fadeIn page-view pt-20">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardHeader>SignalR Settings</CardHeader>
              <CardBody>
                  <FormGroup>
                    <Label for="exampleEmail">SingalR URL</Label>
                    <Input type="text" value={signalRUrl} name="signalRUrl" onChange={this.onChange} placeholder="SignalR URL" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleEmail">SingalR Method</Label>
                    <Input type="text" value={signalRMethod} name="signalRMethod" onChange={this.onChange} placeholder="SignalR Connection Name" />
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleEmail">Api Endpoint</Label>
                    <Input type="text" name="api" value={api} placeholder="Api Endpoint" onChange={this.onChange} />
                  </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Reports Api Endpoint</Label>
                  <Input type="text" name="reportsApi" value={reportsApi} placeholder="Api Endpoint" onChange={this.onChange} />
                </FormGroup>
                  <Button color="primary" onClick={this.saveItems}>Submit</Button>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>White Label Settings</CardHeader>
              <CardBody>
                <FormGroup>
                  <Label for="exampleEmail">Logo text</Label>
                  <Input type="text" value={logoText} name="logoText" onChange={this.onChange} placeholder="Logo text" />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Copyright Text</Label>
                  <Input type="text" value={copyRightText} name="copyRightText" onChange={this.onChange} placeholder="Copyright Text" />
                </FormGroup>
                <FormGroup>
                  <Label for="exampleEmail">Support URL</Label>
                  <Input type="text" name="supportUrl" value={supportUrl} placeholder="Support Url" onChange={this.onChange} />
                </FormGroup>
                <Button color="primary" onClick={this.saveWhiteLabels}>Submit</Button>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>Hidden Features</CardHeader>
              <CardBody>
                <FormGroup>
                  <Checkbox checked={isShowHiddenFeatures} onChange={this.onCheckboxChange}>show hidden features</Checkbox>
                </FormGroup>
                <Button color="primary" onClick={this.saveHiddenFeatures}>Submit</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
export default AdminSettings;
