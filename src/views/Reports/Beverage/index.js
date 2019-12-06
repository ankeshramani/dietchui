import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {DatePicker, Icon, Menu, message, Radio} from "antd";
import ReportType from "../Common/ReportType";
import {ApiService} from "../../../services/ApiService";
import {connect} from "react-redux";
import {dateFormat} from "../../../services/common";
import Loader from "../../Common/Loader";
const RadioGroup = Radio.Group;

class Beverage extends Component {
  _apiService = new ApiService();

  state = {
    loading: true,
    name: '',
    selectedReportType: '',
    sets: []
  }

  componentDidMount() {
    this.get();
  }

  get = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getTblItem(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        sets: data,
        loading: false,
      })
    }
  }

  onChange = (event) => {
    this.setState({
        [event.target.name]: event.target.value,
    });
  }

  onDateChange = () => {

  }

  getSets = () => {
    const { sets } = this.state;
    // const options = sets.map(item => ({ label: 'Apple', value: 'Apple' }));
    return (
      <select className="w-100-p">
        { sets.filter(x => x.MenuDisplayName).map(x => <option key={x.PKey_Item} value={x.PKey_Item}>{x.MenuDisplayName}</option>) }
      </select>
    );
    // return <Checkbox.Group options={options} defaultValue={['Apple']} onChange={this.onCheckBoxChange} />;
  }

  render() {
    const { selectedReportType, loading } = this.state;
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
                {
                  loading ? <Loader className="mt-50"/> :
                    <>
                      <Col xs="12" sm="12" lg="12">
                        <div>
                          <div>Report Type:</div>
                          <ReportType defaultValue={0} name="selectedReportType" className="w-100-p" onChange={this.onChange}
                                      value={selectedReportType}/>
                        </div>
                      </Col>
                      <Col xs="12" sm="12" lg="12">
                        <div className="mt-10">
                          <div>Date:</div>
                          <DatePicker format={dateFormat} onChange={this.onDateChange}/>
                        </div>
                      </Col>
                      <Col xs="12" sm="12" lg="12">
                        <div className="mt-10">
                          <div>Items:</div>
                          {this.getSets()}
                        </div>
                      </Col>
                      <Col xs="12" sm="12" lg="12">
                        <div className="mt-10">
                          <div>Order By:</div>
                          <RadioGroup>
                            <Radio value={0}>Name</Radio>
                            <Radio value={1}>Room Number</Radio>
                            <Radio value={2}>Tray Line</Radio>
                          </RadioGroup>
                        </div>
                      </Col>
                    </>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});

export default connect(mapStateToProps)(Beverage);
