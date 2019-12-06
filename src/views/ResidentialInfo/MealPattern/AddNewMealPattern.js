import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Form, Input, Modal, Spin, Tabs,DatePicker} from "antd";
import {Row, Col} from "reactstrap"
import TabsComp from "../../../components/TabsComp";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Paging, Scrolling, Selection} from "devextreme-react/data-grid";
import {DropDownBox} from "devextreme-react";
import AddChildItems from "./AddChaildItems";
const TabPane = Tabs.TabPane;

class AddNewMealPattern extends Component {
  _apiService = new ApiService();

  constructor(props){
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefdep = React.createRef();
    this.state = {
      activeTab: '',
      fields: props.fields,
      isChildItem: false,
    }
  }

  onTabChange = (activeTab) => {
    this.setState({
      activeTab,
    })
  }

  onSelectionChanged = (record, valueKey, key) => {
    this.setState({
      fields: {
        ...this.state.fields,
        [key]: record && record.selectedRowsData && record.selectedRowsData[0] && record.selectedRowsData[0][valueKey]
      }
    }, () => this.widgetRef.current.instance.close())
  }

  general = () => {
    const { fields } = this.state
    const {mealTimes, menuCategories, itemSizes, consistency, itemTypes, portions, serviceItems, foodGroups, items} = this.props;
    const itemSize = (itemSizes || []).filter(x => x.Itm_Size);
    const menuOption = [{pKeyMenu: 1, Name: 'Stander'},{pKeyMenu: 2, Name: 'Add to Menu'},]
    return(
      <Row>
        <Col md={6} sm={12}>
          <Form.Item label="Mealtime">
            <DropDownBox
              ref={this.widgetRef}
              valueExpr={'pKey'}
              value={(fields && fields.Mealtime) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, "mealTime", 'Mealtime')}
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
              value={(fields && fields.menuCategory) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'menuCategory')}
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
              value={(fields && fields.item) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'item')}
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
            <Checkbox>Do Not Exclude Menu Categories</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Item Size">
            <DropDownBox
              ref={this.widgetRef}
              value={(fields && fields.size) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Itm_Size', 'size')}
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
              value={(fields && fields.consistency) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'consistency')}
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
              value={(fields && fields.itemType) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'itemType')}
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
            <Checkbox>Spacial Request</Checkbox>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item label="Portion">
            <DropDownBox
              ref={this.widgetRef}
              value={(fields && fields.portion) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'portion')}
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
              value={(fields && fields.serviceItem) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'serviceItem')}
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
              value={(fields && fields.mo) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'mo')}
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
              value={(fields && fields.foodGroups) || ""}
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
                    onSelectionChanged={(record) => this.onSelectionChanged(record, 'Name', 'foodGroups')}
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
          <Form.Item label="Check Entire Mealtime ">
            <Checkbox/>
          </Form.Item>
        </Col>
        <Col md={6} sm={12}>
          <Form.Item>
            <Checkbox>Inactive</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    )
  }

  onToggleChildItems = () => {
    this.setState({
      isChildItem : !this.state.isChildItem
    })
  }

  render() {
    const {isMealPattern, isSaving, onToggleMealPattern, mealTimes, menuCategories, itemSizes, consistency, itemTypes, portions, serviceItems, foodGroups, items} = this.props;
    const {isChildItem} = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      labelAlign: 'left'
    };
    return(
      <Modal
        visible={isMealPattern}
        title="Add a Meal Pattern Items"
        okText={isSaving ? <Spin className="white" size={"small"}/>  : 'Save'}
        onCancel={onToggleMealPattern}
        onOk={onToggleMealPattern}
        width={"60%"}
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
             <TabPane tab="Child Items" key={'childItems'}>
               <Row>
                 <Col md={12} sm={12}>
                   <CustomGrid
                     refCallback={(dg) => this.dg = dg}
                     dataSource={ []}
                     columnAutoWidth={false}
                     keyExpr="PKey_Prd_Meal_Pattern"
                   >
                     <Column alignment="left" caption={'p'} width={'5%'} dataField={'menuCategory'}/>
                     <Column alignment="left" caption={'Item'}  width={'15%'} dataField={'item'}/>
                     <Column alignment="left" caption={'Size'} width={'5%'} dataField={'size'}/>
                     <Column alignment="left" caption={'Consistency'} width={'15%'} dataField={'consistency'}/>
                     <Column alignment="left" caption={'Item Type'} width={'15%'} dataField={'itemType'}/>
                     <Column alignment="left" caption={'Portion'} width={'15%'} dataField={'portion'}/>
                     <Column alignment="left" caption={'MO'} width={'3%'} dataField={'mo'}/>
                     <Column alignment="left" caption={'M'} dataField={'m'} width={'3%'}/>
                     <Column alignment="left" caption={'T'} dataField={'t'} width={'3%'}/>
                     <Column alignment="left" caption={'W'} dataField={'w'} width={'3%'}/>
                     <Column alignment="left" caption={'R'} dataField={'r'} width={'3%'}/>
                     <Column alignment="left" caption={'F'} dataField={'f'} width={'3%'}/>
                     <Column alignment="left" caption={'S'} dataField={'s'} width={'3%'}/>
                     <Column alignment="left" caption={'U'} dataField={'u'} width={'3%'}/>
                     <Column alignment="left"  width={'10%'} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleChildItems}>New</span>} />
                   </CustomGrid>
                 </Col>
                 {
                   isChildItem &&
                   <AddChildItems
                     onToggleChildItems={this.onToggleChildItems}
                     isChildItem={isChildItem}
                     mealTimes={mealTimes}
                     menuCategories={menuCategories}
                     itemSizes={itemSizes}
                     consistency={consistency}
                     itemTypes={itemTypes}
                     portions={portions}
                     serviceItems={serviceItems}
                     foodGroups={foodGroups}
                     items={items}
                   />
                 }
               </Row>
             </TabPane>
             <TabPane tab="Days" key={'days'}>
                 <Row>
                   <Col md={3} sm={12}>
                     <Form {...formItemLayout}>
                     <Form.Item>
                       DateRange
                     </Form.Item>
                     <Form.Item label="Start">
                       <DatePicker/>
                     </Form.Item>
                     <Form.Item label="End">
                       <DatePicker/>
                     </Form.Item>
                     </Form>
                   </Col>
                   <Col md={9} sm={12}>
                     <Form>
                     <Row>
                       <Col md={12} sm={12}>
                         <Form.Item>
                           <Checkbox>Active Days</Checkbox>
                         </Form.Item>
                       </Col>
                     </Row>
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
                   </Col>
                 </Row>
               <Row>
                 <Col sm={12} md={12}>
                   <CustomGrid
                     refCallback={(dg) => this.dg = dg}
                     dataSource={[]}
                     columnAutoWidth={false}
                     keyExpr="PKey_Prd_Meal_Pattern"
                     title="Menu Days"
                   >
                     <Column alignment="left" caption={'Menu'}  dataField={'menuCategory'}/>
                     <Column alignment="left" caption={'Recurring Days'} dataField={'item'}/>
                     <Column alignment="left" caption={'Except On'} dataField={'size'}/>
                   </CustomGrid>
                 </Col>
               </Row>
             </TabPane>
           </TabsComp>
         </Col>
       </Row>
      </Modal>
    )
  }
}

export default AddNewMealPattern
