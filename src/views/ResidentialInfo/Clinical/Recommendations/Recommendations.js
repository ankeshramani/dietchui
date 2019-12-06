import React,{Component} from 'react';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import moment from "moment";
import {dateFormat, toColor} from "../../../../services/common";
import {Dropdown, Menu, Skeleton} from "antd";
import {ApiService} from "../../../../services/ApiService";
import clonedeep from "lodash.clonedeep";
import AddNewRecommendation from "./AddNewRecommendation";

class Recommendations extends Component{
  _apiService = new ApiService();

  state = {
    isLoading: false,
    isRecommendation: false,
    isSaving: false,
    isEdit: false,
    selectedRecord: {},
  }

  onToggleRecommendation = () => {
    this.setState({
      isRecommendation: !this.state.isRecommendation,
      selectedRecord: {},
    })
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      isRecommendation: true,
    })
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {isLoading, isRecommendation, isSaving} = this.state;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton/> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={[]}
                columnAutoWidth={false}
                keyExpr="Recommendation"
              >
                <Column alignment="left" caption={'Date'} dataField={"date"} dataType={"date"}/>
                <Column alignment="left" caption={'Discipline'} dataField={"Discipline"}/>
                <Column alignment="left" caption={'Title'} dataField={"Title"}/>
                <Column alignment="left" caption={'Recommendation'} dataField={"Recommendation"}/>
                <Column alignment="left" caption={'Comp Date'} dataField={"CompDate"}/>
                <Column alignment="left" caption={'Reeval Date'} dataField={"ReevalDate"}/>
                <Column alignment="left" width={"10%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleRecommendation}>New</span>} cellRender={(record) => {
                  const menu = (
                    <Menu>
                      <Menu.Item>
                        <span className="text-primary ml-5 cursor-pointer">Delete</span>
                      </Menu.Item>
                    </Menu>
                  );
                  return (
                    <div className="flex-align-item-center cursor-pointer">
                      <span className="text-primary mr-5" onClick={() => this.onEditRecord(record.data)}>Edit</span>
                      <Dropdown overlay={menu} trigger={['click']}>
                        <i className="icon-options-vertical text-primary cursor-pointer"/>
                      </Dropdown>
                    </div>
                  )
                }}/>
              </CustomGrid>
          }
          {
            isRecommendation &&
            <AddNewRecommendation
              isRecommendation={isRecommendation}
              isSaving={isSaving}
              onToggleRecommendation={this.onToggleRecommendation}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default Recommendations
