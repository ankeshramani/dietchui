import React, {Component} from "react";
import {ApiService} from "../../../services/ApiService";
import {Modal, Button} from "antd";
// import {Document, Page} from "react-pdf";

class PdfViewer extends Component {
  _apiService = new ApiService();

  state = {
    currentPage: 1,
    numOfPages: 0
  }

  onDocumentLoadSuccess = (data) => {
    this.setState({
      numOfPages: data && data._pdfInfo.numPages
    });
  }

  onNext = () => {
    const {currentPage} = this.state;
    this.setState({
      currentPage: currentPage + 1
    })
  }

  onPrevious = () => {
    const {currentPage} = this.state;
    this.setState({
      currentPage: currentPage - 1
    })
  }

  render() {
    const {isPDFModal, isModalOpen, pdfFile} = this.props;
    const {currentPage, numOfPages} = this.state;
    return(
      <Modal
        visible={isPDFModal}
        title="PDF report"
        onCancel={isModalOpen}
        width={658}
        footer={null}
      >
        {
          pdfFile &&
          <>
            {
              numOfPages > 1 &&
              <div className="text-right">
                <Button disabled={currentPage === numOfPages} onClick={this.onNext}>Next</Button>
                <Button className="ml-5" disabled={currentPage === 1} onClick={this.onPrevious}>Previous</Button>
              </div>
            }

          {/*<Document*/}
            {/*file={pdfFile}*/}
            {/*onLoadSuccess={this.onDocumentLoadSuccess}*/}
          {/*>*/}
            {/*<Page pageNumber={currentPage} />*/}
          {/*</Document>*/}
          </>
        }
      </Modal>
    )
  }
}

export default PdfViewer
