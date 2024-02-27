<template>
  <div class="auth-wrapper auth-v2">
    <b-row class="auth-inner m-0">

      <!-- Brand logo-->
      <b-link class="brand-logo">
        <b-img :src="appLogoImage" alt="logo" style="width: 150px;" />
      </b-link>
      <!-- /Brand logo-->

      <!-- Left Text-->
      <b-col lg="8" class="d-none d-lg-flex align-items-center p-0">
        <div class="w-100 d-lg-flex align-items-center justify-content-center">
          <b-img :src="imgUrl" alt="Login V2" style="min-width: 100%; height: 100vh;object-fit: cover" />
        </div>
      </b-col>
      <!-- /Left Text-->

      <!-- Login-->
      <b-col lg="4" class="d-flex align-items-center auth-bg px-2 p-lg-5">
        <b-col sm="8" md="6" lg="12" class="px-xl-2 mx-auto">

          <h2 class="card-title font-weight-bold mb-1">
            ¡Bienvenido a CRM SIGA!
          </h2>

          <b-card-text class="mb-2">
            Iniciar sesión
          </b-card-text>

          <!-- form -->
          <validation-observer ref="loginValidation">
            <b-form class="auth-login-form mt-2" @submit.prevent>
              <!-- email -->
              <b-form-group label="Correo electrónico" label-for="login-email">
                <validation-provider #default="{ errors }" name="correo electrónico" rules="required|email">
                  <b-form-input id="login-email" v-model="userEmail" :state="errors.length > 0 ? false : null"
                    name="login-email" placeholder="john@traveldesign.com" />
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- forgot password -->
              <b-form-group>
                <!--                <div class="d-flex justify-content-between">
                  <label for="login-password">Password</label>
                  <b-link :to="{name:'auth-forgot-password-v2'}">
                    <small>Forgot Password?</small>
                  </b-link>
                </div>-->
                <validation-provider #default="{ errors }" name="contraseña" rules="required">
                  <b-input-group class="input-group-merge" :class="errors.length > 0 ? 'is-invalid' : null">
                    <b-form-input id="login-password" v-model="password" :state="errors.length > 0 ? false : null"
                      class="form-control-merge" :type="passwordFieldType" name="login-password"
                      placeholder="············" />
                    <b-input-group-append is-text>
                      <feather-icon class="cursor-pointer" :icon="passwordToggleIcon" @click="togglePasswordVisibility" />
                    </b-input-group-append>
                  </b-input-group>
                  <small class="text-danger">{{ errors[0] }}</small>
                </validation-provider>
              </b-form-group>

              <!-- checkbox -->
              <!--              <b-form-group>
                <b-form-checkbox
                  id="remember-me"
                  v-model="status"
                  name="checkbox-1"
                >
                  Recuerdame
                </b-form-checkbox>
              </b-form-group>-->

              <!-- submit buttons -->
              <b-button type="submit" variant="primary" block @click="validationForm">
                Iniciar sesión
              </b-button>
            </b-form>
          </validation-observer>

          <!--
          <b-card-text class="text-center mt-2">
            <span>New on our platform? </span>
            <b-link :to="{name:'page-auth-register-v2'}">
              <span>&nbsp;Create an account</span>
            </b-link>
          </b-card-text>
-->

          <!-- divider -->
          <!--          <div class="divider my-2">
            <div class="divider-text">
              or
            </div>
          </div>-->

          <!-- social buttons -->
          <!--          <div class="auth-footer-btn d-flex justify-content-center">
            <b-button
              variant="facebook"
              href="javascript:void(0)"
            >
              <feather-icon icon="FacebookIcon" />
            </b-button>
            <b-button
              variant="twitter"
              href="javascript:void(0)"
            >
              <feather-icon icon="TwitterIcon" />
            </b-button>
            <b-button
              variant="google"
              href="javascript:void(0)"
            >
              <feather-icon icon="MailIcon" />
            </b-button>
            <b-button
              variant="github"
              href="javascript:void(0)"
            >
              <feather-icon icon="GithubIcon" />
            </b-button>
          </div>-->
        </b-col>
      </b-col>
      <!-- /Login-->
    </b-row>
  </div>
</template>

<script>
/* eslint-disable global-require */
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import {
  BRow, BCol, BFormGroup, BFormInput, BInputGroupAppend, BInputGroup, BCardText, BImg, BForm, BButton,
} from 'bootstrap-vue'
import { required, email } from '@validations'
import { togglePasswordVisibility } from '@core/mixins/ui/forms'
import useJwt from '@/auth/jwt/useJwt'
import { $themeConfig } from '@themeConfig'
import { getHomeRouteForLoggedInUser } from '@/auth/utils'

export default {
  components: {
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
    BCardText,
    BImg,
    BForm,
    BButton,
    ValidationProvider,
    ValidationObserver,
  },
  mixins: [togglePasswordVisibility],
  data() {
    return {
      status: '',
      password: '',
      userEmail: '',
      sideImg: require('@/assets/images/pages/login/bg.jpg'),
      // validation rulesimport store from '@/store/index'
      required,
      email,
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
    imgUrl() {
      return this.sideImg
    },
  },
  methods: {
    validationForm() {
      this.$refs.loginValidation.validate().then(success => {
        if (success) {
          useJwt.login({ username: this.userEmail, password: this.password }).then(response => {
            const { data } = response
            useJwt.setToken(data.access_token)
            useJwt.setRefreshToken(data.refresh_token)
            localStorage.setItem('userData', JSON.stringify(data.user))
            this.$ability.update(data.user.ability)
            this.$router.replace(getHomeRouteForLoggedInUser())
          }).catch(() => {
            const err = {
              'correo electrónico': 'El usuario y/o la contraseña son incorrectos',
            }
            this.$refs.loginValidation.setErrors(err)
          })
        }
      })
    },
  },
  setup() {
    const { appName, appLogoImage } = $themeConfig.app

    return {
      appName, appLogoImage,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-auth.scss';
</style>
