import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Row, Col} from "reactstrap"
import CustomGrid from "../../../components/CustomGrid";
import {Column,} from "devextreme-react/data-grid";
import {Chart} from "devextreme-react";
import moment from "moment";
import {dateFormat, max} from "../../../services/common";
import {ArgumentAxis, CommonSeriesSettings, Font, Grid, Label, Legend, Margin, Series, Title, ValueAxis} from "devextreme-react/chart";
import {DatePicker, Spin, Form, Input, message, Modal, Menu, Dropdown} from "antd";
import clonedeep from "lodash.clonedeep";
const { TextArea } = Input;

class Weights extends Component {
  _apiService = new ApiService();
    state = {
      isWeight: false,
      isSaving: false,
      weightsList: [],
      Weight_Date: null,
      Weight: '',
      Note: '',
      PKey_Weight: '',
      FKey_Patient: '',
      selectedRecord: null
    }

  async componentDidMount() {
    this.getPatientWeights();
  }

  getPatientWeights = async () => {
    const {patientId} = this.props;
    const data = await this._apiService.getPatientWeights(patientId);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        weightsList: data
      })
    }
  }

  onToggleWeight = () => {
      this.setState({
        isWeight: !this.state.isWeight
      })
  }

  onChange = (event) => {
    if(event && event.target){
      this.setState({
        [event.target.name]: event.target.value
      })
    } else {
      this.setState({
        Weight_Date: (event && event._d) || null
      })
    }
  }

  onWeightUpload = async () => {
      this.setState({
        isSaving: true
      });
    const {patientId} = this.props;
    const {Weight_Date, Weight, Note, PKey_Weight, FKey_Patient, weightsList, selectedRecord} = this.state;
    const payload = {
      ...selectedRecord,
      PKey_Weight: PKey_Weight ? PKey_Weight : 1,
      FKey_Patient: FKey_Patient ? FKey_Patient : Number(patientId),
      Weight_Date,
      Weight,
      Note,
    }

    const data = await this._apiService.postPatientWeight(patientId, payload)
    if(!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      });
    }else {
      message.success('Weight Added Successfully');
      const Index = weightsList.findIndex(x => x.PKey_Weight === payload.PKey_Weight)
      if(Index > -1){
        weightsList[Index] = payload
      }
      this.setState({
        isWeight: false,
        weightsList,
        Weight_Date: null,
        Weight: '',
        Note: '',
        PKey_Weight: null,
        FKey_Patient: null,
        selectedRecord: null,
        isSaving: false
      })
    }
    this.refreshGrid()
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      PKey_Weight: selectedRecord.PKey_Weight,
      FKey_Patient: selectedRecord.FKey_Patient,
      Weight_Date: moment(selectedRecord.Weight_Date).format(dateFormat),
      Weight: selectedRecord.Weight,
      Note: selectedRecord.Note,
      isWeight: true
    })
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  deletePatientWeight = async (selectedRecord) => {
    const data = await this._apiService.deletePatientWeight(selectedRecord.FKey_Patient,selectedRecord.PKey_Weight)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Weight Deleted Successfully');
      const {weightsList} = this.state;
      this.setState({
        weightsList: weightsList.filter(x => x.PKey_Weight !== selectedRecord.PKey_Weight)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  render() {
    const {weightsList, Weight_Date, Weight, Note, isSaving} = this.state;
    const {isWeight} = this.state;
    const daysList = weightsList.map(x => x.Date_Diff);
    const maxValue = max(daysList);
    const diff  = (maxValue) % 30;
    const maxAxisValue = (30 - diff) + maxValue;
    const formItemLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
      labelAlign: 'left'
    };
    return(
      <Row>
        <Col xs="5" sm="12" lg="5">
          <CustomGrid
            refCallback={(dg) => this.dg = dg}
            dataSource={weightsList}
            columnAutoWidth={false}
            keyExpr="PKey_Weight"
          >
            <Column alignment="left" caption={'Date'} dataField={'Weight_Date'} dataType={"date"}/>
            <Column alignment="left" caption={'Date Diff'} dataField={'Date_Diff'} dataType={"date"}/>
            <Column alignment="left" caption={'Weight'} dataField={'Weight'}/>
            <Column alignment="left" caption={'Weight Diff'} dataField={'Weight_Diff'}/>
            <Column alignment="left" caption={'BMI'} dataField={'BMI'}/>
            <Column alignment="left" headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleWeight}>New</span>} cellRender={(record) => {
              const menu = (
                <Menu>
                  <Menu.Item onClick={() => this.deletePatientWeight(record.data)}>
                    <span className="text-primary ml-5 cursor-pointer">Delete</span>
                  </Menu.Item>
                </Menu>
              );
              return(
                <div className="flex-align-item-center cursor-pointer">
                  <span className="text-primary mr-5" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                  <Dropdown overlay={menu} trigger={['click']}>
                    <i className="icon-options-vertical text-primary cursor-pointer" />
                  </Dropdown>
                </div>
              )
            }}/>
          </CustomGrid>
        </Col>
        <Col xs="7" sm="12" lg="7">
          <Chart palette={'Violet'} dataSource={weightsList}>
            <CommonSeriesSettings argumentField={'Date_Diff'} type={this.state.type}/>
            <Series key={"Weight"} valueField={"Weight"} />
            <Margin bottom={20} />
            <ArgumentAxis tickInterval={30} min={0} max={maxAxisValue} valueMarginsEnabled={false} discreteAxisDivisionMode={'crossLabels'}>
              <Grid visible={true} />
            </ArgumentAxis>
            <ValueAxis>
              <Title text={'Weights'}>
                <Font color={'#111111'}/>
              </Title>
            </ValueAxis>
            <Legend visible={false}/>
          </Chart>
          <Chart palette={'Violet'} dataSource={weightsList}>
            <CommonSeriesSettings argumentField={'Date_Diff'} type={this.state.type}/>
            <Series key={"PercentageChangeAbsolute"} valueField={"PercentageChangeAbsolute"} />
            <ValueAxis>
              <Title text={'Abs Percent Change'}>
                <Font color={'#111111'} size={18}/>
              </Title>
              <Label format={{formatter: function (value) {return `${value}%`}}}/>
            </ValueAxis>
            <Margin bottom={20} />
            <ArgumentAxis tickInterval={30} min={0} max={maxAxisValue} valueMarginsEnabled={false} discreteAxisDivisionMode={'crossLabels'}>
              <Grid visible={true} />
            </ArgumentAxis>
            <Legend visible={false}/>
          </Chart>
        </Col>
        <Modal
          visible={isWeight}
          title="Add a New Weight"
          okText={isSaving ?  <Spin className="white" size={"small"}/> : 'Save'}
          onCancel={this.onToggleWeight}
          onOk={this.onWeightUpload}
          cancelButtonProps={{className: 'pull-right ml-10'}}
        >
          <Form {...formItemLayout}>
            <Row>
              <Col md={12} sm={12}>
                <Form.Item label="Date">
                 <DatePicker onChange={this.onChange} format={dateFormat} value={Weight_Date ? moment(Weight_Date) : null} name="Weight_Date"/>
                </Form.Item>
                <Form.Item label="Weight">
                  <Input type="number" onChange={this.onChange} value={Weight} name="Weight"/>
                </Form.Item>
                <Form.Item label="Notes">
                  <TextArea rows={2} onChange={this.onChange} value={Note} name="Note"/>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Row>
    )
  }
}

export default Weights
