import React from 'react';
import {getReportViewer} from './ReportViewer'
import 'devextreme/dist/css/dx.common.css'
import 'devextreme/dist/css/dx.light.css'
import '@devexpress/analytics-core/dist/css/dx-analytics.common.css'
import '@devexpress/analytics-core/dist/css/dx-analytics.light.css'
import 'devexpress-reporting/dist/css/dx-webdocumentviewer.css'
import 'jquery-ui/themes/base/all.css'

class ReportViewer extends React.Component {

  componentDidMount() {
      getReportViewer('DXXRDV');
  }

  render() {
    return <div style={{width: '100%',height: 1000}} data-bind="dxReportViewer: viewerOptions" />
  }

}
 export default ReportViewer
