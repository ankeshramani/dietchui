import React, {Component} from 'react';
import {Skeleton,} from 'antd';
import {Col, Row} from "reactstrap";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";

class Request extends Component {
  render() {
    const {request, isLoading, tempPreferenceHot, tempPreferenceCold} = this.props;
    return(
      <Row>
        <Col xs="12" sm="12" lg="12">
          {
            isLoading ? <Skeleton /> :
              <CustomGrid
                refCallback={(dg) => this.dg = dg}
                dataSource={request || tempPreferenceHot || tempPreferenceCold || []}
                columnAutoWidth={false}
                keyExpr="PKey_Notes"
              >
                <Column alignment="left" caption={'Reason'} width={'10%'} dataField={'reason'}/>
                <Column alignment="left" caption={'Type'} width={'15%'} dataField={'type'}/>
                <Column alignment="left" caption={'Allergy/Item/Food/Menu'} width={'30%'} dataField={'menu'}/>
                <Column alignment="left" caption={'B'} dataField={'b'} width={'3%'}/>
                <Column alignment="left" caption={'L'} dataField={'l'} width={'3%'}/>
                <Column alignment="left" caption={'S'} dataField={'s'} width={'3%'}/>
                <Column alignment="left" caption={'Item'} dataField={'item'} width={'10%'}/>
                <Column alignment="left" caption={'Size'} dataField={'size'} width={'10%'}/>
                <Column alignment="left" caption={'Consist'} dataField={'consist'} width={'6%'}/>
                <Column alignment="left" caption={'Item Type'} dataField={'itemType'} width={'10%'}/>
                {/*<Column alignment="left" caption={'Portion'} dataField={'portion'}/>
                <Column alignment="left" caption={'Service Item'} dataField={'Note_Title'}/>*/}
              </CustomGrid>
          }
        </Col>
      </Row>
    )
  }
}

export default Request
