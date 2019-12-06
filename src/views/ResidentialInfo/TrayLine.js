import React, {Component} from "react";
import "./index.scss";
import {Card, CardBody, CardHeader, Col, Row} from "reactstrap";
import Loader from "../Common/Loader";
import {Button, Modal, Select, Input, Form} from "antd";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import CustomGrid from "../../components/CustomGrid";
import {ApiService} from "../../services/ApiService";
import {DropDownBox} from "devextreme-react";

const {Option} = Select

class TrayLine extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      breakList: [],
      dinnerList: [],
      lunchList: [],
      isModal: false,
      loading: true,
      breakFast: null,
      lunch: null,
      dinner: null,
    }
  }


  async componentDidMount() {
    this.onSetList()
  }

  onSetList = () => {
    const { breakList, dinnerList, lunchList } = this.state;
    const { facilityKey, facilitiesData } = this.props;
    const data = facilitiesData && facilitiesData.length && facilitiesData.find(f => f.PKey_Facility === parseInt(facilityKey));
    let i;
    for (i = 0; i <= data.Break_Sets; i++)
    {
      breakList.push({value: i})
    }
    let j;
    for (j = 0; j <= data.Lunch_Sets; j++)
    {
      lunchList.push({value: j})
    }
    let k;
    for (k = 0; k <= data.Dinner_Sets; k++)
    {
      dinnerList.push({value: k})
    }

    this.setState({
      breakList,
      dinnerList,
      lunchList,
      dataList: [],
      loading: false,
      breakFast: data.Break_Sets,
      lunch: data.Lunch_Sets,
      dinner: data.Dinner_Sets
    })
  }

  onModal = () => {
    this.setState({
      loading: true,
      isModal: !this.state.isModal
    },async () => {
      if(this.state.isModal){
        let data = await this._apiService.getResidentialInfo();
        if (data.error) {
          this.setState({
            loading: false,
          });
        } else {
          data = (data || []).map((i, index) => ({
            ID: index.toString(),
            name: `${(i.FirstName || '')}, ${(i.LastName || '')}`, ...i
          }));
          data = (data || []).filter(d => !d.Discharged)
          this.setState({
            loading: false,
            dataList: data || []
          });
        }
      }
    })
  }

  onChangeBreakfast = (record) => {
    const {patientDetails} = this.props;
    patientDetails.Set_B = record.selectedRowsData[0].value;
    this.setState({
      breakFast: record.selectedRowsData[0].value
    });
    this.widgetRef.current.instance.close();
    this.props.updateState('', patientDetails)

  }

  onChangeLunch = (record) => {
    const {patientDetails} = this.props;
    patientDetails.Set_L = record.selectedRowsData[0].value;
    this.setState({
      lunch: record.selectedRowsData[0].value
    });
    this.widgetRef.current.instance.close();
    this.props.updateState('', patientDetails)

  }

  onChangeDinner = (record) => {
    const {patientDetails} = this.props;
    patientDetails.Set_D = record.selectedRowsData[0].value;
    this.setState({
      dinner: record.selectedRowsData[0].value
    });
    this.widgetRef.current.instance.close();
    this.props.updateState('', patientDetails)

  }

  render() {
    const { isModal, breakList, dinnerList, lunchList, dataList, loading, breakFast, lunch, dinner } = this.state;
    const { facilityKey, facilitiesData, patientDetails } = this.props;
    const data = facilitiesData && facilitiesData.length && facilitiesData.find(f => f.PKey_Facility === parseInt(facilityKey));
    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18},
      labelAlign: 'right'
    };
    return (
      <Col sm="12" md="3">
        <Card>
        <CardHeader>
          <b>Tray Line</b>
          <div className="pull-right">
            <Button type="primary" size="small" onClick={this.onModal}>Assign</Button>
          </div>
        </CardHeader>
        <CardBody className="pb-40">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th scope="col">Mealtime</th>
              <th scope="col">Cart/Tray</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{data && data.Break_Name}</td>
              <td>{`${(patientDetails && patientDetails).Set_B || ''} / ${(patientDetails && patientDetails).Tray_B || ''}`}</td>
            </tr>
            <tr>
              <td>{data && data.Lunch_Name}</td>
              <td>{`${(patientDetails && patientDetails).Set_L || ''} / ${(patientDetails && patientDetails).Tray_L || ''}`}</td>
            </tr>
            <tr>
              <td>{data && data.Dinner_Name}</td>
              <td>{`${(patientDetails && patientDetails.Set_D) || ''} / ${(patientDetails && patientDetails).Tray_D || ''}`}</td>
            </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
        <Modal
          visible={isModal}
          title="Tray Line Assignment For"
          onCancel={this.onModal}
          // onOk={this.onMoveOrderGuide}
          footer={[
            <Button key="submit" type="primary" >
              Save
            </Button>,
            <Button key="back" onClick={this.onModal}>
              Cancel
            </Button>,

          ]}
          width="98%"
        >
          <Form {...formItemLayout} className="pt-19">
          <Row>
            <Col sm="12" md="4">
              <Form.Item label="Breakfast Carts:">
                <DropDownBox
                  ref={this.widgetRef}
                  value={breakFast}
                  valueExpr={breakFast}
                  deferRendering={false}
                  displayExpr={(item) => item && item.value}
                  placeholder={'Select a value...'}
                  dataSource={breakList}
                  defaultOpened={false}
                  contentRender={(record)=>{
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={breakList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onChangeBreakfast(record)}
                        height={'100%'}>
                        <Selection mode={'single'} />
                        <Scrolling mode={'infinite'} />
                        <Paging enabled={true} pageSize={10} />
                        <Column alignment="left" caption={'Breakfast Carts'} dataField={'value'}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm="12" md="4">
              <Form.Item label="Lunch Carts:">
                <DropDownBox
                  ref={this.widgetRef}
                  value={lunch}
                  valueExpr={lunch}
                  deferRendering={false}
                  displayExpr={(item) => item && item.value}
                  placeholder={'Select a value...'}
                  dataSource={lunchList}
                  defaultOpened={false}
                  contentRender={(record)=>{
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={lunchList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onChangeLunch(record)}
                        height={'100%'}>
                        <Selection mode={'single'} />
                        <Scrolling mode={'infinite'} />
                        <Paging enabled={true} pageSize={10} />
                        <Column alignment="left" caption={'Lunch Carts'} dataField={'value'}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm="12" md="4">
              <Form.Item label="Supper Carts:">
                <DropDownBox
                  ref={this.widgetRef}
                  value={dinner}
                  valueExpr={dinner}
                  deferRendering={false}
                  displayExpr={(item) => item && item.value}
                  placeholder={'Select a value...'}
                  dataSource={dinnerList}
                  defaultOpened={false}
                  contentRender={(record)=>{
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={dinnerList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onChangeDinner(record)}
                        height={'100%'}>
                        <Selection mode={'single'} />
                        <Scrolling mode={'infinite'} />
                        <Paging enabled={true} pageSize={10} />
                        <Column alignment="left" caption={'Supper Carts'} dataField={'value'}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm="12" md="4">
              <Form.Item label="Location:">
                <Input autoFocus={true} size="small" name="FirstName"/>
              </Form.Item>
            </Col>
            <Col sm="12" md="4">
              <Form.Item label="Location:">
                <Input autoFocus={true} size="small" name="FirstName"/>
              </Form.Item>
            </Col>
            <Col sm="12" md="4">
              <Form.Item label="Location:">
                <Input autoFocus={true} size="small" name="FirstName"/>
              </Form.Item>
            </Col>
          </Row>
          </Form>
          { loading ? <Loader/> :
            <Row>
              <Col sm="12" md="4">
                <CustomGrid
                  className={'dx-card wide-card'}
                  refCallback={(dg) => this.dg = dg}
                  dataSource={(data && data.Break_Sets) === 0 ? [] : dataList}
                  showBorders={true}
                  focusedRowEnabled={true}
                  columnAutoWidth={false}
                  keyExpr="PKey_Patient"
                  columnHidingEnabled={false}
                  gridClass="common-height"
                >
                  <Column caption={'Floor'} dataField={'Floor'} width={"15%"}/>
                  <Column caption={'Wing'} dataField={'Wing'} width={"15%"}/>
                  <Column caption={'Room_No'} dataField={'Room_No'} width={"15%"}/>
                  <Column caption={'Assigned Residents'} cellRender={(record) => {
                    return(
                      <span>{`${record.data.FirstName} ${record.data.LastName}`}</span>
                    )
                  }} width={"40%"}/>
                  <Column caption={'T'} dataField={'Tray_B'} width={"15%"} sortOrder={'asc'}/>
                </CustomGrid>
              </Col>
              <Col sm="12" md="4">
                <CustomGrid
                  className={'dx-card wide-card'}
                  refCallback={(dg) => this.dg = dg}
                  dataSource={(data && data.Lunch_Sets) === 0 ? [] : dataList}
                  showBorders={true}
                  focusedRowEnabled={true}
                  columnAutoWidth={false}
                  keyExpr="PKey_Patient"
                  columnHidingEnabled={false}
                  gridClass="common-height"
                >
                  <Column caption={'Floor'} dataField={'Floor'} width={"15%"}/>
                  <Column caption={'Wing'} dataField={'Wing'} width={"15%"}/>
                  <Column caption={'Room_No'} dataField={'Room_No'} width={"15%"}/>
                  <Column caption={'Assigned Residents'}  cellRender={(record) => {
                    return(
                      <span>{`${record.data.FirstName} ${record.data.LastName}`}</span>
                    )
                  }} width={"40%"}/>
                  <Column caption={'T'} dataField={'Tray_L'} width={"15%"} sortOrder={'asc'}/>
                </CustomGrid>
              </Col>
              <Col sm="12" md="4">
                <CustomGrid
                  className={'dx-card wide-card'}
                  refCallback={(dg) => this.dg = dg}
                  dataSource={(data && data.Dinner_Sets) === 0 ? [] : dataList}
                  showBorders={true}
                  focusedRowEnabled={true}
                  columnAutoWidth={false}
                  keyExpr="PKey_Patient"
                  columnHidingEnabled={false}
                  gridClass="common-height"
                >
                  <Column caption={'Floor'} dataField={'Floor'} width={"15%"}/>
                  <Column caption={'Wing'} dataField={'Wing'} width={"15%"}/>
                  <Column caption={'Room_No'} dataField={'Room_No'} width={"15%"}/>
                  <Column caption={'Assigned Residents'} cellRender={(record) => {
                    return(
                      <span>{`${record.data.FirstName} ${record.data.LastName}`}</span>
                    )
                  }} width={"40%"}/>
                  <Column caption={'T'} dataField={'Tray_D'} width={"15%"} sortOrder={'asc'}/>
                </CustomGrid>
              </Col>
            </Row>
          }
        </Modal>
      </Col>
    )
  }

}

export default TrayLine;
