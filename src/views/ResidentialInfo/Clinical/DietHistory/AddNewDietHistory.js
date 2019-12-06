import React, {Component} from "react";
import {ApiService} from "../../../../services/ApiService";
import {Row, Col} from "reactstrap"
import {DatePicker, Form, message, Modal, Spin} from "antd";
import {DropDownBox} from "devextreme-react";
import CustomGrid from "../../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {dateFormat} from "../../../../services/common";
import moment from "moment";

class AddNewDietHistory extends Component {
  _apiService = new ApiService();

  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {

    }
  }

  onChangeDietType = (name, record) => {
    let {selectedRecord} = this.props;
    selectedRecord[name] = record.selectedRowsData[0].PKey_Diet_Type;
    this.widgetRefdep.current.instance.close();
    this.props.updateState(selectedRecord)
  }

  onChangeConsistency = (name, record) => {
    let {selectedRecord} = this.props;
    selectedRecord[name] = record.selectedRowsData[0].PKey_Consist;
    this.widgetRef.current.instance.close();
    this.props.updateState(selectedRecord)
  }

  onChange = (event) => {
    let {selectedRecord} = this.props;
    selectedRecord.Change_Date = event._d;
    this.props.updateState(selectedRecord)
  }


  render() {
    const {isDietHistory, onToggleDietHistory, selectedRecord, dietTypes, consistency, dietHistoryAddOrUpdate, isSaving} = this.props;
    const {FKey_Diet_Type1, FKey_Diet_Type2, FKey_Diet_Type3, FKey_Diet_Type4, FKey_Diet_Type5, FKey_Consist1, FKey_Consist2, FKey_Consist3, FKey_Consist4, FKey_Consist5} = selectedRecord || {};
    const dietNames = [
      {
        name: 'FKey_Diet_Type1',
        value: FKey_Diet_Type1,
      },
      {
        name: 'FKey_Diet_Type2',
        value: FKey_Diet_Type2,
      },
      {
        name: 'FKey_Diet_Type3',
        value: FKey_Diet_Type3,
      },
      {
        name: 'FKey_Diet_Type4',
        value: FKey_Diet_Type4,
      },
      {
        name: 'FKey_Diet_Type5',
        value: FKey_Diet_Type5,
      },
    ];
    const consistencyNames = [
      {
        name: 'FKey_Consist1',
        value: FKey_Consist1,
      },
      {
        name: 'FKey_Consist2',
        value: FKey_Consist2,
      },
      {
        name: 'FKey_Consist3',
        value: FKey_Consist3,
      },
      {
        name: 'FKey_Consist4',
        value: FKey_Consist4,
      },
      {
        name: 'FKey_Consist5',
        value: FKey_Consist5,
      },
    ];
    const formItemLayout = {
      labelCol: {span: 4},
      wrapperCol: {span: 20},
      labelAlign: 'left'
    };
    return (
      <Modal
        visible={isDietHistory}
        title="Add a Diet Fluctuation..."
        okText={isSaving ?  <Spin className="white" size={"small"}/> : 'Save'}
        onCancel={onToggleDietHistory}
        onOk={dietHistoryAddOrUpdate}
        width={668}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Form {...formItemLayout}>
          <Form.Item label="Date">
            <DatePicker onChange={this.onChange} format={dateFormat} value={selectedRecord.Change_Date ? moment(selectedRecord.Change_Date) : null} name="Change_Date"/>
          </Form.Item>
        </Form>
        <Row>
          <Col md={6} sm={12}>
            <Form>
              <Form.Item className="text-center">
                Diet Types
              </Form.Item>
              <Form.Item>
                <Row>
                  {
                    (dietNames || []).map((x)=> {
                      let displayName = (dietTypes || []).find((y) => y.PKey_Diet_Type === x.value);
                      return (
                        <Col md="12" sm="12">
                          <DropDownBox
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
                        </Col>
                      )
                    })
                  }
                </Row>
              </Form.Item>
            </Form>
          </Col>
          <Col md={6} sm={12}>
            <Form>
              <Form.Item className="text-center">
                Consistencies
              </Form.Item>
              <Form.Item>
                <Row>
                  {
                    (consistencyNames || []).map((x)=> {
                      let displayName = (consistency || []).find((y) => y.PKey_Consist === x.value);
                      return (
                        <Col md="12" sm="12">
                          <DropDownBox
                            ref={this.widgetRef}
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
                        </Col>
                      )
                    })
                  }
                </Row>
              </Form.Item>

            </Form>
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default AddNewDietHistory
