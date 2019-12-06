import React,{Component} from 'react';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import moment from "moment";
import {dateFormat, toColor} from "../../../../services/common";
import {Dropdown, Menu, Skeleton} from "antd";
import {ApiService} from "../../../../services/ApiService";
import clonedeep from "lodash.clonedeep";
import AddNewProblemGloalApproach from "./AddNewProblemGloalApproach";

class ProblemGloalApproach extends Component{
  _apiService = new ApiService();

  state = {
    isLoading: false,
    isProblem: false,
    isSaving: false,
    isEdit: false,
    selectedRecord: {},
  }

  onToggleProblem = () => {
    this.setState({
      isProblem: !this.state.isProblem,
      selectedRecord: {},
    })
  }

  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord),
      isProblem: true,
    })
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {isLoading, isProblem, isSaving} = this.state;
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
                <Column alignment="left" caption={'No'} width={"10%"} dataField={"No"}/>
                <Column alignment="left" caption={'Start Date'} width={"15%"} dataField={"startDate"} dataType={"date"}/>
                <Column alignment="left" caption={'Title'} width={"50%"} dataField={"Title"}/>
                <Column alignment="left" caption={'Resolved'} width={"15%"} dataField={"Resolved"}/>
                <Column alignment="left" width={"10%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleProblem}>New</span>} cellRender={(record) => {
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
            isProblem &&
            <AddNewProblemGloalApproach
              isProblem={isProblem}
              isSaving={isSaving}
              onToggleProblem={this.onToggleProblem}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default ProblemGloalApproach

