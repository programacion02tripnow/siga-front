<template>
  <b-modal ref="paymentMethodFormModal" title="Información del pago" ok-title="Aceptar" cancel-title="Cancelar"
    no-close-on-backdrop :ok-disabled="loading || !validate" :cancel-disabled="loading || !validate" @ok="save"
    @hide="paymentMethodSelected = null; $emit('close')">

    <template #modal-header="{ close }">
      <!-- Emulate built in modal header close button action -->
      <div>
        <h5 class="m-0">
          Información del pago
        </h5>
        <p v-if="amount === 0" class="m-0 font-weight-bolder">
          Saldo por pagar $ {{ numberFormat(maxAmount) }}
        </p>
      </div>
      <button class="btn" @click="close()">
        <feather-icon icon="XIcon" />
      </button>
    </template>

    <div style="display:flex; align-items: center; justify-content: center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="form-group">
              <label>Método de pago*</label>
              <v-select v-model="paymentMethodSelected" label="text" :clearable="false" :options="paymentMethods"
                :reduce="value => value" :get-option-label="option => option.getAttr('name')"
                @input="paymentMethodChange" />
            </div>
          </div>

          <div class="col-12">
            <div class="form-group">
              <label>Monto*</label>
              <cleave v-model="finalAmount" :options="numberFormatOptions" class="form-control" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import vSelect from 'vue-select'
import helpers from '@/dc-it/services/helpers'
import Cleave from 'vue-cleave-component'
import GeneralService from '@/dc-it/services/GeneralService'

export default {
  name: 'PaymentMethodFormModal',
  components: {
    vSelect,
    Cleave,
  },
  props: {
    paymentMethods: {
      type: Array,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    wallet: {
      type: Number,
      default: 0,
    },
    maxAmount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      paymentMethodSelected: null,
      finalAmount: null,
      date: null,
      additionalFields: {},
      numberFormatOptions: {
        prefix: '$ ',
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        rawValueTrimPrefix: true,
      },
      loading: false,
      validate: true,
      token: '',
    }
  },
  watch: {
    amount(newAmount) {
      this.finalAmount = newAmount
    },
  },
  methods: {
    numberFormat(number) {
      return helpers.numberFormat(number)
    },
    show() {
      this.$refs.paymentMethodFormModal.show()
    },
    save(e) {
      if (!this.paymentMethodSelected) {
        this.showError('Seleccione un método de pago')
        e.preventDefault()
        return
      }
      if (!this.finalAmount || Number.isNaN(Number(this.finalAmount))) {
        this.showError('Ingrese un monto')
        e.preventDefault()
        return
      }
      if (this.finalAmount > this.amount) {
        this.showError('Ingrese un monto menor a $' + this.numberFormat(this.amount))
        e.preventDefault()
        return
      }
      /* if (!this.date) {
        this.showError('Seleccione una fecha de pago')
        e.preventDefault()
        return
      }
*/
      const additionalFields = []
      let isValid = true
      if (Array.isArray(this.paymentMethodSelected.getAttr('payment_method_additional_fields', false))) {
        this.paymentMethodSelected.getAttr('payment_method_additional_fields', false).forEach(additionalField => {
          if (additionalField.getAttr('is_required', false).toString() === '1') {
            if (!this.additionalFields[additionalField.getAttr('id')] || !this.additionalFields[additionalField.getAttr('id')].trim()) {
              this.showError(`Ingrese el campo ${additionalField.getAttr('name')}`)
              e.preventDefault()
              isValid = false
              return
            }
          }

          additionalFields.push({
            payment_method_additional_field_id: additionalField.getAttr('id'),
            value: this.additionalFields[additionalField.getAttr('id')],
          })
        })
      }

      if (!isValid) {
        return
      }

      this.$emit('save', {
        amount: this.finalAmount,
        date: helpers.dateFormat(new Date()),
        payment_method_id: this.paymentMethodSelected.getAttr('id'),
        payment_method_text: '',
        reservation_payment_additional_values: additionalFields,
      })

      this.finalAmount = null
      this.date = null
      this.paymentMethodSelected = null
      this.additionalFields = {}
    },
    paymentMethodChange() {
      //this.validate = this.paymentMethodSelected.getAttr('id').toString() !== '0'
      this.finalAmount = this.paymentMethodSelected.getAttr('id').toString() !== '0' ? this.finalAmount : this.wallet
    },
    validateToken() {
      const token = this.additionalFields[0]
      this.loading = true
      GeneralService.getInstance().all(`validate_refund/${token}`).then(response => {
        if (response.result === 'success') {
          this.validate = true
          this.finalAmount = response.data.amount
        } else {
          this.showError(response.error)
        }

        this.loading = false
      }).catch(err => {
        this.showError(err.error)
        this.loading = false
      })
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

<style scoped></style>
