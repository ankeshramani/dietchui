import React, {Component} from "react";
import {Menu, Icon, Layout, message, Checkbox, Input, Select, Form, Button} from 'antd'
import {connect} from "react-redux";
import './Facility.scss'
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {getSettings} from "../../../services/common";
const { TextArea } = Input;
const {Sider} = Layout;

class FacilitySetting extends Component {
  _apiService = new ApiService();

  state = {
    Facilities: [
      {
        text: 'Purchasing',
        key: 1,
        items: [
          {
            text: 'Order',
            key: 1,
          },
        ]
      },
    ],
    selectedFacilities: 0,
    purchasingFacilityList: [],
    isFacilities: false,
    selectedRecord: {}
  }

  onClickFacilities = (selectedFacilities) => {
    this.setState({
      selectedFacilities
    })
  }

  componentDidMount() {
    this.getPurchasingFacility()
  }

  saveRecord = async () => {
    const {selectedRecord} = this.state;
    this.setState({
      isSaving: true,
    });
    const data = await this._apiService.purchasingFacility(selectedRecord)
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Facilities Settings Updated Successfully');
      this.setState({
        selectedRecord,
        isSaving: false,
      });
    }
    this.refreshGrid()

  }

  addNewRecord = async () => {
    this.setState({
      isSaving: true,
    });
    const {purchasingFacilityList = [], selectedRecord} = this.state;
    const  facilityKey = getSettings('facilityKey')
    const payload = {
      ...selectedRecord,
      FKey_Facility: facilityKey,
      FKey_Facility_SharedBids: facilityKey,
      PKey_Facility_OP: 0,
    }

    const data = await this._apiService.purchasingFacility(payload)
    if (!data || data.error) {
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Facilities Settings Added Successfully');
      payload.PKey_Facility_OP = data;
      purchasingFacilityList.push(payload);
      this.setState({
        selectedRecord: purchasingFacilityList[0],
        isFacilities: false,
        isSaving: false,
        purchasingFacilityList,
        isNew:false
      });
    }
    this.refreshGrid()
  }

  onCancelSaveRecord = () => {
    const {purchasingFacilityList = []} = this.state;
    this.setState({
      isEdit: false,
      isNew: false,
      selectedRecord: purchasingFacilityList[0]
    })
  }

  getPurchasingFacility = async () => {
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getPurchasingFacility()
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        purchasingFacilityList: data,
        selectedRecord: data,
        loading: false,
      })
    }
  }

  onSelectRecord = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord.UseDepartments = event.target.checked;
    this.setState({
      selectedRecord
    });
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord
    });
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  toggleFacilitiesModal = () => {
    this.setState({
      isFacilities: !this.state.isFacilities
    });
  }

  onEditRecord = (isEdit) => {
    this.setState({
      isEdit
    })
  }

 /* onNew = (isNew) => {
    if(isNew){
      this.setState({
        isNew,
        selectedRecord: {}
      })
    }
  }*/

  render() {
    const {Facilities, selectedFacilities, loading,isNew,  selectedRecord, isSaving, isEdit} = this.state;
    const selectedFacilitiesList = Facilities[selectedFacilities];
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      labelAlign: 'right'
    };
    return (
      <div className="animated fadeIn page-view pt-10 facility">
        {
          loading ? <Loader className="mt-50"/> :
            <div className="d-flex">
              <div className="pr-0 custom-menu">
                <p className="text-center pt-10"><b>Facilities</b></p>
                <Layout>
                  <Sider theme='light'>
                    <Menu defaultSelectedKeys={["0"]} mode="inline">
                      {
                        Facilities.map((item, i) => {
                          return <Menu.Item key={item.key} onClick={() => this.onClickFacilities(i)}>
                            <Icon type="pie-chart"/>
                            <span>{item.text}</span>
                          </Menu.Item>
                        })
                      }
                    </Menu>
                  </Sider>
                </Layout>
              </div>
              <div className="pl-0 pt-45 custom-sub-menu">
                <Layout>
                  <Sider>
                    <Menu defaultSelectedKeys={['0']} mode="inline">
                      {
                        selectedFacilitiesList && selectedFacilitiesList.items.map((item, i) => {
                          return <Menu.Item key={item.key} onClick={() => this.onClickFacilities(i)}>
                            <Icon type="pie-chart"/>
                            <span>{item.text}</span>
                          </Menu.Item>
                        })
                      }
                    </Menu>
                  </Sider>
                </Layout>
              </div>
              <div className="pt-15 px-15" style={{flex: 1}}>

                <div className="text-right mb-5">
                </div>
                  <Form {...formItemLayout}>

                    <Form.Item label="Notes">
                      <Input name={'DefaultNotes'} autoFocus={true} value={selectedRecord && selectedRecord.DefaultNotes} onChange={this.onRecordChange}/>
                    </Form.Item>
                    <Form.Item label="PO Prefix">
                       <Input name={'POPrefix'} value={selectedRecord && selectedRecord.POPrefix} onChange={this.onRecordChange}/>
                    </Form.Item>
                    <Form.Item label="Email Subject">
                       <TextArea name={'OrderGuide_EmailSubjectTemplate'} value={selectedRecord && selectedRecord.OrderGuide_EmailSubjectTemplate} onChange={this.onRecordChange}/>
                    </Form.Item>

                    <Form.Item label="Email Body">
                       <TextArea name={'OrderGuide_EmailBodyTemplate'} value={selectedRecord && selectedRecord.OrderGuide_EmailBodyTemplate} onChange={this.onRecordChange}/>
                    </Form.Item>
                    <Form.Item label="Reply to Address">
                      <Input name={'PurchasingReplyToAddress'} value={selectedRecord && selectedRecord.PurchasingReplyToAddress} onChange={this.onRecordChange}/>
                    </Form.Item>
                    <Form.Item label="Order Flow">
                      <Select
                            showSearch
                            value={selectedRecord && selectedRecord.OrderFlow}
                            style={{width: "100%"}}
                            onChange={(value) => this.onRecordChange({target: {name: 'OrderFlow', value}})}
                          >
                            <Select.Option value={1}>Straight to Invoice</Select.Option>
                            <Select.Option value={2}>PO First and then Invoice</Select.Option>
                            <Select.Option value={3}>Approval Flow</Select.Option>
                          </Select>
                    </Form.Item>
                    <Form.Item label='Use Departments ?'>
                      <Checkbox checked={selectedRecord && selectedRecord.UseDepartments}
                                onChange={(event) => this.onSelectRecord(event)}/>
                    </Form.Item>
                    <div className="pull-right">
                        <Button className="mr-5" type="primary" disabled={isSaving} onClick={this.saveRecord}>Save</Button>
                    </div>
                  </Form>
              </div>
             {/* <AddNewFacilities rowKey="PKey_Facility_OP" selectedRecord={selectedRecord} isSaving={isSaving}
                                toggleFacilitiesModal={this.toggleFacilitiesModal} addNewRecord={this.addNewRecord}
                                isFacilities={isFacilities}/>*/}
            </div>
        }
      </div>
    )
  }

}

const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});

export default connect(mapStateToProps)(FacilitySetting)
