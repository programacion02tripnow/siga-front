<template>
  <b-modal ref="refFormModal" title="Agrega servicio de tour" ok-title="Aceptar" cancel-title="Cancelar"
    no-close-on-backdrop @ok="save" @hidden="$emit('close')">
    <div style="display:flex; align-items: center; justify-content: center">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Proveedor*</label>
                  <v-select v-model="reservation_detail.provider_id" label="text" :clearable="false" :options="providers"
                    :reduce="value => value.getAttr('id')" :get-option-label="option => option.getAttr('name')" />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Confirmación*</label>
                  <input v-model="reservation_detail.provider_confirmation_number" type="text" class="form-control"
                    placeholder="Numero de confirmación">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Fecha limite de liquidación*</label>
                  <input v-model="reservation_detail.max_settlement_date" type="date" class="form-control"
                    placeholder="Fecha máxima de liquidación" @change="onSettlementDateChange">
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Fecha limite de pago*</label>
                  <input v-model="reservation_detail.max_payment_date" type="date" class="form-control"
                    placeholder="Fecha máxima de pago">
                </div>
              </div>

            </div>

            <hr>
            <div class="row">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Destino*</label>
                  <input :value="reservation_detail.reservable.destination" type="text" class="form-control"
                    placeholder="Nombre destino"
                    @change="reservation_detail.reservable.destination = capitalizeInput($event.target.value)">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Tour*</label>
                  <input :value="reservation_detail.reservable.tour_name" type="text" class="form-control"
                    placeholder="Nombre de tour"
                    @change="reservation_detail.reservable.tour_name = capitalizeInput($event.target.value)">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Paquete</label>
                  <input :value="reservation_detail.reservable.package_name" type="text" class="form-control"
                    placeholder="Nombre de paquete"
                    @change="reservation_detail.reservable.package_name = capitalizeInput($event.target.value)">
                </div>
              </div>
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Fecha*</label>
                  <input v-model="reservation_detail.reservable.date" type="date" class="form-control"
                    placeholder="Fecha del tour">
                </div>
              </div>
            </div>
            <hr>
            <div class="row" />
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Adultos*</label>
                  <input v-model="reservation_detail.reservable.adults_quantity" type="number" class="form-control"
                    placeholder="Cantidad de adultos" @change="updatePeopleQty">
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Menores*</label>
                  <input v-model="reservation_detail.reservable.minors_quantity" type="number" class="form-control"
                    placeholder="Cantidad de menores" @change="updatePeopleQty">
                </div>
              </div>
            </div>

            <div class="row">
              <div v-for="(index) in (parseInt(peopleQty))" :key="index" class="col-12 col-md-4">
                <div class="form-group">
                  <label>Edad {{ index }}*</label>
                  <input v-model="reservation_detail.reservation_detail_ages[index - 1]" type="number"
                    class="form-control">
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Descripción*</label>
                  <textarea v-model="reservation_detail.reservable.description" type="text" class="form-control"
                    placeholder="Descripción del tour" />
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Precio público*</label>
                  <cleave v-model="reservation_detail.public_price" :options="numberFormatOptions" class="form-control"
                    placeholder="Precio público" />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Precio neto*</label>
                  <cleave v-model="reservation_detail.net_price" :options="numberFormatOptions" class="form-control"
                    placeholder="Precio neto" />
                </div>
              </div>

              <div class="col-12 col-md-4">
                <b-form-checkbox v-model="reservation_detail.cancellable" switch>
                  Cancelable
                </b-form-checkbox>
              </div>
              <div class="col-12 col-md-4">
                <b-form-checkbox v-model="reservation_detail.editable" switch>
                  Editable
                </b-form-checkbox>
              </div>
              <div class="col-12 col-md-4">
                <b-form-checkbox v-model="reservation_detail.refundable" switch>
                  Reembolsable
                </b-form-checkbox>
              </div>
            </div>

            <hr>
            <div class="row">
              <div class="col-12">
                <div class="form-group">
                  <label>Términos y condiciones*</label>
                  <textarea v-model="reservation_detail.terms_conditions" class="form-control" />
                </div>
              </div>
            </div>

            <hr>
            <div>
              <reservation-detail-comments-component :comments="reservation_detail.reservation_detail_comments"
                :reservation-detail-id="reservation_detail.id"
                :show-form="reservation_detail.id && reservation_detail.id > 0" @onCommentSaved="onCommentSaved" />
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
import { ref } from '@vue/composition-api/dist/vue-composition-api'
import { BFormCheckbox, BFormFile } from 'bootstrap-vue'
import ReservationDetailCommentsComponent from '@/views/components/ReservationDetailCommentsComponent.vue'
import Cleave from 'vue-cleave-component'

export default {

  name: 'TourServiceView',
  components: {
    vSelect, BFormCheckbox, ReservationDetailCommentsComponent, BFormFile, Cleave,
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
      comment: '',
      peopleQty: 0,
      file: null,
    }
  },
  mounted() {
    this.updatePeopleQty()
  },
  methods: {
    onSettlementDateChange() {
      // menos 3 días
      const d = new Date(`${this.reservation_detail.max_settlement_date}T00:00:00`)
      d.setDate(d.getDate() - 3)
      // eslint-disable-next-line prefer-destructuring
      this.reservation_detail.max_payment_date = helpers.dateFormat(d)
    },
    updatePeopleQty() {
      let adultsQty = 0
      let minorQty = 0

      if (this.reservation_detail.reservable.adults_quantity && !Number.isNaN(Number(this.reservation_detail.reservable.adults_quantity))) {
        adultsQty = parseInt(this.reservation_detail.reservable.adults_quantity, 10)
      }

      if (this.reservation_detail.reservable.minors_quantity && !Number.isNaN(Number(this.reservation_detail.reservable.minors_quantity))) {
        minorQty = parseInt(this.reservation_detail.reservable.minors_quantity, 10)
      }

      this.peopleQty = adultsQty + minorQty
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
      if (this.reservation_detail.reservable.destination.trim() === '') {
        this.showError('Ingrese un destino')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.tour_name.trim() === '') {
        this.showError('Ingrese el nombre del tour')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.reservable.date || this.reservation_detail.reservable.date.trim() === '' || new Date(this.reservation_detail.reservable.date).toString() === 'Invalid Date') {
        this.showError('Seleccione una fecha para el tour')
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
        return
      }

      for (let i = 0; i < this.peopleQty; i += 1) {
        if (!this.reservation_detail.reservation_detail_ages[i] || Number.isNaN((this.reservation_detail.reservation_detail_ages[i]))) {
          this.showError(`Ingrese la edad de la persona ${i + 1}`)
          e.preventDefault()
          return
        }
      }

      if (this.reservation_detail.reservable.description.trim() === '') {
        this.showError('Ingrese la descripción del tour')
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
      reservable_type: 'App\\Models\\TourReservation',
      reservable_id: null,
      public_price: null,
      net_price: null,
      provider_id: null,
      cancellable: false,
      editable: false,
      refundable: false,
      terms_conditions: '',
      provider_confirmation_number: '',
      reservation_detail_ages: [],
      reservation_detail_comments: [],
      cancelled_at: null,
      cancelled_by_id: null,
      multimedia: null,
      invoiced: 0,
      max_payment_date: null,
      max_settlement_date: null,
      reservable: {
        destination: '',
        tour_name: '',
        package_name: '',
        adults_quantity: null,
        minors_quantity: null,
        description: '',
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
      reservationDetail.value.reservation_detail_ages = props.reservationDetailParam.reservation_detail_ages.map(age => {
        if (age.id) {
          return age.age
        }
        return age
      })
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
