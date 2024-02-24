export default [
  {
    title: 'Dashboard',
    route: 'home',
    icon: 'HomeIcon',
    resource: 'Dashboard',
    action: 'VIEW_GENERAL_DASHBOARD',
  },

  {
    title: 'Ventas',
    route: 'sales',
    icon: 'HomeIcon',
    resource: 'Dashboard',
    action: 'VIEW_INDIVIDUAL_DASHBOARD',
  },
  {
    title: 'Leads',
    // route: 'leadsView',
    icon: 'ZapIcon',
    resource: 'Leads',
    action: 'VIEW_LEAD',
    children: [
      {
        title: 'Tablero de Leads',
        route: 'leadsView',
        icon: 'ZapIcon',
        resource: 'Leads',
        action: 'VIEW_LEAD',
      },
      {
        title: 'Leads Tabla',
        route: 'leadsBackupView',
        icon: 'ZapIcon',
        resource: 'Leads',
        action: 'VIEW_LEAD',
      },
      {
        title: 'Estados de Leads',
        route: 'leadStatusesView',
        icon: 'FilterIcon',
        action: 'read',
        resource: 'Auth',
      },
      {
        title: 'Canales de Leads',
        route: 'leadChannelsView',
        icon: 'MonitorIcon',
        action: 'read',
        resource: 'Auth',
      },
    ],
  },

  {
    title: 'Métodos de pago',
    route: 'paymentMethodsView',
    icon: 'CreditCardIcon',
    resource: 'Métodos de pago',
    action: 'VIEW_PAYMENT_METHOD',
  },
  {
    title: 'Proveedores',
    route: 'providersView',
    icon: 'ShoppingBagIcon',
    resource: 'Proveedores',
    action: 'VIEW_PROVIDER',
  },
  {
    title: 'Reservaciones',
    route: 'reservationsView',
    icon: 'FileTextIcon',
    resource: 'Reservas',
    action: 'VIEW_RESERVATION',
  },

  {
    title: 'Reportes',
    // route: 'leadsView',
    icon: 'DownloadIcon',
    resource: 'Dashboard',
    action: 'VIEW_GENERAL_DASHBOARD',
    children: [
      {
        title: 'Comisiones',
        route: 'commissionReportsView',
        icon: 'HashIcon',
        resource: 'Dashboard',
        action: 'VIEW_GENERAL_DASHBOARD',
      },
    ],
  },

  {
    title: 'Clientes',
    route: 'customersView',
    icon: 'UserCheckIcon',
    resource: 'Clientes',
    action: 'VIEW_CUSTOMER',
  },
  {
    title: 'Usuarios',
    route: 'usersView',
    icon: 'UsersIcon',
    resource: 'Usuarios y roles',
    action: 'VIEW_USER',
  },
  {
    title: 'Roles y permisos',
    route: 'rolesView',
    icon: 'UsersIcon',
    resource: 'Usuarios y roles',
    action: 'VIEW_ROLE',
  },
]
