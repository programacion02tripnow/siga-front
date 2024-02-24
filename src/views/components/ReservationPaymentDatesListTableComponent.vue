<template>
  <b-table
    class="position-relative"
    :items="paymentDates"
    responsive
    :fields="columns"
    primary-key="id"
    show-empty
    empty-text="No se han agregado pagos"
  >

    <template #cell(status)="data">
      <feather-icon
        v-if="data.item.reservation_payment"
        icon="CheckIcon"
        size="20"
        class="text-success"
      />

      <feather-icon
        v-if="data.item.id && !data.item.reservation_payment && isPendingPay(data.item.date)"
        icon="ClockIcon"
        size="20"
        class="text-info"
      />

      <feather-icon
        v-if="data.item.id && !data.item.reservation_payment && !isPendingPay(data.item.date)"
        icon="XIcon"
        size="20"
        class="text-danger"
      />

    </template>

    <template #cell(date)="data">
      <p
        class="m-0"
        :class="!!data.item.reservation_payment ? 'text-success' : ''"
      >
        {{ data.item.date }}
      </p>
    </template>

    <template #cell(amount)="data">
      <p
        class="m-0"
        :class="!!data.item.reservation_payment ? 'text-success' : ''"
      >
        $ {{ numberFormat(data.item.amount) }}

        <span
          v-if="data.item.amount > saldo && !data.item.reservation_payment"
          class="text-danger d-block small"
        >
          El monto es mayor al saldo pendiente
        </span>
      </p>
    </template>

    <template #cell(actions)="data">
      <b-button-group>
        <b-button
          variant="success"
          :disabled="!data.item.id || !!data.item.reservation_payment || data.item.amount > saldo"
          @click="payClick(data)"
        >
          <feather-icon
            icon="DollarSignIcon"
          />
          Pagar
        </b-button>

        <b-button
          variant="warning"
          :disabled="!!data.item.reservation_payment"
          @click="editPaymentDate(data)"
        >
          <feather-icon icon="Edit2Icon" />
          Editar
        </b-button>
        <b-button
          variant="danger"
          :disabled="!!data.item.reservation_payment"
          @click="deleteClick(data)"
        >
          <feather-icon icon="XCircleIcon" />
          Eliminar
        </b-button>
      </b-button-group>
    </template>

  </b-table>
</template>

<script>
import { BButton, BButtonGroup, BTable } from 'bootstrap-vue'

export default {
  name: 'ReservationPaymentDatesListTableComponent',
  components: {
    BTable,
    BButton,
    BButtonGroup,
  },
  props: {
    paymentDates: {
      type: Array,
      required: true,
    },
    saldo: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    columns: [
      { key: 'status', label: '' },
      { key: 'date', label: 'Fecha' },
      { key: 'amount', label: 'Monto' },
      { key: 'actions', label: 'Acciones' },
    ],
  }),
  methods: {
    numberFormat(number) {
      const tmp = parseFloat(number)
      const val = (tmp).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    editPaymentDate(item) {
      this.$emit('onEdit', item.index)
    },
    deleteClick(item) {
      this.$emit('onDelete', item.index)
    },
    payClick(item) {
      this.$emit('onPay', item.index)
    },
    isPendingPay(date) {
      const d = new Date(`${date}T00:00:00`)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return (d >= today)
    },
  },
}
</script>

<style scoped>

</style>
