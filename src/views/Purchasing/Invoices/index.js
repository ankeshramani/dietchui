import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {Button, Icon, Input, Menu, message} from "antd";
import moment from "moment";
import {ApiService} from "../../../services/ApiService";
import TableComp from "../../../components/TableComp";
import Loader from "../../Common/Loader";
import {connect} from "react-redux";
import clonedeep from "lodash.clonedeep";
import InvoiceDetails from "./InvoiceDetails";
import {dateFormat} from "../../../services/common";

class Invoices extends Component {
  _apiService = new ApiService();

  state = {
    invoices: [],
    loading: true,
    selectedRecord: null,
    isModal: false,
    isDataFilter: false,
    searchKey: '',
  }

  componentDidMount() {
    this.getInvoices()
  }

  getInvoices = async () =>{
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getInvoices(this.props.facilityKey)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        invoices: data,
        loading: false,
      })
    }
  }


  onEditRecord = (selectedRecord) => {
    this.setState({
      selectedRecord: clonedeep(selectedRecord)
    })
  }

  onRecordChange = (event) => {
    const {selectedRecord} = this.state;
    selectedRecord[event.target.name] = event.target.value;
    this.setState({
      selectedRecord
    });
  }

  addNewRecord = async (payload) => {
    this.setState({
      isSaving: true,
    });
    const {contactManager = []} = this.state;
    const data  = await this._apiService.updateContact(payload)
    if (!data || data.error){
      message.error('Something Wrong. Try again')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Contact Added Successfully');
      payload.PKey_OP_Contact = data;
      contactManager.push(payload);
      this.setState({
        selectedRecord: null,
        isModal: false,
        isSaving: false,
        contactManager
      });
    }
  }

  saveRecord = async () => {
    const {selectedRecord, contactManager = []} = this.state;
    this.setState({
      isSaving: true,
    });
    const data =  await this._apiService.updateContact(selectedRecord)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        isSaving: false,
      });
    } else {
      message.success('Contact Updated Successfully');
      const Index = contactManager.findIndex(x => x.PKey_OP_Contact === selectedRecord.PKey_OP_Contact);
      if (Index > -1) {
        contactManager[Index] = selectedRecord;
      }
      this.setState({
        selectedRecord: null,
        isSaving: false,
        contactManager
      });
    }
  }

  isModalOpen = () => {
    this.setState({
      isModal: !this.state.isModal,
    });
  }

  onFilterInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  onSearch = () => {
    this.setState({
      isDataFilter: true,
    })
  }

  onReset = () => {
    this.setState({
      isDataFilter: false,
      searchKey: ''
    })
  }

  getColumns = () => {
    const {selectedRecord, searchKey} = this.state;
    return [
      {
        title: 'PO Number',
        dataIndex: 'PoNumber',
        width:'20%',
        render: (name, record) => {
          if (selectedRecord && selectedRecord.PKey_OP_Invoice === record.PKey_OP_Invoice) {
            return (
              <Input value={selectedRecord.PoNumber} name="PoNumber" size="small" onChange={(event) => this.onRecordChange(event)}/>
            );
          } else {
            return (<span>{record.PoNumber}</span>);
          }
        },
        sorter: (a, b) => {
          return (a.PoNumber || '').toString().toUpperCase() < (b.PoNumber || '').toString().toUpperCase() ? -1 : 1;
        },
      },
      {
        title: 'Date',
        dataIndex: 'PoDate',
        width:'20%',
        render: (name,record) => {
          if (selectedRecord && selectedRecord.PKey_OP_Invoice === record.PKey_OP_Invoice) {
            return (
              <Input value={selectedRecord.PoDate} name="Date" size="small" onChange={(event) => this.onRecordChange(event)}/>
            );
          } else {
            return (<span>{record.PoDate ? moment(record.PoDate).format(dateFormat) : ''}</span>);
          }
        },
        sorter: (a, b) => {
          return moment(a.PoDate || '').format('YYYYMMDD') - moment(b.PoDate || '').format('YYYYMMDD');
        },
      },
      {
        title: 'Department',
        dataIndex: 'DepartmentName',
        width:'20%',
        render: (name,record) => {
          if (selectedRecord && selectedRecord.PKey_OP_Invoice === record.PKey_OP_Invoice) {
            return (
              <Input value={selectedRecord.DepartmentName} name="DepartmentName" size="small" onChange={(event) => this.onRecordChange(event)}/>
            );
          } else {
            return (<span>{record.DepartmentName}</span>);
          }
        },
        sorter: (a, b) => {
          return (a.DepartmentName || '').toString().toUpperCase() < (b.DepartmentName || '').toString().toUpperCase() ? -1 : 1;
        },
      },
      {
        title: 'Supplier',
        dataIndex: 'Supplier',
        align: 'center',
        width:'20%',
        render: (name,record) => {
          if (selectedRecord && selectedRecord.PKey_OP_Invoice === record.PKey_OP_Invoice) {
            return (
              <Input value={selectedRecord.Supplier_Name} name="Supplier_Name" size="small" onChange={(event) => this.onRecordChange(event)}/>
            );
          } else {
            return (<span>{record.Supplier_Name}</span>);
          }
        },
        sorter: (a, b) => {
          return (a.Supplier_Name || '').toString().toUpperCase() < (b.Supplier_Name || '').toString().toUpperCase() ? -1 : 1;
        },
      },
      {
        title: 'Total',
        dataIndex: 'PO_Total',
        align: 'right',
        width:'20%',
        render: (name, record) => {
          return <span>${record.PO_Total || 0}</span>
        },
        sorter: (a, b) => {
          return (a.PO_Total || '').toString().toUpperCase() < (b.PO_Total || '').toString().toUpperCase() ? -1 : 1;
        },
        filterDropdown: (
          <div className="px-5 py-5">
            <Input
              placeholder='Search...'
              name="searchKey"
              className="mb-5"
              value={searchKey}
              onChange={this.onFilterInputChange}
              style={{width: 200}}
            /> <br/>
            <Button
              type="primary"
              onClick={this.onSearch}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={this.onReset}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
      },
    ];
  }

  getFooter = () => {
    const {invoices} = this.state;
    let total = 0;
    invoices.forEach(x => {
      total += (x.PO_Total || 0);
    });
    return () => <div className="text-right">Total: {`$${total}`}</div>;
  }

  onRowSelect = (selectedRowId) => {
    this.setState({
      selectedRowId
    });
  }

  onOpen = () => {
    const {selectedRowId} = this.state;
    this.props.history.push(`/purchasing/invoice/${selectedRowId}`);
  }

  onNew = () => {
    this.props.history.push(`/purchasing/invoice/new`);
  }

  render() {
    const { loading, searchKey, isDataFilter, selectedRowId} = this.state;
    let invoices = this.state.invoices || [];
    if (searchKey.trim() && isDataFilter) {
      const isIncludes = (key1, key2) => {
        return (key1 || '').toString().toLowerCase().includes((key2 || '').toString().toLowerCase());
      };
      invoices = invoices.filter(x => isIncludes(x.PoNumber, searchKey) || isIncludes(x.PoDate, searchKey) || isIncludes(x.DepartmentName, searchKey) || isIncludes(x.Supplier_Name, searchKey));
    }
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button" title="Print">
          <Menu mode="horizontal" selectable={false}>
            {
              selectedRowId &&
              <Menu.Item key="Order" onClick={this.onOpen}>
                <Icon type="folder-open" />
                Open
              </Menu.Item>
            }
            <Menu.Item key="print">
              <Icon type="printer" />
              Print
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-5 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <>
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <TableComp
                          columns={this.getColumns()}
                          dataSource={invoices}
                          onRow={(record) => {
                            return {
                              onClick: () => this.onRowSelect(record.PKey_OP_Invoice),
                              className: selectedRowId === record.PKey_OP_Invoice ? 'selectedRow' : ''
                            };
                          }}
                          scroll={{y: 'calc(100vh - 310px)'}}
                          rowKey="PKey_OP_Invoice"
                          pagination={false}
                          footer={this.getFooter()}
                          expandedRowRender={record => <div><InvoiceDetails invoiceId={record.PKey_OP_Invoice}/></div>} />
                      </Col>
                    </Row>
                    </>
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

export default connect(mapStateToProps)(Invoices);
