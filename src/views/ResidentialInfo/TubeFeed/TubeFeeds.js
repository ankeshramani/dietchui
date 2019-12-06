import React, {Component} from 'react';
import {message, Skeleton} from 'antd';
import {Col, Row} from 'reactstrap';
import moment from 'moment'
import {dateFormat} from "../../../services/common";
import {ApiService} from '../../../services/ApiService';
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import AddNewTubeFeed from "./AddNewTubeFeed";

class TubeFeeds extends Component {
  _apiService = new ApiService();

  state = {
    tubeFeeds: [],
    isLoading: true,
    isTubeFeed: false,
  }

  async componentDidMount() {
    this.getTubeFeeds();
  }

  getTubeFeeds = async () => {
    const {patientId} = this.props;
    const data = await this._apiService.getTubeFeeds(patientId);
    if(!data || data.error){
      this.setState({
        isLoading: false
      })
      message.error('Something Wrong. Try again')
    } else {
      data.forEach(x => {
        x.productName1 = this.getProductName(x.FKey_Products_1);
        x.productName2 = this.getProductName(x.FKey_Products_2);
      });
      return this.setState({
        tubeFeeds: data,
        isLoading: false
      })
    }
  }

  getProductName = (productKey) => {
    const {tubeFeedProducts} = this.props;
    if (tubeFeedProducts && tubeFeedProducts.length && productKey) {
      const product = tubeFeedProducts.find(x => x.PKey_Products === productKey);
      if (product) {
        return product.Product_Name;
      }
    }
    return '';
  }

  onToggleTubeFeed = () => {
    this.setState({
      isTubeFeed: !this.state.isTubeFeed
    })
  }

  render() {
    const {isTubeFeed} = this.state;
    const {tubeFeedProducts} = this.props;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            this.state.isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={this.state.tubeFeeds || []}
                columnAutoWidth={false}
                keyExpr="PKey_Tube"
              >
                <Column alignment="left" caption={'Date'} dataField={"DateEntered"} dataType={"date"} />
                <Column alignment="left" caption={'Product1'} dataField={'productName1'}/>
                <Column alignment="left" caption={'Amount'} dataField={'Hours_1'}/>
                <Column alignment="left" caption={'Product2'} dataField={'productName2'}/>
                <Column alignment="left" caption={'Amount'} dataField={'Hours_2'}/>
                <Column alignment="left" caption={'Total Flush'} dataField={'Misc_1CC'}/>
                <Column alignment="left" width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleTubeFeed}>New</span>}/>
              </CustomGrid>
          }
          {isTubeFeed && <AddNewTubeFeed isTubeFeed={isTubeFeed} tubeFeedProducts={tubeFeedProducts || []} onToggleTubeFeed={this.onToggleTubeFeed}/>}
        </Col>
      </Row>
    )
  }
}

export default TubeFeeds
