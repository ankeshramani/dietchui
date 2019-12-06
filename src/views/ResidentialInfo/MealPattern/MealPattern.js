import React, {Component} from 'react';
import {Dropdown, Menu, message, Skeleton,} from 'antd';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../components/CustomGrid";
import {Column, Grouping, GroupPanel,} from "devextreme-react/data-grid";
import {ApiService} from "../../../services/ApiService";
import AddNewMealPattern from "./AddNewMealPattern";


class MealPattern extends Component {
  _apiService = new ApiService();
  state = {
    isLoading: this,
    fields: {},
    isMealPattern: false
  };

   componentDidMount() {
   this.getProductionMealPattern()
  }

  getProductionMealPattern = async () => {
    const {patientId} = this.props;
    const data = await this._apiService.getProductionMealPattern(patientId);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isLoading: false
      })
    } else {
      const {itemTypes, mealTimes, itemSizes, serviceItems, menuCategories, portions} = this.props;
      const productionMealPatterns = [];
      (data || []).forEach(x => {
        const serviceItem = (serviceItems || []).find(y => y.PKey_Prd_Service_Item === x.FKey_Prd_Service_Item) || {};
        const menuCategory = (menuCategories || []).find(y => y.PKey_Prd_Menu_Category === x.FKey_Prd_Menu_Category) || {};
        const itemType = (itemTypes || []).find(y => y.PKey_Item_Prd_ItemType === x.FKey_Item_Prd_ItemType) || {};
        const size = (itemSizes || []).find(y => y.PKey_Itm_Size === x.FKey_Itm_Size) || {};
        const portion = (portions || []).find(y => y.PKey_Prd_Portion === x.FKey_Patient) || {};
        const Mealtime = (mealTimes || []).find(y => y.pKey === x.Mealtime) || {};
        productionMealPatterns.push({
          PKey_Prd_Meal_Pattern: x.PKey_Prd_Meal_Pattern,
          menuCategory: menuCategory.Name || '',
          mo: '',
          item: '',
          itemType: itemType.Name || '',
          size: size.Itm_Size || null,
          consistency: '',
          portion: portion.Name || '',
          serviceItem: serviceItem.Name || '',
          m: x.Itm_Day1 || null,
          t: x.Itm_Day2 || null,
          w: x.Itm_Day3 || null,
          r: x.Itm_Day4 || null,
          f: x.Itm_Day5 || null,
          s: x.Itm_Day6 || null,
          u: x.Itm_Day7 || null,
          Mealtime: Mealtime.mealTime || ''
        })
      });
      this.setState({
        isLoading: false,
        productionMealPatterns
      })

    }
  }

  onToggleMealPattern  = (data) => {
     this.setState({
       fields: data,
       isMealPattern: !this.state.isMealPattern,
     })
  }

  render() {
    const {productionMealPatterns, isLoading, isMealPattern, fields} = this.state;
    const {mealTimes, menuCategories, itemSizes, consistency, itemTypes, portions, serviceItems, foodGroups, items} = this.props;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={productionMealPatterns || []}
                columnAutoWidth={false}
                keyExpr="PKey_Prd_Meal_Pattern"
              >
                <GroupPanel visible={true} />
                <Grouping autoExpandAll={true} />
                <Column alignment="left" caption={'Menu Category'} width={'15%'} dataField={'menuCategory'}/>
                <Column alignment="left" caption={'MO'} width={'3%'} dataField={'mo'}/>
                <Column alignment="left" caption={'Item'}  width={'15%'} dataField={'item'}/>
                <Column alignment="left" caption={'Item Type'} width={'10%'} dataField={'itemType'}/>
                <Column alignment="left" caption={'Size'} width={'5%'} dataField={'size'}/>
                <Column alignment="left" caption={'Consistency'} width={'5%'} dataField={'consistency'}/>
                <Column alignment="left" caption={'Portion'} width={'5%'} dataField={'portion'}/>
                <Column alignment="left" caption={'Service Item'} width={'13%'} dataField={'serviceItem'}/>
                <Column alignment="left" caption={'M'} dataField={'m'} width={'3%'}/>
                <Column alignment="left" caption={'T'} dataField={'t'} width={'3%'}/>
                <Column alignment="left" caption={'W'} dataField={'w'} width={'3%'}/>
                <Column alignment="left" caption={'R'} dataField={'r'} width={'3%'}/>
                <Column alignment="left" caption={'F'} dataField={'f'} width={'3%'}/>
                <Column alignment="left" caption={'S'} dataField={'s'} width={'3%'}/>
                <Column alignment="left" caption={'U'} dataField={'u'} width={'3%'}/>
                {/*<Column alignment="left" headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleMealPattern}>New</span>} />*/}

                <Column alignment="left" headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={() => this.onToggleMealPattern({})}>New</span>} cellRender={(record) => {
                  return(
                    <div className="flex-align-item-center cursor-pointer">
                      <span className="text-primary mr-5" onClick={() => this.onToggleMealPattern(record.data)}>Edit</span>
                    </div>
                  )
                }}/>
                <Column alignment="left" caption={'Meal Time'} dataField={'Mealtime'} groupIndex={0}/>
              </CustomGrid>
          }
          {
            isMealPattern &&
            <AddNewMealPattern
              onToggleMealPattern={this.onToggleMealPattern}
              isMealPattern={isMealPattern}
              mealTimes={mealTimes}
              menuCategories={menuCategories}
              itemSizes={itemSizes}
              consistency={consistency}
              itemTypes={itemTypes}
              portions={portions}
              serviceItems={serviceItems}
              foodGroups={foodGroups}
              items={items}
              fields={fields}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default MealPattern
