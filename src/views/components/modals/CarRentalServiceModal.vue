<template>
  <b-modal
    ref="refFormModal"
    title="Agrega renta de carro"
    ok-title="Aceptar"
    cancel-title="Cancelar"
    no-close-on-backdrop
    @ok="save"
    @hidden="$emit('close')"
  >
    <div style="display:flex; align-items: center; justify-content: center">
      <div class="container">
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
                  <label>Entrega*</label>
                  <input
                    :value="reservation_detail.reservable.pickup"
                    type="text"
                    class="form-control"
                    placeholder="Lugar de entrega"
                    @change="reservation_detail.reservable.pickup = capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Lugar y hora de entrega*</label>
                  <input
                    v-model="reservation_detail.reservable.datetime_pickup"
                    placeholder="Fecha y hora de entrega"
                    class="form-control"
                    type="datetime-local"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Devolución*</label>
                  <input
                    :value="reservation_detail.reservable.return"
                    type="text"
                    class="form-control"
                    placeholder="Lugar de devolución"
                    @change="reservation_detail.reservable.return = capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Lugar y hora de devolución*</label>
                  <input
                    v-model="reservation_detail.reservable.return_datetime"
                    placeholder="Fecha y hora de devolución"
                    class="form-control"
                    type="datetime-local"
                  >
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Nombre de agencia*</label>
                  <input
                    :value="reservation_detail.reservable.agency_name"
                    type="text"
                    class="form-control text-box-n"
                    placeholder="Nombre de agencia de renta"
                    @change="reservation_detail.reservable.agency_name = capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Categoría*</label>
                  <input
                    :value="reservation_detail.reservable.car_category"
                    type="text"
                    class="form-control"
                    placeholder="Categoría de carro"
                    @change="reservation_detail.reservable.car_category = capitalizeInput($event.target.value)"
                  >
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Seguro*</label>
                  <v-select
                    v-model="reservation_detail.reservable.insurance"
                    :clearable="false"
                    :reduce="value=>value.value"
                    :options="[{label: 'Si', value: true}, {label: 'No', value: false}]"
                  />
                </div>
              </div>

              <div class="col-12">
                <div class="form-group">
                  <label>Recomendaciones</label>
                  <textarea
                    v-model="reservation_detail.reservable.recommendations"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <hr>
            <div class="d-flex align-items-center mb-2">
              <h6>Adicionales</h6>
              <b-button
                variant="primary"
                class="btn-icon ml-1"
                @click="addAddon"
              >
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>
            <div class="row">
              <div class="col-12">
                <car-rental-addon-form-component
                  v-for="(addon, index) of reservation_detail.reservable.car_rental_addons"
                  :key="index"
                  :addon="addon"
                  :number="index+1"
                  @delete="deleteAddon(index)"
                />
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
import VSelect from 'vue-select'
import { BButton, BFormCheckbox, BFormFile } from 'bootstrap-vue'
import CarRentalAddonFormComponent from '@/views/components/CarRentalAddonFormComponent.vue'
import ReservationDetailCommentsComponent from '@/views/components/ReservationDetailCommentsComponent.vue'
import { ref } from '@vue/composition-api/dist/vue-composition-api'
import Cleave from 'vue-cleave-component'

// import carrentalbinnacle from '../CarRentalBinnacleComponent.vue'

export default {

  name: 'CarRentalServiceView',
  components: {
    VSelect,
    BButton,
    BFormFile,
    CarRentalAddonFormComponent,
    BFormCheckbox,
    ReservationDetailCommentsComponent,
    Cleave,
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
    addAddon() {
      this.reservation_detail.reservable.car_rental_addons.push({
        name: '',
        public_price: null,
        net_price: null,
      })
    },
    deleteAddon(index) {
      this.reservation_detail.reservable.car_rental_addons.splice(index, 1)
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

      if (!this.reservation_detail.public_price || Number.isNaN(Number(this.reservation_detail.public_price))) {
        this.showError('Ingrese el precio público')
        e.preventDefault()
        return
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
      reservable_type: 'App\\Models\\CarRentalReservation',
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
        pickup: '',
        datetime_pickup: null,
        return_datetime: null,
        return: '',
        agency_name: '',
        car_category: '',
        insurance: false,
        recommendations: '',
        car_rental_addons: [],
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
