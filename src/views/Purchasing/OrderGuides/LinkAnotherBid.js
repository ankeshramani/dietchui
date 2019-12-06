import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {DropDownBox} from 'devextreme-react';
import {Selection, Paging, Scrolling, Column} from 'devextreme-react/data-grid';
import {Button, message, Modal, Spin} from "antd";
import {Row, Col} from "reactstrap";
import CustomGrid from "../../../components/CustomGrid";
import Loader from "../../Common/Loader";

class LinkAnotherBid extends Component {
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.widgetRef = React.createRef();
    this.widgetRefSupplier = React.createRef();
    this.state = {
      isLoading: false,
      supplierList: [],
      supplierBidList: []
    };
  }

  componentDidMount() {
    this.getSupplier();
  }

  getSupplier = async () => {
    this.setState({
      isLoading: true,
    });
    const data = await this._apiService.getSupplier(this.props.facilityKey);
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!');
      this.setState({
        isLoading: false,
      })
    } else {
      this.setState({
        supplierList: data,
        isLoading: false,
      })
    }
  };

  getSupplirBids = async (supplerId) => {
    const data = await this._apiService.getSupplirBids(supplerId)
    if (!data || data.error) {
      message.error('Something went wrong. Please try again later!');
      return [];
    } else {
      return data;
    }

  }

  onSelectionChanged = async (record) => {
    this.setState({
      supplierName: record.selectedRowsData[0].Name,
      supplierId: record.selectedRowsData[0].PKey_OP_Supplier,
    });
    this.refreshGrid();
    const data = await this.getSupplirBids(record.selectedRowsData[0].PKey_OP_Supplier);
    this.setState({
      supplierBidList: data
    }, () => this.refreshGrid());
    this.widgetRefSupplier.current.instance.close();
  };

  onBidSelectionChanged = async (record) => {
    this.setState({
      supplierBidId: record.selectedRowsData[0].PKey_OP_Supplier_Bid,
      supplierBidName: record.selectedRowsData[0].Name
    });
    this.widgetRef.current.instance.close();
    this.refreshGrid();
  };

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  postSupplierItemLink = async () => {
    const { supplierBidId } = this.state;
    const { orderGuideItemId, orderGuideUnitItemId } = this.props;
    if(supplierBidId){
      this.setState({
        isSaving: true
      });
      const payload = {
        PKey_OP_Supplier_ItemLink: 0,
        FKey_Item: orderGuideItemId,
        FKey_Item_Unit: orderGuideUnitItemId ? orderGuideUnitItemId : 0,
        FKey_OP_Supplier_Bid: supplierBidId,
        ConversionValue: 0
      }
      const response = await this._apiService.postSupplierItemLink(payload);
      if (response && !response.error) {
        this.setState({
          isSaving: false,
        });
        this.props.onHideLinkAnotherBid(false, payload)

        return message.success('Supplier Item Link Saved Successfully');

      } else {
        this.setState({
          isSaving: false,
        });
        return message.error('Something went wrong. Please try again later!');
      }
    }else {
      return message.error('Please select supplier Bid!');
    }

  }

  render() {
    const {onToggleLinkAnotherBid, isLinkAnotherBid} = this.props;
    const {supplierBidList, supplierBidName, supplierList, isLoading, isSaving, supplierName, supplierBidId} = this.state;
    return (
      <Modal
        visible={isLinkAnotherBid}
        title="Link Another BId"
        onCancel={onToggleLinkAnotherBid}
        footer={[
          <Button key="submit" type="primary" disabled={!supplierBidId} onClick={this.postSupplierItemLink}>
            {isSaving ? <Spin className="white" size={"small"}/> : 'Save'}
          </Button>,
          <Button key="back" onClick={this.props.onToggleLinkAnotherBid}>
            Cancel
          </Button>,
        ]}
        height={400}
        width={800}
        size={"small"}
      >
        {
          isLoading ? <Loader className="mt-50"/> :
            <Row>
              <Col md={6}>
                <DropDownBox
                  ref={this.widgetRefSupplier}
                  value={supplierName}
                  valueExpr={'PKey_OP_Supplier'}
                  deferRendering={false}
                  displayExpr={(item) => item && `${item.Name}`}
                  placeholder={'Select Supplier'}
                  dataSource={supplierList}
                  contentRender={() => {
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={supplierList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onSelectionChanged(record)}
                        height={'100%'}>
                        <Selection mode={'single'}/>
                        <Scrolling mode={'infinite'}/>
                        <Paging enabled={true} pageSize={10}/>
                        <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Col>
              <Col md={6}>
                <DropDownBox
                  ref={this.widgetRef}
                  value={supplierBidName}
                  valueExpr={'PKey_OP_Supplier'}
                  deferRendering={false}
                  displayExpr={(item) => item && `${item.Name}`}
                  placeholder={'Select Supplier Bid'}
                  dataSource={supplierBidList}
                  contentRender={() => {
                    return (
                      <CustomGrid
                        refCallback={(dg) => this.dg = dg}
                        dataSource={supplierBidList}
                        hoverStateEnabled={true}
                        onSelectionChanged={(record) => this.onBidSelectionChanged(record)}
                        height={'100%'}>
                        <Selection mode={'single'}/>
                        <Scrolling mode={'infinite'}/>
                        <Paging enabled={true} pageSize={10}/>
                        <Column sortOrder={'asc'} caption={'Name'} dataField={'Name'}/>
                      </CustomGrid>
                    )
                  }}
                />
              </Col>
            </Row>
        }
      </Modal>
    )
  }
}

export default LinkAnotherBid
