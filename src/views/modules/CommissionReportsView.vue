<template>
  <b-overlay :show="loading">
    <div>
      <h1 class="mb-2">
        Reportes de comisiones
      </h1>
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">
                Reporte de comisiones por usuario
              </h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Usuarios</label>
                    <v-select
                      v-model="userComissionData.ids"
                      label="text"
                      :clearable="true"
                      :options="users"
                      :reduce="value=>value.getAttr('id')"
                      :get-option-label="value=>value.getAttr('username')"
                      :multiple="true"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Fecha inicial</label>
                    <input
                      v-model="userComissionData.startDate"
                      type="date"
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Fecha final</label>
                    <input
                      v-model="userComissionData.endDate"
                      type="date"
                      class="form-control"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn btn-primary"
                    @click="downloadUserCommissionReport"
                  >
                    Descargar reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h4 class="card-title">
                Reporte de comisiones de usuario
              </h4>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Usuarios</label>
                    <v-select
                      v-model="commissionUserData.user_id"
                      label="text"
                      :clearable="true"
                      :options="users"
                      :reduce="value=>value.getAttr('id')"
                      :get-option-label="value=>value.getAttr('username')"
                      :multiple="false"
                    />
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Fecha inicial</label>
                    <input
                      v-model="commissionUserData.startDate"
                      type="date"
                      class="form-control"
                    >
                  </div>
                </div>
                <div class="col-12 col-md-4">
                  <div class="form-group">
                    <label>Fecha final</label>
                    <input
                      v-model="commissionUserData.endDate"
                      type="date"
                      class="form-control"
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <button
                    class="btn btn-primary"
                    @click="downloadCommissionUserReport"
                  >
                    Descargar reporte
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-overlay>
</template>

<script>
import User from '@/dc-it/models/User'
import { BOverlay } from 'bootstrap-vue'
import vSelect from 'vue-select'
import GeneralService from '@/dc-it/services/GeneralService'

export default {
  name: 'CommissionReportsView',
  components: { BOverlay, vSelect },
  data: () => ({
    //
    users: [],
    loading: true,
    userComissionData: {
      ids: [],
      startDate: '',
      endDate: '',
    },
    commissionUserData: {
      user_id: null,
      startDate: '',
      endDate: '',
    },
  }),
  mounted() {
    User.where('id', '>', 0).get().then(users => {
      this.users = users
      this.loading = false
    })
  },
  methods: {
    //
    downloadUserCommissionReport() {
      if (this.userComissionData.startDate === '' || this.userComissionData.endDate === '') {
        this.$toast.error('Debes seleccionar un rango de fechas')
        return
      }
      this.loading = true
      GeneralService.getInstance().download('commissions/report', this.userComissionData).then(response => {
        // catch file and download
        const a = document.createElement('a')
        document.body.appendChild(a)
        // a.setAttribute('style', 'display: none');
        /* const blob = new Blob([result], {
          type: '',
        }) */ // new Blob([response], {type: 'app/xlsx'});
        const url = window.URL.createObjectURL(response)
        a.href = url
        a.download = 'reporte de comisiones.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
        this.loading = false
      })
    },

    downloadCommissionUserReport() {
      if (this.commissionUserData.user_id === null) {
        this.$toast.error('Debes seleccionar un usuario')
        return
      }

      if (this.commissionUserData.startDate === '' || this.commissionUserData.endDate === '') {
        this.$toast.error('Debes seleccionar un rango de fechas')
        return
      }
      this.loading = true
      GeneralService.getInstance().download('user_commissions/report', this.commissionUserData).then(response => {
        // catch file and download
        const a = document.createElement('a')
        document.body.appendChild(a)
        // a.setAttribute('style', 'display: none');
        /* const blob = new Blob([result], {
          type: '',
        }) */ // new Blob([response], {type: 'app/xlsx'});
        const url = window.URL.createObjectURL(response)
        a.href = url
        a.download = 'reporte de comisiones de usuario.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
        this.loading = false
      })
    },
  },
}
</script>

<style scoped>

</style>
