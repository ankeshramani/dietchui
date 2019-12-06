import React from "react";
const Home = React.lazy(() => import('./views/Home/index'));
const PageView = React.lazy(() => import('./views/PageView/PageView'));
const ReportsList = React.lazy(() => import('./views/PageView/ReportsList'));
const AdminSettings = React.lazy(() => import('./views/AdminSettings'));
const Personalization = React.lazy(() => import('./views/AdminSettings/Personalization'));
const ResidentialInfo = React.lazy(() => import('./views/ResidentialInfo'));
const AddUpdateResident = React.lazy(() => import('./views/ResidentialInfo/AddUpdateResident'));
const Birthday = React.lazy(() => import('./views/Reports/Birthday'));
const Beverage = React.lazy(() => import('./views/Reports/Beverage'));
const ReportsDashboard = React.lazy(() => import('./views/Reports/ReportsDashboard'));
const Changes = React.lazy(() => import('./views/Reports/DietOrders/Changes'));
const PurchasingCatelog = React.lazy(() => import('./views/Purchasing/Catalog'));
const OrderGuides = React.lazy(() => import('./views/Purchasing/OrderGuides'));
const SupplierItemLink = React.lazy(() => import('./views/Purchasing/SupplierItemLink'));
const AddInvoice = React.lazy(() => import('./views/Purchasing/Invoices/AddInvoice'));
const Department = React.lazy(() => import('./views/Purchasing/Department'));
const Ledger = React.lazy(() => import('./views/Purchasing/Ledgers'));
const InventoryLocation = React.lazy(() => import('./views/Purchasing/InventoryLocation'));
const Supplier  = React.lazy(() => import('./views/Purchasing/Supplier'));
const ContactManager  = React.lazy(() => import('./views/Purchasing/ContactManager'));
const TblSelect  = React.lazy(() => import('./views/Item/TblSelect'));
const NewOrderGuid  = React.lazy(() => import('./views/Purchasing/NewOrder/NewOrderGuide'));
const InvoicesWithDevexpress  = React.lazy(() => import('./views/Purchasing/Invoices/InvoicesWithDevexpress'));
const ParLevel  = React.lazy(() => import('./views/Purchasing/ParLevel'));
const FacilitySetting  = React.lazy(() => import('./views/Purchasing/FacilitySettings'));
const PaymentType  = React.lazy(() => import('./views/Purchasing/PaymentType/PaymentType'));
const PricingImport  = React.lazy(() => import('./views/Purchasing/PricingImport/PricingImport'));
const Po  = React.lazy(() => import('./views/Purchasing/Po/Po'));
const AddPo  = React.lazy(() => import('./views/Purchasing/Po/AddPo'));
const Touch  = React.lazy(() => import('./views/Touch/index'));

const routes = [
  { path: '/dashboard', name: 'Dashboard', logo: 'D', component: Home },
  { path: '/purchasing', exact: true, logo: 'P', name: 'Purchasing', title: 'Purchasing', component: PageView },
  { path: '/purchasing/catalog', exact: true, name: "Catalog", logo: 'C', title: 'Purchasing Catalog',component: PurchasingCatelog },
  { path: '/purchasing/departments', exact: true, name: "Department", logo: 'D', title: 'Department',component: Department },
  { path: '/purchasing/ledgers', exact: true, name: "Ledger", title: 'Ledger', logo: 'L', component: Ledger },
  { path: '/purchasing/inventory-locations', exact: true, name: "Inventory Locations", logo: 'IL', title: 'InventoryLocation',component: InventoryLocation },
  { path: '/purchasing/suppliers', exact: true, name: "Supplier ", title: 'Supplier ', logo: 'S', component: Supplier  },
  { path: '/purchasing/payment-type', exact: true, name: "Payment Type ", title: 'Payment Type ', logo: 'PT', component: PaymentType  },
  { path: '/purchasing/par-level', exact: true, name: "Par Level ", title: 'Par Level ', logo: 'PL', component: ParLevel  },
  { path: '/purchasing/order-guides', exact: true, name: "Order Guides", title: 'Order Guides', logo: 'OG', component: OrderGuides },
  { path: '/purchasing/pricing-import', exact: true, name: "Pricing Import", title: 'Pricing Import', logo: 'PI', component: PricingImport },
  { path: '/purchasing/new-order', exact: true, name: 'New Order', logo: 'NO', title: 'New Order',component: NewOrderGuid },
  { path: '/purchasing/contact-manager', exact: true, name: "Contact Manager", logo: 'CM', title: 'Contact Manager',component: ContactManager },
  { path: '/purchasing/tbl-item', exact: true, name: "Item", logo: 'I', title: 'Item',component: TblSelect },
  { path: '/purchasing/invoices', exact: true, name: "Invoices", logo: 'I', title: 'Invoices',component: InvoicesWithDevexpress },
  { path: '/purchasing/purchase-order', exact: true, name: "Purchase Order", logo: 'PO', title: 'Purchase Order',component: Po },
  { path: '/purchasing/invoice/:invoiceId', exact: true, name: "Invoice", logo: 'I', title: 'Invoice',component: AddInvoice },
  { path: '/purchasing/purchase-order/:poId', exact: true, name: "Purchase Order", logo: 'Po', title: 'Purchase Order',component: AddPo },
  { path: '/links/reports', name: 'Reports', logo: 'R', component: ReportsList },
  { path: '/purchasing/supplier-item-link', name: 'Supplier item link', logo: 'S', component: SupplierItemLink },
  { path: '/links/:pageName', name: 'Quick Links', logo: 'QL', component: PageView },
  { path: '/admin-settings', name: 'Settings', logo: 'S', component: AdminSettings },
  { path: '/personalization', name: 'Personalization', logo: 'S', component: Personalization },
  { path: '/facility-settings', name: 'Facility Settings', logo: 'FS', component: FacilitySetting },
  { path: '/residents', name: 'Residents', logo: 'R', component: ResidentialInfo },
  { path: '/resident/:id', name: 'Residential Info', logo: 'RI', component: AddUpdateResident },
  { path: '/reports/birthday', logo: 'B', name: 'Birthdays', title: 'Birthday Report', component: Birthday },
  { path: '/reports/census', logo: 'B', name: 'Beverage', title: 'Beverage Report', component: Beverage },
  { path: '/reports/dashboard', logo: 'B', name: 'Reports Dashboard', title: 'Reports Dashboard', component: ReportsDashboard },
  { path: '/reports/diet-orders/changes', logo: 'C', name: 'Changes', title: 'Diet Orders Changes', component: Changes },
  { path: '/touch', logo: 'T', name: 'Touch', title: 'Touch', component: Touch },
];

export default routes;
