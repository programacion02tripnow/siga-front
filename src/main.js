import Vue from 'vue'
import {
  ToastPlugin, ModalPlugin,
} from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
import VueCompositionAPI from '@vue/composition-api'
import UserInfoComponent from '@/views/components/UserInfoComponent.vue'
import router from './router'
import store from './store'
import App from './App.vue'
// Global Components
import './global-components'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'
import '@/libs/acl'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(VueSweetalert2)

Vue.component('UserInfoComponent', UserInfoComponent)

// Composition API
Vue.use(VueCompositionAPI)

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
