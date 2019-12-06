import React, {Component} from "react";
import {Card, CardBody, Col, Row} from "reactstrap";
import {ApiService} from "../../../services/ApiService";
import {Checkbox, Icon, Menu, message, Spin} from "antd";
// import {pdfjs} from "react-pdf";
import {ContextMenu, MenuItem} from "react-contextmenu";
import {connect} from "react-redux";
import moment from "moment";
import Loader from "../../Common/Loader";
import {dateFormat} from "../../../services/common";
import CustomGrid from "../../../components/CustomGrid";
import {Column} from "devextreme-react/data-grid";
import PdfViewer from "./PdfViewer";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
class ReportsDashboard extends Component {
  _apiService = new ApiService();

  state = {
    documents: [],
    selectedRecord: null,
    isSaving: false,
    isDataFilter: false,
    searchKey: '',
    loading: false,
    isPDFModal: false,
    extraColumns: [
      {name: 'CreatedBy', visible: false },
      {name: 'PageCount', visible: false },
      {name: 'StatusMessage', visible: false },
      {name: 'StatusDescription', visible: false }
    ],
  }

  componentDidMount() {
    this.getReportsDashboard()
  }

  getReportsDashboard = async () => {
    this.setState({
      loading: true,
    });
    const payload = {
      ViewAll: false,
      TestingMode: false
    };
    let data = await this._apiService.GetReportDocuments(payload);
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      })
    } else {
      if ((data || []).length > 1) {
        data = (data || []).sort((a,b) => moment.utc(b.DateTimeCreated).diff(moment.utc(a.DateTimeCreated)));
      }
      this.setState({
        documents: data || [],
        loading: false,
      })
    }
  }

  onColumnChange = (e) => {
    const {extraColumns} = this.state;
    const item = extraColumns.find(x => x.name === e.target.name);
    item.visible = e.target.checked;
    this.setState({
      extraColumns
    });
  }

  isModalOpen = () =>{
    this.setState({
      isPDFModal: !this.state.isPDFModal
    })
  }

  onPrint = async (record, type) => {
    const {documents = []} = this.state;
    const selectedRowId = record.data.PKey_RS_ReportDocument;
    this.setState({
      selectedRowIndex: record.rowIndex
    });
    const document = documents.find(x => x.PKey_RS_ReportDocument === selectedRowId);
    if (document && document.printData) {
      if (type === 'pdf') {
        this.downloadFile(document.printData, document.filename || 'reports.pdf');
      } else {
        this.setState({
          pdfFile: document.printData,
          isPDFModal: true,
        });
      }
      return;
    }
    if (document) {
      const payload = {
        ReportGUID: document.GUID,
        ConnectionGUID: localStorage.getItem('key_connection'),
        Auth0Token: localStorage.getItem('idToken'),
        "LoginEmail": "",
        "PrinterName": "",
        "AutoPrint": false,
        "AutoExportPDF": false,
        "HideProgress": false,
        "RdpVersion": "",
        "CombinePdfOnExport": false
      }
      this.setState({
        isSaving: true
      });
      const data = await this._apiService.printReport(payload);
      if (!data || data.error) {
        this.setState({
          isSaving: false
        });
        return message.error('Something went wrong!');
      }
      document.printData = data.file;
      document.filename = data.filename;
      const newState = {isSaving: false, pdfFile: data.file};
      if (type === 'pdf') {
        this.downloadFile(data.file, document.filename);
      } else {
        newState.isPDFModal= true;
      }
      this.setState({
        ...newState,
      });
    }
  }

  downloadFile = (blob) => {
    var fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL);
    // const link = document.createElement('a');
    // link.href = URL.createObjectURL(blob);
    // link.download = fileName;
    // document.body.append(link);
    // link.click();
    // link.remove();
    // window.addEventListener('focus', e => URL.revokeObjectURL(link.href), {once: true});
  };

  render() {
    const { loading, extraColumns, documents, pdfFile, isPDFModal, isSaving, selectedRowIndex} = this.state;
    const extraColumnss = extraColumns.filter(x => x.visible);
    return (
      <div className="animated fadeIn page-view with-print">
        <div className="print-button">
          <Menu mode="horizontal" selectable={false}>
            <Menu.Item key="new">
              <Icon type="printer" />
              Print
            </Menu.Item>
            <Menu.Item key="file-pdf">
              <Icon type="file-pdf" />
              Export to PDF
            </Menu.Item>
          </Menu>
        </div>
        <Row>
          <Col xs="12" sm="12" lg="12">
            <Card className="no-border">
              <CardBody className="pt-5 px-10 min-height-card">
                {
                  loading ? <Loader className="mt-50"/> :
                    <Row>
                      <Col md="12" sm="12" xs="12">
                        <CustomGrid
                          refCallback={(dg) => this.dg = dg}
                          dataSource={documents}
                          columnAutoWidth={false}
                          keyExpr="PKey_RS_ReportDocument"
                          selection={{ mode: 'single' }}
                          gridClass="common-height"
                        /*  onSelectionChanged={(selectedRowsData) => this.onRowSelect (selectedRowsData)}*/
                        >
                          <Column alignment="left" caption={'Report Name'} dataField={'ReportName'}  />
                          <Column alignment="left" caption={'Date For'} dataField={'DateFor'} />
                          <Column alignment="left" caption={'Detailed Report'} dataField={'DetailedReportName'}/>
                          <Column alignment="left" caption={'Created On'} dataField={'DateTimeCreated'} sortOrder={'desc'} dataType={'datetime'}/>
                          <Column alignment="left" caption={'Status'} dataField={'StatusName'}/>
                          <Column alignment="left" caption={'Last Printed'} cellRender={(record) => {
                            return <span>{record.data.LastPrintedDateTime  === "0001-01-01T00:00:00" ? "-" : moment(record.data.LastPrintedDateTime).format(dateFormat + ' h:mm A')}</span>
                          }}/>
                          {
                            (extraColumnss.find(x => x.name === 'CreatedBy')) ?
                              <Column alignment="left" caption={'Created By'} dataField={'CreatedBy'}/> :null
                          }
                          {
                            (extraColumnss.find(x => x.name === 'PageCount')) ?
                              <Column alignment="left" caption={'Page Count'} dataField={'PageCount'}/> : null
                          }
                          {
                            (extraColumnss.find(x => x.name === 'StatusMessage')) ?
                              <Column alignment="left" caption={'Status Message'} dataField={'StatusMessage'}/> : null
                          }
                          {
                            (extraColumnss.find(x => x.name === 'StatusDescription')) ?
                              <Column alignment="left" caption={'Status Description'} dataField={'StatusDescription'}/> : null
                          }
                          <Column alignment="left" width={100} cellRender={(record) => {
                              return (
                                <div>
                                  {isSaving && record.rowIndex === selectedRowIndex ? <Spin size={"small"}/> :
                                    <>
                                      <span className="mr-10 text-primary cursor-pointer" onClick={() => this.onPrint(record)}> <Icon type="printer" /></span>
                                      <a target="_blank" href={`/1/report-viewer?guid=${record.data.GUID}`}> <Icon type="file" /></a>
                                      <span className="mr-10 text-primary cursor-pointer" onClick={() => this.onPrint(record, 'pdf')}> <Icon type="file-pdf" /></span>
                                    </>
                                  }
                                </div>
                              )
                          }
                          }/>
                        </CustomGrid>
                      </Col>
                    </Row>
                }
                <PdfViewer isPDFModal={isPDFModal} pdfFile={pdfFile} isModalOpen={this.isModalOpen}/>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ContextMenu id="column-id">
          {
            extraColumns.map(x => (
              <MenuItem key={`check-${x.name}`}>
                <Checkbox checked={x.visible} name={x.name} onChange={this.onColumnChange}>{x.name}</Checkbox>
              </MenuItem>
            ))
          }
        </ContextMenu>
      </div>
    )
  }

}
const mapStateToProps = (state) => ({
  facilityKey: state.settings.facilityKey,
});
export default connect(mapStateToProps)(ReportsDashboard);
