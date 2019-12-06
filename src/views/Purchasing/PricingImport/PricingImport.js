import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {message} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {Column} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";

import ImportPricing from "./ImportPricing";

class PricingImport extends Component {
  _apiService = new ApiService();
    state = {
      loading: false,
      isImportPricing: false,
      supplierContracts: []
    }

    componentDidMount() {
      this.getSupplierContracts()
    }

  getSupplierContracts = async () => {
      this.setState({
        loading: true
      })
    const data = await this._apiService.getSupplierContracts()
    if(!data || data.error){
      message.error('Something went wrong!')
      this.setState({
        loading: false,
      })
    } else {
      this.setState({
        supplierContracts: data,
        loading: false,
      })
    }
  }

  showModalImportPricing  = (record) => {
    this.setState({
      isImportPricing: !this.state.isImportPricing,
      selectedSupplierContracts: record
    })
  }

  render() {
    const {loading, supplierContracts = [], isImportPricing, selectedSupplierContracts} = this.state
    return (
      <div className="animated fadeIn page-view">
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-5 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <>
                      <Row>
                        <Col md="12" sm="12" xs="12">
                          <CustomGrid
                            refCallback={(dg) => this.dg = dg}
                            dataSource={supplierContracts}
                            columnAutoWidth={false}
                            keyExpr="PKey_Pur_SupplierContract"
                            gridClass="common-height-180-px"
                          >
                            <Column alignment="left"  caption={'Name'} sortOrder={'asc'} dataField={'Name'}/>
                            <Column alignment="left"  caption={'Supplier Name'} dataField={'SupplierName'}/>
                            <Column alignment="left"  caption={'Date Entered'} dataField={'DateEntered'} dataType={'date'}/>
                            <Column alignment="left"  caption={'Action'} cellRender={(record) => {
                              return (
                                <div>
                                  <span className="mr-10 text-primary cursor-pointer" onClick={() => this.showModalImportPricing(record.data)}>ImportPricing</span>
                                  <span className="mr-10 text-primary cursor-pointer">DownloadPricing</span>
                                </div>
                              )
                            }}/>
                          </CustomGrid>
                        </Col>
                      </Row>
                    </>
                }
              </CardBody>
            </Card>
          </Col>
           { isImportPricing && <ImportPricing isImportPricing={isImportPricing} showModalImportPricing={this.showModalImportPricing} selectedSupplierContracts={selectedSupplierContracts}/>}
        </Row>
      </div>
    )
  }

}


export default PricingImport;
