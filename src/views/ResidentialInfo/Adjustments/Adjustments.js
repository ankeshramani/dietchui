import React, {Component} from 'react';
import {message, Skeleton, Tabs} from 'antd';
import {ApiService} from '../../../services/ApiService';
import TabsComp from "../../../components/TabsComp";
import ConsistencyOverride from "./ConsistencyOverride";
import Modify from "./Modify";
import NeverServerWhen from "./NeverServerWhen";
import NextAvailable from "./NextAvailable";
import ReplaceWith from "./ReplaceWith";
import Request from "./Request";
import DietOverride from "./DietOverride";
const TabPane = Tabs.TabPane;

class Adjustments extends Component {
  _apiService = new ApiService();

  state = {
    adjustments: [],
    isLoading: true
  }

  async componentDidMount() {
      this.getProductionAdjustments()
  }

  getProductionAdjustments = async()  => {
    const {patientId} = this.props;
    const data = await this._apiService.getProductionAdjustments(patientId);
    if(!data || data.error){
      this.setState({
        isLoading: false
      });
      message.error('Something Wrong. Try again')
    } else {
       this.setState({
         adjustments: data,
         isLoading: false
      }, () => {
         const {itemTypes, foodGroups, itemSizes, serviceItems} = this.props;
         const array = []
         data.forEach(d => {
           const itemType = (itemTypes && itemTypes.find(i => i.PKey_Item_Prd_ItemType === d.FKey_Item_Prd_ItemType)) || {}
           const menu = (foodGroups && foodGroups.find(i => i.PKey_Prd_Food_Group === d.FKey_Prd_Allergy_Group)) || {}
           const size = (itemSizes && itemSizes.find(i => i.PKey_Itm_Size === d.FKey_Itm_Size_Adj)) || {}
           const item = (serviceItems && serviceItems.find(i => i.PKey_Prd_Service_Item === d.FKey_Prd_Service_Item_Adj)) || {}
           array.push({
             ActionType: d.ActionType,
             menu: menu.Name || "",
             PKey_Notes: 1,
             size: size.Size_Num || null,
             itemType: itemType.Name || "",
             item: item.Name || '',
             type:  "",
             reason: 'Intolerance',
             consist: "",
             b: true,
             l: true,
             s: true,

           })
         })
         this.setState({array})
       });
    }
  }

  render() {
    const {isLoading, array} = this.state;
    const {foodGroups, patientId} = this.props;
    const modify = (array || []).filter((x) => x.ActionType === 0);
    const nextAvailable = (array || []).filter((x) => x.ActionType === 1);
    const neverServe = (array || []).filter((x) => (x.ActionType === 2 || x.ActionType === 9));
    const replaceWith = (array || []).filter((x) => x.ActionType === 3);
    const consistencyOverride = (array || []).filter((x) => x.ActionType === 4);
    const request = (array || []).filter((x) => (x.ActionType === 5 || x.ActionType === 6 || x.ActionType === 7));
    // const tempPreferenceHot = (adjustments || []).filter((x) => x.ActionType === 6);
    // const tempPreferenceCold = (adjustments || []).filter((x) => x.ActionType === 7);
    const dietOverride = (array || []).filter((x) => x.ActionType === 8);
    // const neverServeWhen = (adjustments || []).filter((x) => x.ActionType === 9);
    return(
      <TabsComp defaultActiveKey="22" className="ml-40" animated={false}>
        <TabPane tab="Consistency Override" key="22">
         <ConsistencyOverride consistencyOverride={consistencyOverride} isLoading={isLoading} foodGroups={foodGroups} patientId={patientId}/>
        </TabPane>
        <TabPane tab="Modify" key="23">
          <Modify modify={modify} isLoading={isLoading}/>
        </TabPane>
        <TabPane tab="Never Server When" key="24">
          <NeverServerWhen neverServe={neverServe} isLoading={isLoading}/>
        </TabPane>
        <TabPane tab="Next Available" key="25">
         <NextAvailable nextAvailable={nextAvailable} isLoading={isLoading}/>
        </TabPane>
        <TabPane tab="Replace With" key="26">
          <ReplaceWith replaceWith={replaceWith} isLoading={isLoading}/>
        </TabPane>
        <TabPane tab="Request" key="27">
          <Request request={request} isLoading={isLoading}/>
        </TabPane>
        <TabPane tab="Diet Override" key="28">
          <DietOverride dietOverride={dietOverride} isLoading={isLoading} foodGroups={foodGroups} patientId={patientId}/>
        </TabPane>
      </TabsComp>
    )
  }
}

export default Adjustments
