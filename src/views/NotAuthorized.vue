<template>
  <div class="misc-wrapper">
    <b-link class="brand-logo">
      <vuexy-logo />
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        <h2 class="mb-1">
          ¡No tienes permisos! 🔐
        </h2>
        <p class="mb-2">
          No tienes permisos para ingresar al módulo
        </p>
        <b-button
          variant="primary"
          class="mb-1 btn-sm-block"
          :to="loginRoute()"
        >Ir al Inicio</b-button>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { BLink, BButton } from 'bootstrap-vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import store from '@/store/index'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  components: {
    BLink, BButton, VuexyLogo,
  },
  data() {
    return {
      downImg: require('@/assets/images/pages/not-authorized.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/not-authorized-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  methods: {
    loginRoute() {
      const user = JSON.parse(localStorage.getItem('userData'))
      return getHomeRouteForLoggedInUser(user ? user.role : null)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
