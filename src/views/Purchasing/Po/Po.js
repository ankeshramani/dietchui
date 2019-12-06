import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Dropdown, Icon, Menu, message, Tabs} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import {Column, MasterDetail, Pager, Paging, Summary, TotalItem,} from "devextreme-react/data-grid";
import CustomGrid from "../../../components/CustomGrid";
import Podetails from "./Podetails";
import {formatNumber} from "../../../services/common";
import TabsComp from "../../../components/TabsComp";
import PoDeliveryHistory from "./PoDeliveryHistory";
const TabPane = Tabs.TabPane;


const details = (props) => {
  return (
    <TabsComp defaultActiveKey={'1'} animated={false}>
      <TabPane tab={'Po Details'} key={'1'}>
        <Row>
          <Col md="12"><Podetails {...props}/></Col>

        </Row>
      </TabPane>
      <TabPane tab={'Po Delivery History'} key={'2'}>
        <Col md="12"><PoDeliveryHistory {...props}/></Col>
      </TabPane>
    </TabsComp>

  )
};

class Po extends Component{
  _apiService = new ApiService();
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      poList: [],
    };
  }
  componentDidMount() {
    this.getPo()
  }

  getPo = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getPo(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        poList: data,
        loading: false,
      })
    }
  }

  onDeleteRecord = async (selectedRecord) => {
    const data = await this._apiService.deletePo(selectedRecord.PKey_OP_PO)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Po Detail Deleted Successfully');
      const {poList} = this.state;
      this.setState({
        poList: poList.filter(x => x.PKey_OP_PO !== selectedRecord.PKey_OP_PO)
      })
    }
    this.refreshGrid()
  }

  onOpen = (selectedRowId) => {
    this.props.history.push(`/purchasing/purchase-order/${selectedRowId}`);
  }

  onNew = () => {
    this.props.history.push(`/purchasing/purchase-order/new`);
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    const {loading, poList}= this.state;
    const  focusedRowKey = this.props && this.props.history && this.props.history.location && this.props.history.location.state && this.props.history.location.state.focusedRowKey;
    return(
      <div className="animated fadeIn page-view with-print" >
        <div className="print-button" title="Print">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="print">
              <Icon type="printer" />
              Print
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <CustomGrid
                      className={'dx-card wide-card'}
                      refCallback={(dg) => this.dg = dg}
                      dataSource={poList}
                      isNoScroll={false}
                      showBorders={false}
                      defaultFocusedRowKey={focusedRowKey ? Number(focusedRowKey) : ''}
                      columnAutoWidth={false}
                      focusedRowEnabled={true}
                      keyExpr="PKey_OP_PO"
                      gridClass="common-height"
                    >
                      <Paging defaultPageSize={5} />
                      <Pager showPageSizeSelector={true} showInfo={true} />
                      <Column alignment={'left'} width={200} caption={'Invoice Number'} dataField={'PoNumber'} cellRender={(record) => {
                        return (<span className="text-primary mr-5 cursor-pointer" onClick={() => this.onOpen(record.data.PKey_OP_PO)}>{record.data.PoNumber}</span>);
                      }} />
                      <Column alignment={'left'} width={"30%"} caption={'Supplier'} dataField={'Supplier_Name'}/>
                      <Column alignment={'left'} width={200} caption={'Invoice Date'} sortOrder={'desc'} dataField={'PoDate'} dataType={'datetime'}/>
                      <Column alignment={'left'} width={"30%"} caption={'Department'} dataField={'DepartmentName'}/>
                      <Column alignment={'left'} width={150} caption={'Total'} dataField={'PO_Total'} cellRender={(record) => {
                        return <span>{formatNumber(record.data.PO_Total, 2)}</span>
                      }}/>
                      <Column alignment={'left'} width={100} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={this.onNew}>New</span>} cellRender={(record) => {
                        const menu = (
                          <Menu>
                            <Menu.Item onClick={() => this.onDeleteRecord(record.data, record.rowIndex)}>
                              <span className="text-primary ml-5 cursor-pointer">Delete</span>
                            </Menu.Item>
                          </Menu>
                        );
                        return (
                          <div className="flex-align-item-center">
                            <span className="text-primary mr-5 cursor-pointer" onClick={() => this.onOpen(record.data.PKey_OP_PO)}>Edit</span>
                            <Dropdown overlay={menu} trigger={['click']}>
                              <i className="icon-options-vertical text-primary cursor-pointer" />
                            </Dropdown>
                          </div>
                        )
                      }
                      }/>
                      <Summary recalculateWhileEditing={true}>
                        <TotalItem
                          column={'PO_Total'}
                          summaryType={'sum'}
                          displayFormat={(record) => {
                            return formatNumber(record , 2)
                          }}
                        />
                      </Summary>
                      <MasterDetail
                        enabled={true}
                        component={details}
                      />
                    </CustomGrid>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }

}
const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});

export default connect(mapStateToProps)(Po);
