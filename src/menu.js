export const menuNav = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'folder',
  },
  {
    text: 'Purchasing',
    icon: 'folder',
    path: '/purchasing',
  },
  {
    text: 'Residents',
    icon: 'folder',
    path: '/residents',
  },
  {
    text: 'Reports',
    icon: 'folder',
    path: '/links/reports',
  },
];

export const navigation = [
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: 'folder',
  },
  {
    text: 'Purchasing',
    icon: 'folder',
    iSearchable: false,
    searchKey: 'purchasing',
    path: '/purchasing',
    items: [
      {
        text: 'Ordering',
        items: [
          {
            text: 'Order Guide',
            path: '/purchasing/order-guides',
          },
          {
            text: 'Quick Order',
            path: '/purchasing/invoice/new',
          },
        ]
      },
      {
        text: 'Purchasing',
        items: [
          {
            text: 'Purchase Orders',
            path: '/purchasing/purchase-order'
          },
          {
            text: 'Receiving',
          },
          {
            text: 'Invoices',
            path: '/purchasing/invoices',
          },
          {
            text: 'Inventory',
            path: '/purchasing/catalog',
          },
        ]
      },
      {
        text: 'Tables',
        items: [
          {
            text: 'Departments',
            path: '/purchasing/departments',
          },
          {
            text: 'Inventory Locations',
            path: '/purchasing/inventory-locations',
          },
          {
            text: 'Ledgers',
            path: '/purchasing/ledgers',
          },
          {
            text: 'Suppliers',
            path: '/purchasing/suppliers',
          },
          {
            text: 'Contact Manager',
            path: '/purchasing/contact-manager',
          },
          {
            text: 'Catalog',
            path: '/purchasing/catalog',
          },
          {
            text: 'Par Level',
            path: '/purchasing/par-level',
          },
          {
            text: 'Payment Type',
            path: '/purchasing/payment-type',
          },
        ]
      },
      {
        text: 'Miscellaneous',
        items: [
          {
            text: 'Item',
            path: '/purchasing/tbl-item',
          },
          {
            text: 'Supplier Item Link',
            path: '/purchasing/supplier-item-link',
          },
          {
            text: 'Pricing Import',
            path: '/purchasing/pricing-import',
          },
        ]
      },
    ]
  },
  {
    text: 'Resident Info',
    icon: 'folder',
    iSearchable: true,
    searchKey: 'residentInfo',
    items: [
      {
        text: 'Cal, Protein & Fluid Needs',
        path: '/Cal, Protein & Fluid Needs',
        searchTags: ['test1'],
      },
      {
        text: 'Diet Fluctuations',
        path: '/Diet Fluctuations',
        searchTags: ['test2'],
      },
      {
        text: 'Intake Study',
        path: '/Intake Study',
        searchTags: ['test3'],
      },
      {
        text: 'Meal Pattern',
        path: '/Meal Pattern'
      },
      {
        text: 'Notes',
        path: '/Notes'
      },
      {
        text: 'Recommendations',
        path: '/Recommendations'
      },
      {
        text: 'Seating',
        path: '/Seating'
      },
      {
        text: 'Skin',
        path: '/Skin'
      },
      {
        text: 'Tube Feed',
        path: '/Tube Feed'
      },
      {
        text: 'Weight History',
        path: '/Weight History'
      },
    ]
  },
  {
    text: 'Miscellaneous',
    icon: 'folder',
    iSearchable: true,
    searchKey: 'misc',
    path: '/links/miscellaneous',
    items: [
      {
        text: 'Miscellaneous',
        items:[
          {
            text: 'Bulk Order',
            path: '/Bulk Order',
            searchTags: ['test1']
          },
          {
            text: 'Dining Rooms',
            path: '/Dining Rooms'
          },
          {
            text: 'Items',
            path: '/Items'
          },
          {
            text: 'Menu Cycle',
            path: '/Menu Cycle'
          },
          {
            text: 'Nutritional Analysis',
            path: '/Nutritional Analysis'
          },
          {
            text: 'Recipes',
            path: '/Recipes'
          },
          {
            text: 'Try Line Setup',
            path: '/Try Line Setup'
          },
          {
            text: 'Weight Entry',
            path: '/Weight Entry'
          },
        ]

      },
      {
        text: 'Analysis',
        items:[
          {
            text: 'Served Items',
            path: '/Served Items'
          },
        ]
      },
      {
        text: 'Tables',
        items:[
          {
            text: 'Diet List',
            path: '/diet-list'
          },
          {
            text: 'Menu Categories',
            path: '/Menu Categories'
          },
          {
            text: 'Special Needs',
            path: '/Special Needs'
          },
        ]
      },

    ]
  },
  {
    text: 'Reports',
    icon: 'folder',
    iSearchable: true,
    searchKey: 'reports',
    path: '/links/reports',
    items: [
      {
        text: 'Acceptance',
        items:[
          {
            text: 'Meal Acceptance',
            path: '/Meal Acceptance'
          },
          {
            text: 'Med Pass Acceptance',
            path: '/Med Pass Acceptance'
          },
          {
            text: 'Monthly Acceptance',
            path: '/Monthly Acceptance'
          },
          {
            text: 'Nourishment Acceptance',
            path: '/Nourishment Acceptance'
          },
        ]
      },
      {
        text: 'Beverage',
        path: '/reports/beverage',
        searchTags: ['tally']
      },
      {
        text: 'Birthdays',
        path: '/reports/birthdays'
      },
      {
        text: 'Cost Analysis',
        items:[
          {
            text: 'one',
            path: '/one'
          },
        ]
      },
      {
        text: 'Diet Order',
        items:[
          {
            text: 'Changes',
            path: '/reports/diet-orders/changes'
          },
          {
            text: 'Consistency',
            path: '/reports/diet-orders/consistency'
          },
        ]
      },
      {
        text: 'Management Item',
        items:[
          {
            text: 'Changeable',
            path: '/Changeable'
          },
          {
            text: 'Fiber',
            path: '/Fiber'
          },
          {
            text: 'Protein',
            path: '/Protein'
          },
          {
            text: 'Special Request',
            path: '/Special Request'
          },
          {
            text: 'Thickener',
            path: '/Thickener'
          },
        ]
      },
      {
        text: 'Meal',
        items:[
          {
            text: 'Meal 1',
            path: '/Meal1'
          },
        ]
      },
      {
        text: 'Med Pass',
        items:[
          {
            text: 'Med Pass 1',
            path: '/Med Pass1'
          },
        ]
      },
      {
        text: 'Miscellaneous',
        items:[
          {
            text: 'Miscellaneous 1',
            path: '/Miscellaneous 1'
          },
        ]
      },
      {
        text: 'Nourishment',
        items:[
          {
            text: 'Nourishment 1',
            path: '/Nourishment1'
          },
        ]
      },
      {
        text: 'Posting Menus',
        items:[
          {
            text: 'Posting Menus 1',
            path: '/Posting Menus1'
          },
        ]
      },
      {
        text: 'Production Tally',
        path: '/Production Tally'
      },
      {
        text: 'Recipes',
        items:[
          {
            text: 'Recipes 1',
            path: '/Recipes1'
          },
        ]
      },
      {
        text: 'Resident',
        items:[
          {
            text: 'Resident 1',
            path: '/Resident1'
          },
        ]
      },
      {
        text: 'Selective Menu',
        items:[
          {
            text: 'Selective Menu 1',
            path: '/Selective Menu1'
          },
        ]
      },
      {
        text: 'Supplement',
        path: '/Supplement'
      },
      {
        text: 'Tray Line',
        items:[
          {
            text: 'Tray Line 1',
            path: '/Tray Line1'
          },
        ]
      },
      {
        text: 'Tray Tickets',
        items:[
          {
            text: 'Tray Tickets 1',
            path: '/Tray Tickets1',
            searchTags: ['Tray Cards'],
          },
        ],
      },
      {
        text: 'Tube Feed',
        items:[
          {
            text: 'Tube Feed 1',
            path: '/Tube Feed1'
          },
        ]
      },
      {
        text: 'Weight',
        items:[
          {
            text: 'Weight1',
            path: '/Weight1 '
          },
        ]
      },
    ]
  },

  {
    text: 'Settings',
    icon: 'setting',
    path: '/admin-settings',
  },
];
