import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Dropdown, Icon, Menu, message} from "antd";
import {connect} from "react-redux";
import Loader from "../Common/Loader";
import {ApiService} from "../../services/ApiService";
import {storeSelection} from "../../redux/actions/misc";
import "./index.scss";
import {Column, MasterDetail, Pager, Paging} from "devextreme-react/data-grid";
import CustomGrid from "../../components/CustomGrid";
import moment from "moment";
const { SubMenu } = Menu;
class ResidentialInfo extends Component {

  _apiService = new ApiService();

  state = {
    loading: true,
    name: '',
    isDataFilter: false,
    selectedFilter: this.props.selectedResidentTab && this.props.selectedResidentId ? this.props.selectedResidentTab : 'Active',
  }

  async componentDidMount() {
    let data = await this._apiService.getResidentialInfo();
    if (data.error) {
      this.setState({
        loading: false,
      });
    } else {
      data = (data || []).map((i, index) => ({
        ID: index.toString(),
        name: `${(i.LastName || '')}, ${(i.FirstName || '')}`, ...i
      }));
      data = (data || []).sort((a, b) => {
        return a.name > b.name ? 1 : -1;
      });
      this.setState({
        loading: false,
        data: data || []
      }, () => {
        try {
          if (this.props.selectedResidentId) {
            const elem = document.getElementsByClassName('selectedRow');
            const elemBox = document.getElementsByClassName('ant-table-body');
            if (elem.length > 0 && elem.length > 0) {
              elemBox[0].scrollTop = elem[0].offsetTop - 10;
            }
          }
        } catch(err) {
          console.log(err);
        }
      });
    }
  }

  onClickButton = (action) => {
    if (action === 'new') {
      this.props.history.push('/resident/new');
    } else {
      this.props.history.push(`/resident/${this.props.selectedResidentId}`);
    }
  }

  onRedirect = (patientId) => {
    this.props.history.push(`/resident/${patientId}`);
  }

  handleMenuClick = (event) => {
    this.setState({
      selectedFilter: event.key,
    });
    this.props.storeSelection({
      selectedResidentId: null,
      selectedResidentTab: null
    })
  }

  getMenu = () => {
    return (
      <Menu onClick={this.handleMenuClick} activeKey={this.state.selectedFilter}>
        <Menu.Item key="All" selected={this.state.selectedFilter === 'All'}>
          All
        </Menu.Item>
        <Menu.Item key="Active" selected={this.state.selectedFilter === 'Active'}>
          Active
        </Menu.Item>
        <Menu.Item key="Discharged" selected={this.state.selectedFilter === 'Discharged'}>
          Discharged
        </Menu.Item>
          <SubMenu key="Views " title="Views">
            <Menu.Item key="All">All</Menu.Item>
            <Menu.Item key="DietOrderFlags">Diet Order Flags</Menu.Item>
            <Menu.Item key="NoDietOrder">No Diet Order</Menu.Item>
            <Menu.Item key="NutritonalAssessmentFlags">Nutritonal Assessment Flags</Menu.Item>
            <Menu.Item key="Tray Line Flags">Tray Line Flags</Menu.Item>
            <Menu.Item key="WeightFlags">Weight Flags</Menu.Item>
          </SubMenu>
      </Menu>
    );
  }


  onDelete = async (selectedRecord) => {
    const payload = {
      PKey_Patient: selectedRecord.PKey_Patient,
      FirstName: selectedRecord.FirstName,
      LastName: selectedRecord.LastName,
      Wing: selectedRecord.Wing,
      Gender: selectedRecord.Grouping,
      Floor: selectedRecord.Floor,
      FKey_Facility: selectedRecord.FKey_Facility
    }
    const data = await this._apiService.deleteResidentialInfo(selectedRecord.PKey_Patient, payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
    } else {
      message.success('Residential Info Deleted Successfully');
      const {data} = this.state;
      this.setState({
        data: data.filter(x => x.PKey_Patient !== selectedRecord.PKey_Patient)
      }, () => {
        this.refreshGrid();
      })
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }

  render() {
    let {loading, data, name, isDataFilter, selectedFilter} = this.state;
    const {selectedResidentId} = this.props;
    const isIncludes = (key1, key2) => {
      return (key1 || '').toLowerCase().includes((key2 || '').toLowerCase());
    };
    if (selectedFilter === 'Active') {
      data = (data || []).filter(i => !i.Discharged);
    }
    if (selectedFilter === 'Discharged') {
      data = (data || []).filter(i => i.Discharged);
    }
    if (name.trim() && isDataFilter) {
      data = data.filter(x => isIncludes(x.name, name));
    }
    const expandedRowRender = record => <span>This resident has not been assigned to tray Line.</span>;
    return (
      <div className="animated fadeIn residential-info with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false} size="small">
            <Menu.Item key="new" onClick={() => this.onClickButton('new')}>
              <Icon type="plus"/>
              New
            </Menu.Item>
            {selectedResidentId && <Menu.Item key="Open" onClick={() => this.onClickButton('open')}>
              <Icon type="folder-open"/>
              Open
            </Menu.Item> }
          </Menu>
          <div className="pull-right mr-10" style={{marginTop: -36}}>
            <Dropdown.Button overlay={this.getMenu()} icon={<Icon type="filter" />}>
            {selectedFilter || 'all'}
            </Dropdown.Button>
          </div>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="min-height-card">
                {
                  loading ? <Loader/>
                    :
                    <CustomGrid
                      className={'dx-card wide-card'}
                      refCallback={(dg) => this.dg = dg}
                      dataSource={data}
                      showBorders={true}
                      focusedRowEnabled={true}
                      columnAutoWidth={false}
                      keyExpr="PKey_Patient"
                      columnHidingEnabled={false}
                      gridClass="common-height"
                    >
                      <Paging defaultPageSize={5}/>
                      <Pager showPageSizeSelector={true} showInfo={true}/>
                      <Column caption={'Unit'} dataField={'Unit'} width={"15%"}/>
                      <Column caption={'Rm'} dataField={'Room_No'} width={"5%"}/>
                      <Column caption={'B'} dataField={'Bed_No'} width={"5%"}/>
                      <Column caption={'Name'} width={"50%"} dataField={'name'} cellRender={(record) => {
                        return (
                          <span onClick={() => this.onRedirect(record.data.PKey_Patient)}>{record.data.name}</span>)
                      }}/>
                      <Column caption={'Weight'} dataField={'Weight'} width={"10%"}/>
                      <Column caption={'Birth Date'} dataField={'BirthDate'} width={"10%"} cellRender={(record) => <span>{moment(record.data.BirthDate).format("DD/MM/YYYY")}</span>}/>
                      <Column  width={"5%"} headerCellRender={() => <span className="mr-10 text-primary cursor-pointer" onClick={() => this.onClickButton('new')}>New</span>}
                               cellRender={(record) => {
                        const menu = (
                          <Menu>
                            <Menu.Item onClick={() => this.onDelete(record.data)}>
                              <span className="text-primary ml-5 cursor-pointer">Delete</span>
                            </Menu.Item>
                          </Menu>
                        );
                        return (
                          <div className="flex-align-item-center">
                            <Dropdown overlay={menu} trigger={['click']}>
                              <i className="icon-options-vertical text-primary cursor-pointer"/>
                            </Dropdown>
                          </div>
                        )
                      }}/>
                      <MasterDetail
                        enabled={false}
                        autoExpandAll={true}
                        component={expandedRowRender}
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

const mapStateToProps = ({misc}) => ({
  selectedResidentId: misc.selectedResidentId,
  selectedResidentTab: misc.selectedResidentTab,
});

const mapDispatchToProps = (dispatch) => ({
  storeSelection: (state) => {
    return dispatch(storeSelection(state))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ResidentialInfo);
