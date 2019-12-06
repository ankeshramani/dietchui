import axios from "axios";
import moment from "moment";
import {getAuthHeaders} from "./common";

const apiEndPoint = localStorage.getItem('apiEndPoint') || 'https://dsapi.dietechsoftware.com/api';
const reportsApiEndPoint = localStorage.getItem('reportsApiEndPoint') || 'https://dsapi.dietechsoftware.com/reports/api';
const reportsUrl = process.env.NODE_ENV === 'production' ? reportsApiEndPoint : '/reports/api';
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? apiEndPoint : '/api',
});
// const axiosInstanceForReport = axios.create({
//   baseURL: process.env.NODE_ENV === 'production' ? reportsApiEndPoint : '/reports/api',
// });

const getFacilityKey = () => {
  return localStorage.getItem('facilityKey');
};

const getSerialNumber = () => {
  return localStorage.getItem('SerialNumber');
};

const getKey = () => {
  return `${localStorage.getItem('SerialNumber')}:${localStorage.getItem('facilityKey')}`
}

export class ApiService {

  getAuthToken = () => localStorage.getItem('accessToken');

  async getData(url, headers, cancelToken, data) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      },
    };
    if (data) {
      config.data = data;
    }
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    const response = await axiosInstance.get(url, config).catch((err) => {
      data = {error: 'something went wrong'};
    });
    return data || response.data;
  }

  async postMethod(url, data, headers, cancelToken) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      }
    };
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    let resData = '';
    const response = await axiosInstance.post(url, data, config).catch(thrown => {
      if (thrown.toString() === 'Cancel') {
        resData = 'cancel';
      } else {
        resData = {error: 'something went wrong'};;
      }
    });
    return resData || response.data;
  }

  async putMethod(url, data, headers) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      }
    };
    let resData = '';
    const response = await axiosInstance.put(url, data, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async deleteMethod(url, data, headers) {
    const config = {
      headers: {
        ...getAuthHeaders(),
        ...(headers || {})
      },
      data
    };
    let resData = '';
    const response = await axiosInstance.delete(url, config).catch(err => {
      resData = {error: 'something went wrong'};
    });
    return resData || response.data;
  }

  async getResidentialInfo(){
    return await this.getData(`/dietech/patient/get/${getKey()}`);
  }

  async getPatient(patientId){
    return await this.getData(`/dietech/patient/get/${getKey()}/${patientId}`);
  }

  async getPatientDietLatest(patientId){
    return await this.getData(`/dietech/patient/dietlatest/${getKey()}/${patientId}`);
  }

  async getSpecialNeeds(patientId){
    return await this.getData(`/dietech/patient/specialneeds/${getKey()}/${patientId}`);
  }

  async deleteResidentialInfo(id, payload){
    return await this.deleteMethod(`/dietech/patient/delete/${getKey()}`, payload);
  }

  async getFacilities(){
    return await this.getData(`/dietech/facilitysettings/getfacilities/${getSerialNumber()}`);
  }

  async getPatientWeights(patientId){
    return await this.getData(`/dietech/patient/weights/${getKey()}/${patientId}`);
  }

  async postPatientWeight(patientId, body){
    return await this.postMethod(`/dietech/patient/weight/addOrUpdate/${getKey()}/${patientId}`, body);
  }

  async postPatientAdjustments(patientId, body){
    return await this.postMethod(`/dietech/patient/adjustments/addOrUpdate/${getKey()}/${patientId}`, body);
  }

  async deletePatientWeight(patientId,weightID){
    return await this.deleteMethod(`/dietech/patient/weight/delete/${getKey()}/${patientId}/${weightID}`);
  }

  async deletePatientadAustments(patientId,austmentsId){
    return await this.deleteMethod(`/dietech/patient/adjustments/delete/${getKey()}/${patientId}/${austmentsId}`);
  }

  async getTubeFeedsLabels(patientId){
    return await this.getData(`/dietech/patient/tubefeedlabels/${getKey()}/${patientId}`);
  }

  async getTubeFeedSizeMethod(){
    return await this.getData(`dietech/common/GetEnumDetails/${getKey()}/TubeFeedSizeMethod`);
  }

  async getTubeFeedTypeOfTube(){
    return await this.getData(`dietech/common/GetEnumDetails/${getKey()}/TubeFeedTypeOfTube`);
  }

  async getProductionMealPattern(patientId){
    return await this.getData(`/dietech/patient/productionmealpattern/${getKey()}/${patientId}`);
  }

  async getProductionAdjustments(patientId){
    return await this.getData(`/dietech/patient/productionadjustments/${getKey()}/${patientId}`);
  }

  async getTubeFeeds(patientId){
    return await this.getData(`/dietech/patient/tubefeed/${getKey()}/${patientId}`);
  }

  async getNotes(patientId){
    return await this.getData(`/dietech/patient/notes/${getKey()}/${patientId}`);
  }

  async getDiets(patientId){
    return await this.getData(`dietech/patient/diets/${getKey()}/${patientId}`);
  }

  async dietHistoryAddOrUpdate(patientId, payload){
    return await this.postMethod(`/dietech/patient/diethistory/addOrUpdate/${getKey()}/${patientId}`, payload);
  }

  async noteAddOrUpdate(patientId, payload){
    return await this.postMethod(`/dietech/patient/note/addOrUpdate/${getKey()}/${patientId}`, payload);
  }

  async deleteDietHistory(patientId, dietId){
    return await this.deleteMethod(`dietech/patient/diethistory/delete/${getKey()}/${patientId}/${dietId}`,);
  }

  async deleteNote(patientId, noteId){
    return await this.deleteMethod(`/dietech/patient/note/delete/${getKey()}/${patientId}/${noteId}`,);
  }

  async getAdmittedResidents(facilityKey, hours){
    return await this.getData(`/dietech/patient/getadmittedresidents/${getKey()}/${hours}`);
  }

  async getDischargedResidents(facilityKey, hours){
    return await this.getData(`/dietech/patient/getdischargedresidents/${getKey()}/${hours}`);
  }

  async getSqlDietFlucs(facilityKey, hours){
    const date = moment().add(parseInt(`-${hours}`), 'day').format('YYYY-MM-DD');
    return await this.getData(`/dietech/patient/sqlDietFlucsSelect/${getKey()}?dStart=${date}`);
  }

  async getOrderGuides(facilityId){
    return await this.getData(`/purchasing/orderguide/GetByFacility/${getKey()}`);
  }

  async getOrderGuideDetails(id){
    return await this.getData(`/purchasing/orderGuideDetail/GetByOrderGuide/${getKey()}/${id}`);
  }

  async getOrderGuideDetailById(id) {
    return await this.getData(`/purchasing/orderGuideDetail/get/${getKey()}/${id}`);
  }

  async deleteOrderGuideDetailById(id) {
    return await this.deleteMethod(`/purchasing/orderGuideDetail/delete/${getKey()}/${id}`);
  }

  async updateOrderGuide(payload){
    payload.FKey_Facility = getFacilityKey();
    return await this.putMethod(`/purchasing/orderguide/addorupdate/${getKey()}`, payload);
  }

  async updateOrderGuideDetails(payload){
    payload.FKey_Facility = getFacilityKey();
    return await this.putMethod(`/purchasing/orderguidedetail/addorupdate/${getKey()}`, payload);
  }
  async updateEditBidDetail(PKey_OP_OrderGuide_Detail, FKey_OP_Supplier_Bid){
    return await this.putMethod(`/purchasing/orderGuideDetail/changeBid/${getKey()}/${PKey_OP_OrderGuide_Detail}/${FKey_OP_Supplier_Bid}`);
  }

  async getFillOPContact(id){
    return await this.getData(`/purchasing/contact/FillOPContact/${id}`);
  }

  async updateContact(data){
    return await this.putMethod(`/purchasing/contact/addorupdate/${getKey()}`, data);
  }

  async updatePatient(data){
    return await this.putMethod(`/dietech/patient/addOrUpdate/${getKey()}`, data);
  }

  async getDepartment(facilityKey){
    return await this.getData(`/purchasing/department/get/${getKey()}`);
  }

  async getContactsByDepartment(id){
    return await this.getData(`/purchasing/contact/GetByDepartment/${getKey()}/${id}`);
  }

 async getDepartmentContact(id){
    return await this.getData(`/purchasing/DepartmentContact/getByDepartment/${getKey()}/${id}`);
  }

  async updateDepartment(data){
    return await this.putMethod(`/purchasing/department/addOrUpdate/${getKey()}`, data);
  }

  async deleteDepartment(id){
    return await this.deleteMethod(`/purchasing/department/delete/${getKey()}/${id}`);
  }

  async getinventoryLocation(facilityKey){
    return await this.getData(`/purchasing/inventoryLocation/get/${getKey()}`);
  }

  async updateinventoryLocation(data){
    return await this.putMethod(`/purchasing/inventorylocation/addorupdate/${getKey()}`,data);
  }

  async updateParLevel(data){
    return await this.putMethod(`/purchasing/ParLevel/AddOrUpdate/${getKey()}`,data);
  }

  async getLedgar(){
    return await this.getData(`/purchasing/ledger/get/${getKey()}`);
  }

  async updateLedgar(data){
    return await this.putMethod(`/purchasing/ledger/addOrUpdate/${getKey()}`, data);
  }

  async getSupplier(){
    return await this.getData(`/purchasing/supplier/get/${getKey()}`);
  }

  async updateSupplier(data){
    return await this.putMethod(`/purchasing/supplier/addorupdate/${getKey()}`, data);
  }

  async getSets(facilityKey){
    return await this.getData(`/dietech/reports/SubControls/GetSets/${facilityKey}`);
  }

  async getSupplierContact(supplierId){
    return await this.getData(`/purchasing/SupplierContact/getBySupplier/${getKey()}/${supplierId}`);
  }

  async updateSupplierContact(data){
    return await this.putMethod(`/purchasing/contact/addorupdate/${getKey()}`, data);
  }

  async getSupplierfacility(){
    return await this.getData(`/purchasing/supplierfacility/get/${getKey()}`);
  }

  async updateSupplierfacility(data){
    return await this.putMethod(`/purchasing/supplierfacility/addorupdate/${getKey()}`, data);
  }

  async getContectManager(){
    return await this.getData(`/purchasing/contact/get/${getKey()}`);
  }
  async getSupplierContracts(){
    return await this.getData(`/dietechPricing/GetSupplierContracts/${getKey()}`);
  }

  async getTblItem(){
    return await this.getData(`/dietech/item/TblItem_Select/${getKey()}/0`);
  }

  async onOrder(data){
    return await this.postMethod(`/purchasing/po/buildPOs/${getKey()}`, data);
  }

  async insertPOOrder(data){
    return await this.postMethod(`/purchasing/po/insertPOs/${getKey()}`, data);
  }

  async getCatalog(){
    return await this.getData(`/purchasing/catalog/get/${getKey()}`);
  }

  async updateCatalog(data){
    return await this.putMethod(`/purchasing/catalog/addOrUpdate/${getKey()}`, data);
  }

  async deleteCatalog(data){
    return await this.deleteMethod(`/purchasing/catalog/delete/${getKey()}`, data);
  }

  async deleteSupplierFacility(id){
    return await this.deleteMethod(`/purchasing/SupplierFacility/delete/${getKey()}/${id}`);
  }

  async deletePerLevel(id){
    return await this.deleteMethod(`/purchasing/ParLevel/delete/${getKey()}/${id}`);
  }

  async deleteInvoiceDetail(id){
    return await this.deleteMethod(`/purchasing/InvoiceDetail/delete/${getKey()}/${id}`);
  }

  async deletePoDetail(id){
    return await this.deleteMethod(`/purchasing/podetail/delete/${getKey()}/${id}`);
  }

  async deleteInvoice(id){
    return await this.deleteMethod(`/purchasing/invoice/delete/${getKey()}/${id}`);
  }

  async deletePo(id){
    return await this.deleteMethod(`/purchasing/po/delete/${getKey()}/${id}`);
  }

  async deleteContact(id){
    return await this.deleteMethod(`/purchasing/contact/delete/${getKey()}/${id}`);
  }

  async deleteSupplier(id){
    return await this.deleteMethod(`/purchasing/supplier/delete/${getKey()}/${id}`);
  }

  async deleteLedger(id){
    return await this.deleteMethod(`/purchasing/ledger/delete/${getKey()}/${id}`);
  }

  async deleteInventoryLocation(id){
    return await this.deleteMethod(`/purchasing/inventoryLocation/delete/${getKey()}/${id}`);
  }

  async deleteDepartmentContact(id){
    return await this.deleteMethod(`/purchasing/DepartmentContact/delete/${getKey()}/${id}`);
  }

  async deleteSupplierContact(id){
    return await this.deleteMethod(`/purchasing/SupplierContact/delete/${getKey()}/${id}`);
  }

  async getSupplirBids(id){
    return await this.getData(`/purchasing/supplierBid/GetBySupplier/${getKey()}/${id}`);
  }

  async getPoDetailSupplirBids(id){
    return await this.getData(`/purchasing/poDetail/GetBySupplierBid/${getKey()}/${id}`);
  }

  async getSupplierBidPriceHistory(id){
    return await this.getData(`/purchasing/SupplierBidPriceHistory/GetBySupplierBid/${getKey()}/${id}`);
  }

  async updateSupplirBids(data){
    return await this.putMethod(`/purchasing/SupplierBid/addOrUpdate/${getKey()}`,data);
  }

  async onBirthdayPrint(data){
    data.FKey_Facility = getFacilityKey();
    return await this.postMethod(`/dietech/reports/birthday/${getKey()}`,data);
  }

  async getReportsList() {
    return await this.getData(`/dietech/reports/list/${getKey()}`);
  }

  async favoriteReport(data) {
    return await this.postMethod(`/dietech/reports/UserReportFavorite/AddOrUpdate/${getKey()}`, data);
  }

  async deleteFavoriteReport(id) {
    return await this.deleteMethod(`/dietech/reports/UserReportFavorite/delete/${getKey()}/${id}`);
  }

  async getFavoriteReports() {
    return await this.getData(`/dietech/reports/UserReportFavorite/GetByUserId/${getKey()}`);
  }

  async getFavoriteReportsWithDetails() {
    return await this.getData(`/dietech/reports/UserReportFavorite/GetByUserIdWithInfo/${getKey()}`);
  }

  async getInvoices() {
    return await this.getData(`/purchasing/invoice/get/${getKey()}`);
  }

  async getInvoicesByDepartment() {
    return await this.getData(`/dietech/invoice/summary/getByDeptAndS2Facility/${getKey()}/${getFacilityKey()}`);
  }

  async getInvoicesByMonth() {
    return await this.getData(`/dietech/invoice/summary/getByMonthAndS2Facility/${getKey()}/${getFacilityKey()}`);
  }

  async getPo() {
    return await this.getData(`/purchasing/po/get/${getKey()}`);
  }

  async getInvoiceDetails(invoiceId) {
    return await this.getData(`/purchasing/invoicedetail/GetByInvoice/${getKey()}/${invoiceId}`);
  }

  async getGetByPo(poId) {
    return await this.getData(`purchasing/poDetail/GetByPo/${getKey()}/${poId}`);
  }

  async getParLevel() {
    return await this.getData(`/purchasing/ParLevel/get/${getKey()}`);
  }

  async addUpdateInvoiceDetails(payload) {
    return await this.postMethod(`/purchasing/InvoiceDetail/addOrUpdate/${getKey()}`, payload);
  }

  async addUpdateMultipleInvoiceDetails(payload) {
    return await this.postMethod(`/purchasing/InvoiceDetail/insert/${getKey()}`, payload);
  }

  async addUpdateMultiplePoDetail(payload) {
    return await this.postMethod(`/purchasing/PoDetail/insert/${getKey()}`, payload);
  }

  async getInvoiceData(invoiceId) {
    return await this.getData(`/purchasing/invoice/get/${getKey()}/${invoiceId}`);
  }

  async getByPo(poId) {
    return await this.getData(`/purchasing/po/get/${getKey()}/${poId}`);
  }

  async addUpdateInvoice(payload) {
    return await this.postMethod(`/purchasing/invoice/addOrUpdate/${getKey()}`, payload);
  }

  async addUpdatePo(payload) {
    return await this.postMethod(`/purchasing/po/addOrUpdate/${getKey()}`, payload);
  }

  async GetReportDocuments(data) {
    return await this.postMethod(`/dietech/reports/GetReportDocuments/${getKey()}`, data);
  }

  async getDropDownValues(payload) {
    return await this.postMethod(`/dietech/common/getDropDowns/${getKey()}`, payload);
  }

  async getDropDownsDietech(payload) {
    return await this.postMethod(`dietech/common/getDropDownsDietech/${getKey()}`, payload);
  }

  async searchSupplierBid(payload, source) {
    return await this.postMethod(`/purchasing/supplierBid/search/${getKey()}`, payload, {} ,source);
  }

  async searchItem(payload, source) {
    return await this.postMethod(`/dietech/item/search/${getKey()}`, payload, {} ,source);
  }

  async getSupplierItemLinkByItem(itemId) {
    return await this.getData(`/purchasing/SupplierItemLink/GetByItem/${getKey()}/${itemId}`);
  }

  async getByPerLevel(Id) {
    return await this.getData(`/purchasing/ParLevel/get/${getKey()}/${Id}`);
  }

  async getSupplierItemLink() {
    return await this.getData(`/purchasing/SupplierItemLink/get/${getKey()}`);
  }

  async postSupplierItemLink(data) {
    return await this.postMethod(`/purchasing/SupplierItemLink/addOrUpdate/${getKey()}`, data);
  }

  async lockSupplierBid(fKey_OP_Supplier_Bid, fKey_OP_OrderGuide_Detail) {
    return await this.putMethod(`/purchasing/orderGuideDetail/lockSupplierBid/${getKey()}/${fKey_OP_Supplier_Bid}/${fKey_OP_OrderGuide_Detail}`,{});
  }
  async unLockSupplierBid(fKey_OP_Supplier_Bid, fKey_OP_OrderGuide_Detail) {
    return await this.putMethod(`/purchasing/orderGuideDetail/UnlockSupplierBid/${getKey()}/${fKey_OP_Supplier_Bid}/${fKey_OP_OrderGuide_Detail}`,{});
  }

  async getItemUnit() {
    return await this.getData(`/dietech/ItemUnit/get/${getKey()}`);
  }

  async GetSupplierLinkBySupplierBid(bidId) {
    return await this.getData(`/purchasing/SupplierItemLink/GetBySupplierBid/${getKey()}/${bidId}`)
  }

  async GetSupplierEditBid(bidId) {
    return await this.getData(`/purchasing/SupplierItemLink/GetByItem/${getKey()}/${bidId}`)
  }

  async getPurchasingHistory(bidId) {
    return await this.getData(`/purchasing/orderingUtils/GetPurchasingHistory/${getKey()}/${bidId}`)
  }
  async getPurchasingFacility(facilityId) {
    return await this.getData(`/purchasing/PurchasingFacility/getByFacility/${getKey()}`)
  }

  async purchasingFacility(data) {
    return await this.postMethod(`/purchasing/PurchasingFacility/AddOrUpdate/${getKey()}`,data)
  }



  async printReport(data) {
    const response = await fetch(`${reportsUrl}/report`, {
        method: 'PUT', // specifying the method request
        body: JSON.stringify(data), // specifying the body
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`
        }
      }
    );

    if (response.ok) {
      const blob = await response.blob();
      const file = new Blob([blob], {type: 'application/pdf'});
      let filename = 'reports.pdf';
      if (response.headers.get("content-disposition")) {
        let content = response.headers.get("content-disposition").split(";");
        if (content.length > 1) {
          content = content[1].split('=');
          if (content.length > 1) {
            filename = content[1] && content[1].trim();
          }
        }
      }
      return { file, filename: filename || 'reports.pdf'};
    } else {
      return '';
    }

  }

  async getbuildPOsLite(payload){
    return await this.postMethod(`/purchasing/po/buildPOsLite/${getKey()}`, payload);
  }

  async addOrUpdatePaymentType (payload){
    return await this.postMethod(`/purchasing/PaymentType/AddOrUpdate/${getKey()}`, payload);
  }

  async resetUnitPriceToLowest(id){
    return await this.putMethod(`/purchasing/orderGuideDetail/ResetUnitPriceToLowest/${getKey()}/${id}`, {});
  }

  async resetQty(id){
    return await this.putMethod(`/purchasing/orderGuideDetail/resetQty/${getKey()}/${id}`, {});
  }

  async getAllSupplierBid(){
    return await this.getData(`/purchasing/supplierBid/get/${getKey()}/`);
  }

  async getPaymentTypes(){
    return await this.getData(`/purchasing/paymentType/get/${getKey()}/`);
  }

  async getDeliveryHistory(invoiceId){
    return await this.getData(`/purchasing/PODeliveryHistory/GetByInvoice/${getKey()}/${invoiceId}`);
  }
  async getDeliveryHistoryByPo(poId){
    return await this.getData(`purchasing/invoiceHistory/GetByPo/${getKey()}/${poId}`);
  }

  async deletePaymentType(id) {
    return await this.deleteMethod(`/purchasing/paymentType/delete/${getKey()}/${id}`);
  }

  async getColumnSetupData(id) {
    return await this.getData(`/dietechPricing/GetColumnSetupData/${getKey()}/${id}`);
  }

  async savePrices(data, id) {
    return await this.postMethod(`/dietechPricing/SavePrices/${getKey()}/${id}`, data);
  }

  async departmentContactAddOrUpdate(data) {
    return await this.postMethod(`/purchasing/DepartmentContact/AddOrUpdate/${getKey()}`, data);
  }

  async supplierContactAddOrUpdate(data) {
      return await this.postMethod(`/purchasing/SupplierContact/AddOrUpdate/${getKey()}`, data);
  }

  async getEnumDetailsBidStatus() {
      return await this.getData(`/dietech/common/GetEnumDetails/${getKey()}/BidStatus`,);
  }

  async getOrderGuideDetailUsage(id) {
      return await this.getData(`/purchasing/OrderGuideDetailUsage/GetByOrderGuideDetail/${getKey()}/${id}`,);
  }
  async getItemNames() {
      return await this.getData(`/purchasing/orderGuideDetail/getItemNames/${getKey()}`,);
  }

  async moveOrderGuide(currentOrderGuideDetailId, currentOrderGuideId, data) {
      return await this.putMethod(`/purchasing/orderGuideDetail/changeOrderGuide/${getKey()}/${currentOrderGuideDetailId}/${currentOrderGuideId}`,data);
  }

  async changeSupplierBid(fKeyItem, supplierBidId, data) {
      return await this.putMethod(`/purchasing/orderGuideDetail/changeSupplierBid/${getKey()}/${fKeyItem}/${supplierBidId}`,data);
  }

}
