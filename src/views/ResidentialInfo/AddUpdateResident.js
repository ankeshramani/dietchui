import React, {Component} from 'react';
import {Col, Row, Card, CardBody, CardHeader} from 'reactstrap';
import {Tabs, Skeleton, message, Icon} from 'antd';
import {ApiService} from '../../services/ApiService';
import TabsComp from "../../components/TabsComp";
import moment from 'moment'
import {dateFormat, max, toColor} from "../../services/common";
import UpdatePatientModal from './UpdatePatientModal';
import TubeFeedLabels from './TubeFeed/TubeFeedLabels';
import TubeFeeds from './TubeFeed/TubeFeeds';
import Notes from './Notes/Notes';
import TrayLine from './TrayLine';
import Adjustments from "./Adjustments/Adjustments";
import {connect} from "react-redux";
import MealPattern from "./MealPattern/MealPattern";
import Weights from "./Weights/Weights";
import DietHistory from "./Clinical/DietHistory/DietHistory";
import IntakeStudy from "./Clinical/IntakeStudy/IntakeStudy";
import Recommendations from "./Clinical/Recommendations/Recommendations";
import ProblemGloalApproach from "./Assessment/ProblemGloalApproach/ProblemGloalApproach";
import CalorieAndProteinAndFoodNeed from "./Clinical/CalorieAndProteinAndFoodNeed";
const TabPane = Tabs.TabPane;

class AddUpdateResident extends Component {

  _apiService = new ApiService();

  state = {
    loading: true,
    isModal: false,
    isSaving: false,
    isMealPattern: false,
    name: '',
    selectedTab: '',
    tabs: [],
    weightsList: [],
    patientId: this.props.match.params.id,
    dietTypes: [],
    consistency: [],
    specialNeeds: [],
    noteTypes: [],
    tubeFeedProducts: [],
    specialDevices: [],
    serviceItems: [],
    productionMealPatterns: [],
    foodAllergy: [],
    doctors: [],
    portions: [],
    itemSizes: [],
    foodGroups: [],
    itemTypes: [],
    items: [],
    menuCategories: [],
    mealTimes: [],
    latestDiet: {},
    patientDetails: {},
    specialNeedName: ''

  }

  onTabChange = (selectedTab) => {
    this.setState({
      selectedTab
    });
  }

  async componentDidMount() {
    await this.getDropDownsDietech();
    this.getPatientDetails();
    this.getPatientDietLatest();
    this.getSpecialNeeds();
  }

  getDropDownsDietech = async () => {
    const payload = {
      DietType: true,
      Consistency: true,
      SpecialNeeds: true,
      NoteTypes: true,
      TubeFeedProducts: true,
      SpecialDevices: true,
      FoodAllergy: true,
      Doctor: true,
      ServiceItem: true,
      Portion: true,
      ItemSize: true,
      MenuCategory: true,
      FoodGroup: true,
      ItemType: true,
      MealTime: true,
      Items: true
    };
    const data = await this._apiService.getDropDownsDietech(payload);
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!');
      this.setState({
        isMealPattern: true
      })
    } else {
      this.setState({
        dietTypes: data.dietType,
        consistency: data.consistency,
        specialNeeds: data.specialNeeds,
        tubeFeedProducts: data.tubeFeedProducts,
        noteTypes: data.noteTypes,
        specialDevices: data.adaptiveEquipment,
        foodAllergy: data.foodAllergy,
        doctors: data.doctor,
        serviceItems: data.serviceItems,
        portions: data.portions,
        itemSizes: data.itemSizes,
        menuCategories: data.menuCategories,
        foodGroups: data.foodGroups,
        itemTypes: data.itemTypes,
        mealTimes: data.mealTime,
        items: data.items,
        isMealPattern: true,
      });
    }
  }

  getPatientDetails = async () => {
    const {patientId} = this.state;
    const data = await this._apiService.getPatient(patientId);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        patientDetails: data
      })
    }
  }

  getSpecialNeeds = async () => {
    const {patientId} = this.state;
    const data = await this._apiService.getSpecialNeeds(patientId);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        specialNeed: data,
      })
    }
  }

  getPatientDietLatest = async () => {
    const {patientId} = this.state;
    const data = await this._apiService.getPatientDietLatest(patientId);
    if(!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      this.setState({
        latestDiet: data,
      })
    }
  }

  getDietName = (objData) => {
    const {dietTypes} = this.state;
    if(objData && dietTypes && dietTypes.length) {
      const {FKey_Diet_Type1, FKey_Diet_Type2, FKey_Diet_Type3, FKey_Diet_Type4, FKey_Diet_Type5} = objData;
      let dietOrder = [];
      [FKey_Diet_Type1, FKey_Diet_Type2, FKey_Diet_Type3, FKey_Diet_Type4, FKey_Diet_Type5].filter(x => x).forEach(x => {
        const diet = dietTypes.find(y => y.PKey_Diet_Type === x);
        if (diet) {
          dietOrder.push(<span style={{backgroundColor: toColor(diet.Argb_Back), color: toColor(diet.Argb_Fore)}}>{diet.Name} </span>);
        }
      });
      return dietOrder.map((x, i) => {
        return <>{i !== 0 && ', '}{x}</>
      });
    }
    return '';
  }

  getConsistencyName = (objData) => {
    const {consistency} = this.state;
    if(objData && consistency && consistency.length) {
      const {FKey_Consist1, FKey_Consist2, FKey_Consist3, FKey_Consist4, FKey_Consist5} = objData;
      let consistencyName = [];
      [FKey_Consist1, FKey_Consist2, FKey_Consist3, FKey_Consist4, FKey_Consist5].filter(x => x).forEach(x => {
        const diet = consistency.find(y => y.PKey_Consist === x);
        if (diet) {
          consistencyName.push(<span style={{backgroundColor: toColor(diet.Argb_Back), color: toColor(diet.Argb_Fore)}}>{diet.Name} </span>);
        }
      });
      return consistencyName.map((x, i) => {
        return <>{i !== 0 && ', '}{x}</>
      });
    }
    return '';
  }

  getSpecialNeedName = (objData) => {
    const {specialNeeds} = this.state;
    if(objData && specialNeeds && specialNeeds.length && objData.length) {
      let specialNeedName = [];
      objData.forEach(x => {
        const diet = specialNeeds.find(y => y.PKey_Special_Needs === x.FKey_Special_Needs);
        if (diet) {
          specialNeedName.push(diet.Name);
        }
      });
      return specialNeedName.map((x, i) => {
        return <>{i !== 0 && ', '}{x}</>
      });
    }
    return '';
  }

  getSpecialDeviceName = (objData) => {
    const {specialDevices} = this.state;
    if(objData && specialDevices && specialDevices.length) {
      const {FKey_Spec_Devices_1, FKey_Spec_Devices_2, FKey_Spec_Devices_3, FKey_Spec_Devices_4, FKey_Spec_Devices_5} = objData;
      let specialDeviceList = [];
      [FKey_Spec_Devices_1, FKey_Spec_Devices_2, FKey_Spec_Devices_3, FKey_Spec_Devices_4, FKey_Spec_Devices_5].filter(x => x).forEach(x => {
        const diet = specialDevices.find(y => y.PKEY_Spec_Devices === x);
        if (diet) {
          specialDeviceList.push(<span>{diet.Spec_Device_Name} </span>);
        }
      });
      return specialDeviceList.map((x, i) => {
        return <>{i !== 0 && ', '}{x}</>
      });
    }
    return '';
  }

  getAllergiesName = (objData) => {
    const {foodAllergy} = this.state;
    if(objData && foodAllergy && foodAllergy.length) {
      const {FKey_Food_Allergy_1, FKey_Food_Allergy_2, FKey_Food_Allergy_3, FKey_Food_Allergy_4, FKey_Food_Allergy_5} = objData;
      let foodAllergyList = [];
      [FKey_Food_Allergy_1, FKey_Food_Allergy_2, FKey_Food_Allergy_3, FKey_Food_Allergy_4, FKey_Food_Allergy_5].filter(x => x).forEach(x => {
        const diet = foodAllergy.find(y => y.PKEY_Food_Allergy === x);
        if (diet) {
          foodAllergyList.push(<span>{diet.Allergy_Name}</span>);
        }
      });
      return foodAllergyList.map((x, i) => {
        return <>{i !== 0 && ', '}{x}</>
      });
    }
    return '';
  }

  onModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  onRecordChange = (event) => {
    const {patientDetails} = this.state;
    patientDetails[event.target.name] = event.target.value;
    this.setState({
      patientDetails
    });
  }

  onClearPatientDetails = (name, value) => {
    const {patientDetails} = this.state;
    patientDetails[name] = value;
    this.setState({
      patientDetails
    });
  }

  onSelectChange = (event) => {
    const {latestDiet} = this.state;
    latestDiet[event.target.name] = event.target.value;
    this.setState({
      latestDiet
    });
  }

  onClearSelect = (name, value) => {
    const {latestDiet} = this.state;
    latestDiet[name] = value;
    this.setState({
      latestDiet
    });
  }

  updatePatient = async () => {
    const {patientDetails, latestDiet} = this.state;
    const payload = {
      ...patientDetails,
      ...latestDiet
    }
    this.setState({
      isSaving: true
    })
    const data = await this._apiService.updatePatient(payload)
    if(!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false
      })
    } else {
      message.success('Patient details update Successfully')
      this.setState({
        isSaving: false,
        isModal: false
      })
    }
  }

  onDateChange = (date, dateString) => {
    const {patientDetails} = this.state;
    patientDetails.AdmitDate =  moment(date).format("YYYY-MM-DD HH:MM");
    this.setState({
      ...patientDetails
    })
  }

  updateState = (latestDiet, patientDetails,) => {
    this.setState({
      ...latestDiet,
      ...patientDetails
    })
  }

  render() {
    const {dietsLists, latestDiet, patientDetails, isModal, mealTimes, dietTypes, consistency, specialNeed, specialDevices, noteTypes, specialNeeds, isSaving, tubeFeedProducts, patientId, foodAllergy, doctors, serviceItems, portions, itemSizes, menuCategories, foodGroups, itemTypes, isMealPattern, items} = this.state;
    const { facilityKey, facilitiesData } = this.props;
    const getDietNames = this.getDietName(latestDiet);
    const consistencyNames = this.getConsistencyName(latestDiet);
    const specialNeedNames = this.getSpecialNeedName(specialNeed);
    const specialDeviceName = this.getSpecialDeviceName(patientDetails);
    const allergiesName = this.getAllergiesName(patientDetails);
    const doctorName = (doctors || []).find((x)=> x.PKey_Doctor === patientDetails.FKey_Doctor);
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="min-height-card">
              <CardBody>
                  <Row>
                    <Col sm="12" md="6">
                      <Card>
                        <CardHeader>
                          <b>{`${patientDetails.FirstName || ''}, ${patientDetails.LastName || ''} `} </b>
                          <div className="pull-right cursor-pointer" onClick={this.onModalOpen}>
                            <Icon type="edit" />
                          </div>
                        </CardHeader>
                        <CardBody>
                          <Row>
                            <Col md="6" sm="12">
                              <p>
                                <img src={require('../../assets/avatars/6.jpg')} className="img-avatar mr-10"
                                     alt="admin@bootstrapmaster.com"/>
                              </p>
                              <p>
                                <b>Location:</b> <span>{patientDetails.L_Location || ''}</span>
                              </p>
                              <p>
                                <b>Admit Date:</b> <span>{patientDetails.AdmitDate ? moment(patientDetails.AdmitDate).format(dateFormat) : ''}</span>
                              </p>
                              <p>
                                <b>Gender:</b> <span>{patientDetails.Gender || ''}</span>
                              </p>

                            </Col>
                            <Col md="6" sm="12">
                              <p>
                                <b>Doctor:</b> <span>{`${(doctorName && doctorName.FirstName) || ''} ${(doctorName && doctorName.LastName) || ''}`}</span>
                              </p>
                              <p>
                                <b>Diet Order:</b> <span>{getDietNames}</span>
                              </p>
                              <p>
                                <b>Consistency:</b> <span>{consistencyNames}</span>
                              </p>
                              <p>
                                <b>Special Needs:</b> <span>{specialNeedNames}</span>
                              </p>
                              <p>
                                <b>Special Devices:</b> <span>{specialDeviceName}</span>
                              </p>
                              <p>
                                <b>Food Allergies:</b> <span>{allergiesName}</span>
                              </p>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col sm="12" md="3">
                      <Card>
                        <CardHeader><b>Attendance</b></CardHeader>
                        <CardBody className="pb-40">
                          <Skeleton />
                        </CardBody>
                      </Card>
                    </Col>
                    <TrayLine facilityKey={facilityKey || ""} facilitiesData={facilitiesData || []} patientDetails={patientDetails || {}} updateState={this.updateState}/>
                  </Row>
                  <Row>
                    <Col sm="12">
                      <TabsComp defaultActiveKey="1" animated={false}>
                        <TabPane tab="Meal Pattern" key="1">
                          {
                            isMealPattern && <MealPattern
                              patientId={patientId}
                              serviceItems={serviceItems}
                              portions={portions}
                              mealTimes={mealTimes}
                              itemSizes={itemSizes}
                              menuCategories={menuCategories}
                              foodGroups={foodGroups}
                              itemTypes={itemTypes}
                              consistency={consistency}
                              items={items}
                            />
                          }
                        </TabPane>
                        <TabPane tab="Adjustments" key="2">
                          <Adjustments
                            patientId={patientId}
                            serviceItems={serviceItems}
                            portions={portions}
                            itemSizes={itemSizes}
                            menuCategories={menuCategories}
                            foodGroups={foodGroups}
                            itemTypes={itemTypes}
                          />
                        </TabPane>
                        <TabPane tab="Notes" key="3">
                          <Notes patientId={patientId} noteTypes={noteTypes}/>
                        </TabPane>
                        <TabPane tab="Clinical" key="4">
                          <TabsComp defaultActiveKey="41" className="ml-40" animated={false}>
                            <TabPane tab="Cal, Protein & Fluid Needs" key="41">
                              <CalorieAndProteinAndFoodNeed/>
                            </TabPane>
                            <TabPane tab="Diet History" key="42">
                              {
                                isMealPattern &&
                             <DietHistory
                               patientId={patientId}
                               getDietNames={getDietNames}
                               consistencyNames={consistencyNames}
                               dietTypes={dietTypes || []}
                               consistency={consistency || []}
                             />
                              }
                            </TabPane>
                            <TabPane tab="Intake Study" key="43">
                             <IntakeStudy/>
                            </TabPane>
                            <TabPane tab="Recommendations" key="44">
                             <Recommendations/>
                            </TabPane>
                            <TabPane tab="Tube Feed" key="45">
                              <TubeFeeds patientId={patientId} tubeFeedProducts={tubeFeedProducts || []} />
                            </TabPane>
                            <TabPane tab="Tube Feed Lables" key="101">
                              <TubeFeedLabels patientId={patientId} tubeFeedProducts={tubeFeedProducts || []} />
                            </TabPane>
                            <TabPane tab="Dates and Settings" key="46">
                              <Skeleton />
                            </TabPane>
                          </TabsComp>
                        </TabPane>
                        <TabPane tab="Details" key="5">
                          <TabsComp defaultActiveKey="51" className="ml-40" animated={false}>
                            <TabPane tab="Attendance" key="51">
                              <Skeleton />
                            </TabPane>
                            <TabPane tab="Tray Line Override/Location Exceptions" key="52">
                              <Skeleton />
                            </TabPane>
                            <TabPane tab=" Selective Menu" key="53">
                              <Skeleton />
                            </TabPane>
                            <TabPane tab="Resident Detail" key="54">
                              <Skeleton />
                            </TabPane>
                          </TabsComp>
                        </TabPane>
                        <TabPane tab="Weights" key="6">
                         <Weights patientId={patientId} />
                        </TabPane>
                        <TabPane tab="Assessment" key="7">
                          <TabsComp defaultActiveKey="71" className="ml-40" animated={false}>
                            <TabPane tab="Problem/Gloal/Approach" key="71">
                             <ProblemGloalApproach/>
                            </TabPane>
                            <TabPane tab="Skin" key="72">
                              <Skeleton />
                            </TabPane>
                            <TabPane tab="Physical Data" key="73">
                              <Skeleton />
                            </TabPane>
                            <TabPane tab="Misc" key="74">
                              <Skeleton />
                            </TabPane>
                          </TabsComp>
                        </TabPane>
                        <TabPane tab="Alerts" key="8">
                          <Skeleton />
                        </TabPane>
                      </TabsComp>
                    </Col>
                  </Row>
              </CardBody>
              {isModal && <UpdatePatientModal
                           isModal={isModal}
                           onModalOpen={this.onModalOpen}
                           patientDetails={patientDetails}
                           onRecordChange={this.onRecordChange}
                           onSelectChange={this.onSelectChange}
                           latestDiet={latestDiet}
                           dietTypes={dietTypes}
                           consistency={consistency}
                           specialDevices={specialDevices}
                           specialNeeds={specialNeeds || []}
                           specialNeed={specialNeed || []}
                           foodAllergy={foodAllergy || []}
                           isSaving={isSaving}
                           updatePatient={this.updatePatient}
                           onDateChange={this.onDateChange}
                           onClearSelect={this.onClearSelect}
                           onClearPatientDetails={this.onClearPatientDetails}
                           updateState={this.updateState}
              />}
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

// export default AddUpdateResident;
const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
  facilitiesData: state.settings.facilitiesData
});

export default connect(mapStateToProps)(AddUpdateResident)

