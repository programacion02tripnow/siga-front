import Vue from 'vue'
import VueRouter from 'vue-router'
import { getHomeRouteForLoggedInUser, isUserLoggedIn } from '@/auth/utils'
import { canNavigate } from '@/libs/acl/routeProtection'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/modules/DashboardView.vue'),
      meta: {
        pageTitle: 'Dashboard',
        breadcrumb: [
          {
            text: 'Dashboard',
            active: true,
          },
        ],
        resource: 'Auth',
        // action: ['VIEW_INDIVIDUAL_DASHBOARD', 'VIEW_GENERAL_DASHBOARD'],
      },
    },
    {
      path: '/dashboard',
      name: 'sales',
      component: () => import('@/views/modules/DashboardView.vue'),
      meta: {
        pageTitle: 'Dashboard',
        breadcrumb: [
          {
            text: 'Dashboard',
            active: true,
          },
        ],
        resource: 'Auth',
        // action: ['VIEW_INDIVIDUAL_DASHBOARD', 'VIEW_GENERAL_DASHBOARD'],
      },
    },
    {
      path: '/users',
      name: 'usersView',
      component: () => import('@/views/modules/UsersView.vue'),
      meta: {
        pageTitle: 'Usuarios',
        breadcrumb: [
          {
            text: 'Usuarios',
            active: true,
          },
        ],
        resource: 'Usuarios y roles',
        action: 'VIEW_USER',
      },
    },
    {
      path: '/commission-settings/:id',
      name: 'commissionSettings',
      component: () => import('@/views/modules/CommissionSettingsView.vue'),
      meta: {
        pageTitle: 'Configuración de comisiones',
        breadcrumb: [
          {
            text: 'Usuarios',
            active: false,
            to: '/users',
          },
          {
            text: 'Configuración de comisiones',
            active: true,
          },
        ],
        resource: 'Usuarios y roles',
        action: 'VIEW_USER',
      },
    },

    {
      path: '/roles',
      name: 'rolesView',
      component: () => import('@/views/modules/RolesView.vue'),
      meta: {
        pageTitle: 'Roles',
        breadcrumb: [
          {
            text: 'Roles',
            active: true,
          },
        ],
        resource: 'Usuarios y roles',
        action: 'VIEW_ROLE',
      },
    },
    {
      path: '/roles/new',
      name: 'createRoleView',
      component: () => import('@/views/modules/RoleFormView.vue'),
      meta: {
        pageTitle: 'Crear rol',
        breadcrumb: [
          {
            text: 'Crear rol',
            active: true,
          },
        ],
        resource: 'Usuarios y roles',
        action: 'CREATE_ROLE',
      },
    },
    {
      path: '/roles/edit/:id',
      name: 'editRoleView',
      component: () => import('@/views/modules/RoleFormView.vue'),
      meta: {
        pageTitle: 'Editar rol',
        breadcrumb: [
          {
            text: 'Editar rol',
            active: true,
          },
        ],
        resource: 'Usuarios y roles',
        action: 'EDIT_ROLE',
      },
    },

    {
      path: '/customers',
      name: 'customersView',
      component: () => import('@/views/modules/CustomersView.vue'),
      meta: {
        pageTitle: 'Clientes',
        breadcrumb: [
          {
            text: 'Clientes',
            active: true,
          },
        ],
        resource: 'Clientes',
        action: 'VIEW_CUSTOMER',
      },
    },

    {
      path: '/providers',
      name: 'providersView',
      component: () => import('@/views/modules/ProvidersView.vue'),
      meta: {
        pageTitle: 'Proveedores',
        breadcrumb: [
          {
            text: 'Proveedores',
            active: true,
          },
        ],
        resource: 'Proveedores',
        action: 'VIEW_PROVIDER',
      },
    },

    {
      path: '/payment_methods',
      name: 'paymentMethodsView',
      component: () => import('@/views/modules/PaymentMethodsView.vue'),
      meta: {
        pageTitle: 'Métodos de pago',
        breadcrumb: [
          {
            text: 'Métodos de pago',
            active: true,
          },
        ],
        resource: 'Métodos de pago',
        action: 'VIEW_PAYMENT_METHOD',
      },
    },

    {
      path: '/lead-statuses',
      name: 'leadStatusesView',
      component: () => import('@/views/modules/LeadStatusesView.vue'),
      meta: {
        pageTitle: 'Estados de Leads',
        breadcrumb: [
          {
            text: 'Estados de Leads',
            active: true,
          },
        ],
        resource: 'Leads',
        action: 'MANAGE_LEAD_STATUSES',
      },
    },
    {
      path: '/lead-channels',
      name: 'leadChannelsView',
      component: () => import('@/views/modules/LeadChannelsView.vue'),
      meta: {
        pageTitle: 'Canales de Leads',
        breadcrumb: [
          {
            text: 'Canales de Leads',
            active: true,
          },
        ],
        resource: 'Leads',
        action: 'MANAGE_LEAD_CHANNELS',
      },
    },
    {
      path: '/leads',
      name: 'leadsView',
      component: () => import('@/views/modules/LeadsView.vue'),
      meta: {
        // pageTitle: 'Leads',
        /* breadcrumb: [
          {
            text: 'Leads',
            active: true,
          },
        ], */
        resource: 'Leads',
        action: 'VIEW_LEAD',
        // contentRenderer: 'sidebar-left',
        contentClass: 'todo-application',
      },
    },
    {
      path: '/commission-reports',
      name: 'commissionReportsView',
      component: () => import('@/views/modules/CommissionReportsView.vue'),
      meta: {
        // pageTitle: 'Leads',
        /* breadcrumb: [
                {
                  text: 'Leads',
                  active: true,
                },
              ], */
        resource: 'Dashboard',
        action: 'VIEW_GENERAL_DASHBOARD',
      },
    },

    {
      path: '/leads-back',
      name: 'leadsBackupView',
      component: () => import('@/views/modules/LeadsBackupView.vue'),
      meta: {
        pageTitle: 'Leads',
        breadcrumb: [
          {
            text: 'Leads',
            active: true,
          },
        ],
        resource: 'Leads',
        action: 'VIEW_LEAD',
      },
    },
    {
      path: '/reservations',
      name: 'reservationsView',
      component: () => import('@/views/modules/ReservationsView.vue'),
      meta: {
        pageTitle: 'Reservaciones',
        breadcrumb: [
          {
            text: 'Reservaciones',
            active: true,
          },
        ],
        resource: 'Reservas',
        action: 'VIEW_RESERVATION',
      },
    },
    {
      path: '/new-reservation',
      name: 'newReservationView',
      component: () => import('@/views/modules/NewReservationsView.vue'),
      meta: {
        pageTitle: 'Nueva reserva',
        breadcrumb: [
          {
            to: '/reservations',
            text: 'Reservas',
            active: false,
          },
          {
            text: 'Crear reserva',
            active: true,
          },
        ],
        resource: 'Reservas',
        action: 'CREATE_RESERVATION',
      },
    },
    {
      path: '/edit-reservation/:id',
      name: 'EditReservationsView',
      component: () => import('@/views/modules/NewReservationsView.vue'),
      meta: {
        pageTitle: 'Editar reserva',
        breadcrumb: [
          {
            to: '/reservations',
            text: 'Reservaciones',
            active: false,
          },
          {
            text: 'Editar reserva',
            active: true,
          },
        ],
        resource: 'Reservas',
        action: 'EDIT_RESERVATION',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
        redirectIfLoggedIn: true,
        resource: 'Auth',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
      },
    },
    {
      path: '/not-authorized',
      name: 'not-authorized',
      component: () => import('@/views/NotAuthorized.vue'),
      meta: {
        layout: 'full',
        resource: 'Auth',
      },
    },

    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// Router Before Each hook for route protection
router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (!canNavigate(to)) {
    // Redirect to login if not logged in
    // ! We updated login route name here from `auth-login` to `login` in starter-kit
    if (!isLoggedIn) return next({ name: 'login' })

    // If logged in => not authorized
    return next({ name: 'not-authorized' })
  }

  // Redirect if logged in
  if (to.meta.redirectIfLoggedIn && isLoggedIn) {
    next(getHomeRouteForLoggedInUser())
  }

  return next()
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
