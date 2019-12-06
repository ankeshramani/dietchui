import React, {Component} from 'react';
import {message, Skeleton} from 'antd';
import {Col, Row} from 'reactstrap';
import {ApiService} from '../../../services/ApiService';
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import AddNewTubeFeedLabels from "./AddNewTubeFeedLabels";

class TubeFeedLabels extends Component {
  _apiService = new ApiService();

  state = {
    tubeFeeds: [],
    isLoading: true,
    isTubeFeedLabel: false
  }

  async componentDidMount() {
    this.getTubeFeedLabels();
  }

  getTubeFeedLabels = async () => {
    const {patientId} = this.props;
    const data = await this._apiService.getTubeFeedsLabels(patientId);
    if(!data || data.error){
      this.setState({
        isLoading: false
      })
      message.error('Something Wrong. Try again')
    } else {
      data.forEach(x => {
        x.productName = this.getProductName(x.FKey_Products);
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

  onToggleTubeFeedLabel = () => {
    this.setState({
      isTubeFeedLabel: !this.state.isTubeFeedLabel,
    })

  }

  render() {
    const {isTubeFeedLabel, isLoading} = this.state;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={this.state.tubeFeeds || []}
                columnAutoWidth={false}
                keyExpr="PKey_TubeFeed_Label"
              >
                <Column alignment="left" caption={'Product'} dataField={'productName'}/>
                <Column alignment="left" caption={'Size'} dataField={'Size'}/>
                <Column alignment="left" caption={'UOM'} dataField={'Size_Unit'}/>
                <Column alignment="left" caption={'M'} dataField={'Itm_Day1'} width={'5%'}/>
                <Column alignment="left" caption={'T'} dataField={'Itm_Day2'} width={'5%'}/>
                <Column alignment="left" caption={'W'} dataField={'Itm_Day3'} width={'5%'}/>
                <Column alignment="left" caption={'R'} dataField={'Itm_Day4'} width={'5%'}/>
                <Column alignment="left" caption={'F'} dataField={'Itm_Day5'} width={'5%'}/>
                <Column alignment="left" caption={'S'} dataField={'Itm_Day6'} width={'5%'}/>
                <Column alignment="left" caption={'U'} dataField={'Itm_Day7'} width={'5%'}/>
                <Column alignment="left" width={'10%'} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onToggleTubeFeedLabel}>New</span>} />
              </CustomGrid>
          }
          {
            isTubeFeedLabel &&
            <AddNewTubeFeedLabels
              isTubeFeedLabel={isTubeFeedLabel}
              onToggleTubeFeedLabel={this.onToggleTubeFeedLabel}
            />
          }
        </Col>
      </Row>
    )
  }
}

export default TubeFeedLabels
