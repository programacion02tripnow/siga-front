<template>
  <b-overlay :show="loading">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">
          Configurar comisión
        </h4>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label>Método de pago</label>
          <select
            v-model="paymentMethod"
            class="form-control"
          >
            <option
              v-for="pm in paymentMethods"
              :key="pm.getAttr('id')"
              :value="pm.getAttr('id')"
            >
              {{ pm.getAttr('name') }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Porcentaje</label>
          <input
            v-model="commission"
            type="number"
            class="form-control"
          >
        </div>

        <div class="form-group">
          <button
            class="btn btn-primary"
            @click="save"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>

    <table-component
      v-if="!loading"
      ref="tableComponent"
      :model="model"
      :permissions="permissions"
      :init-filter="initFilter"
      hide-actions-column
    />
  </b-overlay>
</template>

<script>
// import User from '@/dc-it/models/User'
import { BOverlay } from 'bootstrap-vue'
import PaymentMethod from '@/dc-it/models/PaymentMethod'
import UserCommission from '@/dc-it/models/UserCommission'

export default {
  name: 'CommissionSettingsView',
  components: {
    BOverlay,
    TableComponent: () => import('@/dc-it/components/TableComponent.vue'),
  },
  data() {
    return {
      loading: true,
      user: null,
      paymentMethods: [],
      initFilter: [],
      model: UserCommission,
      permissions: {
        edit: false,
        delete: false,
        filter: false,
        create: false,
      },
      paymentMethod: null,
      commission: null,
    }
  },
  mounted() {
    const { id } = this.$route.params
    if (!id) {
      this.$router.replace({ name: 'error-404' })
      return
    }

    this.user = id

    PaymentMethod.get().then(paymentMethods => {
      this.paymentMethods = paymentMethods

      this.initFilter = [
        {
          field: 'user_id',
          operator: '=',
          value: id,
        },
      ]

      this.loading = false

      /* User.with(['user_commissions']).where('id', '=', id).get().then(users => {
        if (users.length !== 1) {
          this.$router.replace({ name: 'error-404' })
        } else {
          // eslint-disable-next-line prefer-destructuring
          this.user = users[0]
        }
        this.loading = false
      }) */
    })
  },
  methods: {
    save() {
      if (this.paymentMethod && this.commission) {
        const userCommission = new UserCommission()
        userCommission.setAttr('user_id', this.user)
        userCommission.setAttr('payment_method', this.paymentMethod)
        userCommission.setAttr('percentage', this.commission)
        userCommission.save().then(() => {
          this.$refs.tableComponent.updateData()
          this.paymentMethod = null
          this.commission = null
        })
        /* UserCommission.create({
          user_id: this.user.getAttr('id'),
          payment_method_id: this.paymentMethod,
          commission: this.commission,
        }).then(() => {
          this.$refs.tableComponent.refresh()
        }) */
      }
    },
  },
}
</script>

<style scoped>

</style>
