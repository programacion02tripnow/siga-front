<template>
  <b-modal
    ref="paymentMethodFormModal"
    title="Programar pago"
    ok-title="Aceptar"
    cancel-title="Cancelar"
    no-close-on-backdrop
    @ok="save"
    @hidden="$emit('close')"
    @shown="calcTruthMaxAmount"
  >
    <div style="display:flex; align-items: center; justify-content: center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label>Total programado</label>
              <cleave
                v-model="totalScheduled"
                class="form-control"
                :options="numberFormatOptions"
                disabled
              />
            </div>

            <div class="form-group">
              <label>Máximo a programar</label>
              <cleave
                v-model="maxAmount"
                class="form-control"
                :options="numberFormatOptions"
                disabled
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label>Monto*</label>
              <cleave
                v-model="amount"
                class="form-control"
                :options="numberFormatOptions"
              />
            </div>
          </div>
          <div class="col-12">
            <div class="form-group">
              <label>Fecha*</label>
              <input
                v-model="date"
                type="date"
                class="form-control"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Cleave from 'vue-cleave-component'

export default {
  name: 'ReservationPaymentDateFormModal',
  components: {
    Cleave,
  },
  props: {
    maxAmount: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Object,
      default: () => ({}),
    },
    totalScheduled: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      amount: null,
      date: null,
      truthMaxAmount: 0,
      numberFormatOptions: {
        prefix: '$ ',
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        rawValueTrimPrefix: true,
      },
    }
  },
  watch: {
    paymentDate(newValue) {
      if (newValue && newValue.amount) {
        this.amount = parseFloat(newValue.amount)
        this.date = newValue.date
        this.truthMaxAmount = this.maxAmount + this.amount
      } else {
        this.amount = null
        this.date = null
        this.truthMaxAmount = this.maxAmount
      }
    },
  },
  mounted() {
  },
  methods: {
    calcTruthMaxAmount() {
      if (this.paymentDate && this.paymentDate.amount) {
        this.amount = parseFloat(this.paymentDate.amount)
        this.date = this.paymentDate.date
        this.truthMaxAmount = this.maxAmount + this.amount
      } else {
        this.amount = null
        this.date = null
        this.truthMaxAmount = this.maxAmount
      }
    },
    show() {
      this.$refs.paymentMethodFormModal.show()
    },
    save(e) {
      if (!this.amount || Number.isNaN(Number(this.amount))) {
        this.showError('Ingrese un monto')
        e.preventDefault()
        return
      }
      if (parseFloat(this.amount) > this.truthMaxAmount) {
        this.showError('El monto sobrepasa el límite')
        e.preventDefault()
        return
      }
      if (!this.date) {
        this.showError('Seleccione una fecha de pago')
        e.preventDefault()
        return
      }

      this.$emit('save', {
        amount: parseFloat(this.amount),
        date: this.date,
      })

      this.amount = null
      this.date = null
    },
    showError(text) {
      this.$swal({
        title: 'Error',
        text,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#41b882',
      })
    },
  },
}
</script>

<style scoped>

</style>
