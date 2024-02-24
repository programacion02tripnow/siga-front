<template>
  <b-modal
    ref="refFormModal"
    title="Agrega servicio de transporte"
    ok-title="Aceptar"
    cancel-title="Cancelar"
    no-close-on-backdrop
    @ok="save"
    @hidden="$emit('close')"
  >
    <div
      style="display:flex; align-items: center; justify-content: center"
    >
      <div
        v-if="reservation_detail"
        class="container"
      >
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Proveedor*</label>
                  <v-select
                    v-model="reservation_detail.provider_id"
                    label="text"
                    :clearable="false"
                    :options="providers"
                    :reduce="value=>value.getAttr('id')"
                    :get-option-label="option=>option.getAttr('name')"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Confirmación*</label>
                  <input
                    v-model="reservation_detail.provider_confirmation_number"
                    type="text"
                    class="form-control"
                    placeholder="Numero de confirmación"
                  >
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Fecha máxima de liquidación*</label>
                  <input
                    v-model="reservation_detail.max_settlement_date"
                    type="date"
                    class="form-control"
                    placeholder="Fecha máxima de liquidación"
                    @change="onSettlementDateChange"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Fecha máxima de pago*</label>
                  <input
                    v-model="reservation_detail.max_payment_date"
                    type="date"
                    class="form-control"
                    placeholder="Fecha máxima de pago"
                  >
                </div>
              </div>

            </div>

            <hr>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Meeting Point*</label>
                  <input
                    :value="reservation_detail.reservable.pickup"
                    type="text"
                    class="form-control"
                    placeholder="Meeting Point"
                    @change="reservation_detail.reservable.pickup=capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Destino*</label>
                  <input
                    :value="reservation_detail.reservable.destination"
                    type="text"
                    class="form-control"
                    placeholder="Destino"
                    @change="reservation_detail.reservable.destination=capitalizeInput($event.target.value)"
                  >
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Instrucciones/Indicaciones*</label>
                  <textarea
                    v-model="reservation_detail.reservable.pickup_comment"
                    class="form-control"
                    placeholder="Instrucciones/Indicaciones de como llegar al punto de encuentro"
                  />
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Comentarios para proveedor*</label>
                  <textarea
                    v-model="reservation_detail.reservable.provider_notes"
                    class="form-control"
                    placeholder="Comentarios para proveedor"
                  />
                </div>
              </div>

              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Lugar y hora*</label>
                  <input
                    v-model="reservation_detail.reservable.datetime"
                    placeholder="Fecha y hora de arribo"
                    class="form-control"
                    type="datetime-local"
                  >
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Tipo de vehiculo*</label>
                  <input
                    :value="reservation_detail.reservable.transportation_type"
                    placeholder="Tipo de Vehiculo"
                    class="form-control"
                    type="text"
                    @change="reservation_detail.reservable.transportation_type=capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Tipo de servicio*</label>
                  <v-select
                    v-model="reservation_detail.reservable.type"
                    :clearable="false"
                    :reduce="value=>value.value"
                    :options="[{label: 'Privado', value: 1}, {label: 'Compartido', value: 2}]"
                  />
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Adultos*</label>
                  <input
                    v-model="reservation_detail.reservable.adults_quantity"
                    type="number"
                    class="form-control text-box-n"
                    placeholder="Adultos"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Menores*</label>
                  <input
                    v-model="reservation_detail.reservable.minors_quantity"
                    type="number"
                    class="form-control"
                    placeholder="Menores"
                  >
                </div>
              </div>
            </div>

            <hr>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Precio público*</label>
                  <cleave
                    v-model="reservation_detail.public_price"
                    :options="numberFormatOptions"
                    class="form-control"
                    placeholder="Precio público"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Precio neto*</label>
                  <cleave
                    v-model="reservation_detail.net_price"
                    :options="numberFormatOptions"
                    class="form-control"
                    placeholder="Precio neto"
                  />
                </div>
              </div>

              <div class="col-12 col-md-4">
                <b-form-checkbox
                  v-model="reservation_detail.cancellable"
                  switch
                >
                  Cancelable
                </b-form-checkbox>
              </div>
              <div class="col-12 col-md-4">
                <b-form-checkbox
                  v-model="reservation_detail.editable"
                  switch
                >
                  Editable
                </b-form-checkbox>
              </div>
              <div class="col-12 col-md-4">
                <b-form-checkbox
                  v-model="reservation_detail.refundable"
                  switch
                >
                  Reembolsable
                </b-form-checkbox>
              </div>
            </div>

            <hr>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label>Términos y condiciones*</label>
                  <textarea
                    v-model="reservation_detail.terms_conditions"
                    class="form-control"
                  />
                </div>
              </div>
            </div>

            <hr>
            <div>
              <reservation-detail-comments-component
                :comments="reservation_detail.reservation_detail_comments"
                :reservation-detail-id="reservation_detail.id"
                :show-form="reservation_detail.id && reservation_detail.id>0"
                @onCommentSaved="onCommentSaved"
              />
            </div>

            <hr>
            <div class="row">
              <div class="col-12">
                <div v-if="!reservation_detail.multimedia">
                  <!-- Styled -->
                  <label>Voucher del proveedor</label>
                  <b-form-file
                    v-model="file"
                    placeholder="Escoge el archivo o arrastra aquí..."
                    drop-placeholder="Suelta aquí..."
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import helpers from '@/dc-it/services/helpers'
import vSelect from 'vue-select'
import { BFormCheckbox, BFormFile } from 'bootstrap-vue'
import ReservationDetailCommentsComponent from '@/views/components/ReservationDetailCommentsComponent.vue'
import { ref } from '@vue/composition-api/dist/vue-composition-api'
import Cleave from 'vue-cleave-component'

export default {

  name: 'PickupServiceView',
  components: {
    vSelect, BFormCheckbox, BFormFile, ReservationDetailCommentsComponent, Cleave,
  },
  props: {
    providers: {
      type: Array,
      default: () => [],
    },
    reservationDetailParam: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      file: null,
      comment: '',
    }
  },

  methods: {
    onSettlementDateChange() {
      // menos 3 días
      const d = new Date(`${this.reservation_detail.max_settlement_date}T00:00:00`)
      d.setDate(d.getDate() - 3)
      // eslint-disable-next-line prefer-destructuring
      this.reservation_detail.max_payment_date = helpers.dateFormat(d)
    },
    show() {
      this.refFormModal.show()
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
    save(e) {
      if (!this.reservation_detail.provider_id) {
        this.showError('Seleccione un proveedor')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.provider_confirmation_number.toString().trim() === '') {
        this.showError('Ingrese un número de confirmación')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.max_payment_date || this.reservation_detail.max_payment_date.trim() === '' || new Date(this.reservation_detail.max_payment_date).toString() === 'Invalid Date') {
        this.showError('Seleccione una fecha de pago')
        e.preventDefault()
        return
      }

      if (!this.reservation_detail.max_settlement_date || this.reservation_detail.max_settlement_date.trim() === '' || new Date(this.reservation_detail.max_settlement_date).toString() === 'Invalid Date') {
        this.showError('Seleccione una fecha de liquidación')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.pickup.trim() === '') {
        this.showError('Ingrese un punto de encuentro')
        e.preventDefault()
        return
      }

      if (this.reservation_detail.reservable.destination.trim() === '') {
        this.showError('Ingrese un destino')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.pickup_comment.trim() === '') {
        this.showError('Ingrese un instrucciones o indicaciones para el cliente')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.reservable.datetime) {
        this.showError('Seleccione Fecha y Hora del servicio')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.transportation_type.trim() === '') {
        this.showError('Ingrese el tipo de vehículo del servicio')
        e.preventDefault()
        return
      }
      if (Number.isNaN(this.reservation_detail.reservable.adults_quantity)) {
        this.showError('Ingrese la cantidad de adultos')
        e.preventDefault()
        return
      }
      if (Number.isNaN(this.reservation_detail.reservable.minors_quantity)) {
        this.showError('Ingrese la cantidad de menores')
        e.preventDefault()
      }
      if (!this.reservation_detail.public_price || Number.isNaN(Number(this.reservation_detail.net_price))) {
        this.showError('Ingrese el precio neto')
        e.preventDefault()
        return
      }

      if (parseFloat(this.reservation_detail.public_price) < parseFloat(this.reservation_detail.net_price)) {
        this.showError('El precio público debe de ser mayor al precio neto')
        e.preventDefault()
        return
      }

      if (!this.reservation_detail.reservable.provider_notes) {
        this.showError('Ingrese algun comentario para el proveedor')
        e.preventDefault()
        return
      }

      if (!this.reservation_detail.id) {
        this.reservation_detail.reservation_detail_comments.push({
          comment: this.comment,
        })
      }
      if (this.file) {
        /* this.showError('Seleccione el Voucher proporcionado por el proveedor')
          e.preventDefault()
          return */
        const reader = new FileReader()
        const { name } = this.file
        reader.onload = el => {
          this.reservation_detail.multimedia = {
            filename: name,
            file_url: el.target.result,
          }

          this.$emit('save', this.reservation_detail)
        }
        const size = this.file.size / 1024 / 1024
        if (size > 5) {
          this.showError('El peso del archivo no puede exceder los 5mb')
          e.preventDefault()
          return
        }
        reader.readAsDataURL(this.file)
      } else {
        this.$emit('save', this.reservation_detail)
      }
    },
    onCommentSaved() {
      this.$emit('onCommentSaved')
    },
    capitalizeInput(value) {
      return helpers.capitalize(value)
    },
  },
  setup(props) {
    const reservationDetail = ref({
      id: null,
      reservable_type: 'App\\Models\\PickupReservation',
      reservable_id: null,
      public_price: null,
      net_price: null,
      provider_id: null,
      cancellable: false,
      editable: false,
      refundable: false,
      terms_conditions: '',
      provider_confirmation_number: '',
      reservation_detail_comments: [],
      cancelled_at: null,
      cancelled_by_id: null,
      multimedia: null,
      invoiced: 0,
      max_payment_date: null,
      max_settlement_date: null,
      reservable: {
        destination: '',
        pickup: '',
        pickup_comment: '',
        datetime: null,
        adults_quantity: null,
        minors_quantity: null,
        type: '',
        transportation_type: '',
        provider_notes: '',
      },
    })
    const refFormModal = ref(null)
    if (props.reservationDetailParam) {
      reservationDetail.value = props.reservationDetailParam
      if (!reservationDetail.value.max_payment_date) {
        reservationDetail.value.max_payment_date = null
      }
      if (!reservationDetail.value.max_settlement_date) {
        reservationDetail.value.max_settlement_date = null
      }
    }

    const numberFormatOptions = {
      prefix: '$ ',
      numeral: true,
      numeralThousandsGroupStyle: 'thousand',
      rawValueTrimPrefix: true,
    }

    return {
      reservation_detail: reservationDetail,
      refFormModal,
      numberFormatOptions,
    }
  },
}
</script>

<style>

.modal-dialog.modal-md {
  max-width: 75%;
}

.input-group.mb-2.mr-2 {
  flex-basis: 25%;
}

</style>
