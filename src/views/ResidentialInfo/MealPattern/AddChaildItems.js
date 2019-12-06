import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, Modal, Spin, Tabs,} from "antd";
import {Row, Col} from "reactstrap"
import TabsComp from "../../../components/TabsComp";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Grouping, GroupPanel, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";
const TabPane = Tabs.TabPane;

class AddChildItems extends Component {
  _apiService = new ApiService();

  constructor(props){
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      activeTab: '',
    }
  }
  onTabChange = (activeTab) => {
    this.setState({
      activeTab,
    })
  }

  onSelectionChanged = (record) => {
    this.widgetRef.current.instance.close();
  }

  general = () => {
    const {mealTimes, menuCategories, itemSizes, consistency, itemTypes, portions, serviceItems, foodGroups, items} = this.props;
    const itemSize = (itemSizes || []).filter(x => x.Itm_Size);
    const menuOption = [{pKeyMenu: 1, Name: 'Stander'},{pKeyMenu: 2, Name: 'Add to Menu'},];
    return(
      <Row>
        <Col md={6} sm={12}>
          <Form.Item label="Mealtime">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'pKey'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.mealTime }`}
              placeholder={'Select a value...'}
              dataSource={mealTimes}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={mealTimes}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'mealTime'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Chargeable</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Menu category">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Prd_Menu_Category'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={menuCategories}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={menuCategories}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Chargeable Label</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Item">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Prd_Menu_Category'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={items}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={items}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}/>
        <Col md={6} sm={12}>
          <Form.Item label="Item Size">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Itm_Size'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Itm_Size }`}
              placeholder={'Select a value...'}
              dataSource={itemSize}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={itemSize}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Size'} dataField={'Itm_Size'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Med Pass</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Consistency">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Consist'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={consistency}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={consistency}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Nourishment Label</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Item Type">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Item_Prd_ItemType'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={itemTypes}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={itemTypes}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}/>

        <Col md={6} sm={12}>
          <Form.Item label="Portion">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Prd_Portion'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={portions}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={portions}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            Notes
            <hr/>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Service Item">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Prd_Service_Item'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={serviceItems}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={serviceItems}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Input/>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Menu Options">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'pKeyMenu'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={menuOption}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={menuOption}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}/>
        <Col md={6} sm={12}>
          <Form.Item label="Food Group">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'PKey_Prd_Food_Group'}
              deferRendering={false}
              displayExpr={(item) => item && `${item.Name }`}
              placeholder={'Select a value...'}
              dataSource={foodGroups}
              contentRender={(record)=>{
                return (
                  <CustomGrid
                    refCallback={(dg) => this.dg = dg}
                    dataSource={foodGroups}
                    hoverStateEnabled={true}
                    onSelectionChanged={(record) => this.onSelectionChanged(record)}
                    height={'100%'}>
                    <Selection mode={'single'} />
                    <Scrolling mode={'infinite'} />
                    <Paging enabled={true} pageSize={10} />
                    <Column caption={'Name'} dataField={'Name'}/>
                  </CustomGrid>
                )
              }}
            />
          </Form.Item>
        </Col>
        <Col md={6} sm={12}/>
        <Col md={6} sm={12}/>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Inactive</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    )
  }

  render() {
    const {isChildItem, isSaving, onToggleChildItems} = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelAlign: 'left'
    };
    return(
      <Modal
        visible={isChildItem}
        title="Add a Meal Pattern Child Items"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={onToggleChildItems}
        onOk={onToggleChildItems}
        width={"55%"}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <Row>
          <Col md={12} sm={12}>
            <TabsComp defaultActiveKey='general' animated={false}>
              <TabPane tab="General" key={'general'}>
                <Form {...formItemLayout}>
                  {this.general()}
                </Form>
              </TabPane>
              <TabPane tab="Days" key={'days'}>
                <Form>
                  <Row>
                    <Col md={12} sm={12}>
                      <Form.Item>
                        <Checkbox>Active Days</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <hr/>
                  <Row>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Monday</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Tuesday</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Wednesday</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Thursday</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Friday</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Saturday</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col md={2} sm={12}>
                      <Form.Item>
                        <Checkbox>Sunday</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </TabPane>
            </TabsComp>
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default AddChildItems
