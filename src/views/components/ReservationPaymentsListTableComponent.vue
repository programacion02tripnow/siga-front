<template>
  <b-table
    class="position-relative"
    :items="payments"
    responsive
    :fields="columns"
    primary-key="id"
    show-empty
    empty-text="No se han agregado pagos"
  >

    <template #cell(date)="data">
      <p class="m-0">
        {{ data.item.date }}
      </p>
    </template>

    <template #cell(amount)="data">
      <p class="m-0">
        $ {{ numberFormat(data.item.amount) }}
      </p>
    </template>

    <template #cell(payment_method)="data">
      <p class="m-0">
        {{ getPaymentMethodName(data.item.payment_method_id) }}
      </p>
    </template>

    <template #cell(user)="data">
      <div v-if="data.item.user">
        <user-info-component
          :value="data.item.user"
          :model="data.item.user"
        />
      </div>

    </template>

  </b-table>
</template>

<script>
import { BTable } from 'bootstrap-vue'
import UserInfoComponent from '@/views/components/UserInfoComponent.vue'

export default {
  name: 'ReservationPaymentsListTableComponent',
  components: {
    BTable,
    UserInfoComponent,
  },
  props: {
    payments: {
      type: Array,
      required: true,
    },
    paymentMethods: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    columns: [
      { key: 'date', label: 'Fecha' },
      { key: 'amount', label: 'Monto' },
      { key: 'payment_method', label: 'Método de pago' },
      { key: 'user', label: 'Agente' },
    ],
  }),
  methods: {
    numberFormat(number) {
      const tmp = parseFloat(number)
      const val = (tmp).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getPaymentMethodName(paymentMethodId) {
      if (!paymentMethodId) {
        return 'Monedero de cliente'
      }
      return this.paymentMethods.find(paymentMethod => paymentMethod.getAttr('id').toString() === paymentMethodId.toString()).getAttr('name')
    },
  },
}
</script>

<style scoped>

</style>
