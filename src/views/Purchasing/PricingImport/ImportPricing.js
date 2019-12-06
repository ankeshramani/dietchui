import React, {Component} from "react";
import {Button, DatePicker, Form, message, Modal, Spin, Col, Row} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import CustomGrid from "../../../components/CustomGrid";
import {Editing} from "devextreme-react/data-grid";
import {dateFormat} from "../../../services/common";
import CSVReader from "react-csv-reader";

class ImportPricing extends Component {
  _apiService = new ApiService();
  state = {
    isLoading: false,
    columnSetupData: [],
    importData: [], // data.rows.map((x, index) => ({rowIndex: index, ...x})),
    importColumns: [],
  }

  componentDidMount() {
    this.getColumnSetupData()
  }

  getColumnSetupData = async () => {
    const {selectedSupplierContracts} = this.props
    this.setState({
      isLoading: true
    });
    const data = await this._apiService.getColumnSetupData(selectedSupplierContracts && selectedSupplierContracts.PKey_Pur_SupplierContract) || []
    if(!data || data.error){
      message.error('Something went wrong!')
      this.setState({
        isLoading: false,
      })
    } else {
      const {importColumns} = this.state;
      importColumns.forEach(column => {
        if (data.some(x => x.MappedColumnName === column.dataField)) {
          column.visible = true;
        } else {
          column.visible = false;
        }
      });
      this.setState({
        columnSetupData: data,
        importColumns,
        isLoading: false,
      })
    }
  }

  saveImportData = async () => {
    const {selectedSupplierContracts} = this.props;
    const {importData, startDate, endDate} = this.state;
    this.setState({
      isSaving: true,
    });
    const payload = {
      PKeyPurSupplier: selectedSupplierContracts.FKey_Pur_Supplier,
      PKeyPurSupplierContract: selectedSupplierContracts.PKey_Pur_SupplierContract,
      StartDate: startDate,
      EndDate: endDate,
      DtSourceSerailized: JSON.stringify(importData),
    }
    const data = await this._apiService.savePrices(payload, selectedSupplierContracts.FKey_Pur_Supplier);
    if(!data || data.error){
      message.error('Something went wrong!')
      this.setState({
        isSaving: false,
      })
    } else {
      message.success('Pricing Imported Successfully!');
      this.setState({
        isSaving: false,
      });
      this.props.showModalImportPricing();
    }
  }

  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onRowUpdated = (record) => {
    const { importData } = this.state;
    importData[record.data.rowIndex] = record.data;
    this.setState({
      importData,
    });
  }

  loadCSV = (CSVdata) => {
    const {columnSetupData} = this.state;
    if (CSVdata.length > 1) {
      const importColumns = CSVdata[0].map(column => ({dataField: column, caption: column, visible: false}));
      const importData = [];
      CSVdata.slice(1, CSVdata.length - 1).forEach(row => {
        const objData = {};
        row.forEach((rowData, index) => {
          objData[importColumns[index].dataField] = rowData;
        });
        importData.push(objData);
      });
      importColumns.forEach(column => {
        if (columnSetupData.some(x => x.MappedColumnName === column.dataField)) {
          column.visible = true;
        } else {
          column.visible = false;
        }
      });
      this.setState({
        importColumns,
        importData,
      }, () => this.refreshGrid());
    } else {
      message.error('No Data Found in File');
    }
  }

  refreshGrid = () => {
    if (this.dg && this.dg.instance) {
      this.dg.instance.refresh()
    }
  }
  render() {
    const {showModalImportPricing, isImportPricing} = this.props;
    const {importData, importColumns} = this.state;
    const {isLoading, isSaving} = this.state;
    const formItemLayout = {
      labelCol: {
        md: {
          span: 5
        }
      },
      wrapperCol: {
        md: {
          span: 19
        }
      },
      labelAlign: 'right'
    };
    return (
      <Modal
        title="Import Pricing"
        visible={isImportPricing}
        onCancel={showModalImportPricing}
        onOk={this.saveImportData}
        footer={[
          <Button key="submit" type="primary" onClick={this.saveImportData}>
            {isSaving ? <Spin className="white" size={"small"}/>  : 'Import'}
          </Button>,
          <Button key="back" onClick={showModalImportPricing}>
            Cancel
          </Button>,

        ]}
        width={800}
      >
        {
          isLoading ? <Loader className="mt-50"/> :
            <>
              <Row className="flex-align-item-center mt-10">
                <Col md={12} sm={12} xs={12}>
                  <CSVReader
                    onFileLoaded={this.loadCSV}
                    inputStyle={{color: 'red'}}
                  />
                </Col>
              </Row>
              <Form {...formItemLayout} className="pt-10">
                <Row>
                  <Col md={12} sm={24}>
                    <Form.Item label="Start Date">
                      <DatePicker format={dateFormat} style={{width:"100%"}} onChange={(date, dateString) => this.onChange({
                        target: {
                          name: 'StartDate',
                          value: dateString
                        }
                      })}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} sm={24} >
                    <Form.Item label="End Date">
                      <DatePicker format={dateFormat} style={{width:"100%"}} onChange={(date, dateString) => this.onChange({
                        target: {
                          name: 'EndDate',
                          value: dateString
                        }
                      })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              {
                importData.length > 0 &&
                <Row>
                  <Col md={12} sm={12} xs={12}>
                    <CustomGrid
                      refCallback={(dg) => this.dg = dg}
                      dataSource={importData}
                      defaultColumns={importColumns}
                      columnAutoWidth={false}
                      rowKey="rowIndex"
                      gridClass="import-pricing"
                      onRowUpdated={this.onRowUpdated}
                    >
                      <Editing
                        mode={'batch'}
                        allowDeleting={true}
                        allowUpdating={true}
                        useIcons={false}
                      />
                    </CustomGrid>
                  </Col>
                </Row>
              }
            </>
        }
      </Modal>
    )
  }

}

export default ImportPricing
