const $ = require('jquery');
const ko = require('knockout');

require('devexpress-reporting/dx-webdocumentviewer');

const urlParams = new URLSearchParams(window.location.search);

export const getReportViewer = (invokeAction) => {
  var myViewModel = {
    ReportGUID: urlParams.get('guid'),
    ConnectionGUID: localStorage.getItem('key_connection'),
    Auth0Token: localStorage.getItem('idToken'),
    LoginEmail: "",
    PrinterName: "",
    AutoPrint:false,
    AutoExportPDF:false,
    HideProgress:false,
    RdpVersion:"",
    CombinePdfOnExport:false

  };

  var host = localStorage.getItem('reportsApiEndPoint'); // 'https://dc896da9.ngrok.io/';
  var reportUrl = ko.observable("Report");
  var viewModel = {
    viewerOptions: {
      reportUrl: JSON.stringify(myViewModel), // The URL of a report that is opened in the Document Viewer when the application starts.
      requestOptions: { // Options for processing requests from the Web Document Viewer.
        host: host,
        invokeAction: invokeAction // The URI path of the controller action that processes requests.
      },
    }
  };
  ko.applyBindings(viewModel);
}

