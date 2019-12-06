import React, {Component} from "react";
import {message, Modal, Spin,} from "antd";
import {ApiService} from "../../../services/ApiService";
import Loader from "../../Common/Loader";
import CustomGrid from "../../../components/CustomGrid";
import {Column, DataGrid, MasterDetail, Pager, Paging, Summary, TotalItem} from "devextreme-react/data-grid";
import {formatNumber} from "../../../services/common";

class TotalSupplierBidModal extends Component {
  _apiService = new ApiService();

  state = {
    totalSupplier: [],
    isSaving: false,
    loading: true,
  }
  componentDidMount() {
    const  { selectedOrderGuides } = this.props;
    if(selectedOrderGuides && selectedOrderGuides.length){
      this.getbuildPOsLite()
    }else {
      message.error('Not selected Order Guide!')
    }
  }

  getbuildPOsLite = async () => {
    const  { selectedOrderGuides } = this.props;
    const payload = (selectedOrderGuides || []).map(x => ({PKey_OP_OrderGuide: x.PKey_OP_OrderGuide}));
    this.setState({
      loading: true,
    });
    const data = await this._apiService.getbuildPOsLite(payload)
    if(!data || data.error){
      message.error('Something went wrong. Please try again later!')
      this.setState({
        loading: false,
      });
    } else {
      this.setState({
        totalSupplier: data,
        loading: false,
      })
    }
  }

  render() {
    const {visible, onHide } = this.props;
    const {isSaving, loading, totalSupplier} = this.state;

    return (
      <Modal
        visible={visible}
        title="Total"
        okText={isSaving ? <Spin className="color-white"/> : 'Save'}
        onCancel={onHide}
        width={800}
        height={600}
        footer={null}
        cancelButtonProps={{className: 'pull-right ml-10'}}
      >
        <div>
            {
              loading ? <Loader className="mt-50"/> :
                <>
                  <CustomGrid
                    className={'dx-card wide-card'}
                    dataSource={totalSupplier}
                    isNoScroll={true}
                    showBorders={false}
                    focusedRowEnabled={true}
                    columnAutoWidth={false}
                    keyExpr="PKey_OP_PO"
                    gridClass="order-guid-lookup"
                  >
                    <Paging defaultPageSize={5} />
                    <Pager showPageSizeSelector={true} showInfo={true} />
                    <Column caption={'Supplier Name'} dataField={'SupplierName'}/>
                    <Column caption={'Department'} dataField={'DepartmentName'}/>
                    <Column caption={'FOB'} dataField={'FOB'}/>
                    <Column caption={'Minimum Met?'} dataField={'MinimumMet'} cellRender={(record) => {
                      return (record.data.MinimumMet) ? <span>Yes</span> : <span>No</span>
                    }}/>
                    <Column caption={'Min Order'} dataField={'MinOrder'}/>
                    <Column caption={'Total'} dataField={'Total'} cellRender={(record)=>{
                      return<span>{formatNumber(record.data.Total , 3)}</span>
                    }}/>
                    <Summary recalculateWhileEditing={true}>
                      <TotalItem
                        column={'Total'}
                        summaryType={'sum'}
                        displayFormat={(record) => {
                          return formatNumber(record , 3)
                        }}
                      />
                    </Summary>
                    <MasterDetail
                      enabled={true}
                      component={(record) => {
                        return <div>
                          <DataGrid
                            dataSource={record.data.data.details}
                            showBorders={false}
                            columnAutoWidth={false}
                          >
                            <Column  caption={'Product No'} dataField={'ProductNo'} />
                            <Column caption={'Description'} dataField={'Description'} />
                            <Column caption={'Brand'} dataField={'Brand'} />
                            <Column caption={'Pack/Size'} dataField={'PackSizeMeasure'} />
                            <Column caption={'Qty.'} dataField={'Qty'} />
                            <Column caption={'Price'} dataField={'Price'} cellRender={(record)=>{
                              return<span>{formatNumber(record.data.Price , 2)}</span>
                            }}/>
                          </DataGrid>
                        </div>
                      }}
                    />
                  </CustomGrid>
                </>
            }
        </div>
      </Modal>
    )
  }
}

export default TotalSupplierBidModal;
