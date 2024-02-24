<template>
  <b-modal ref="refFormModal" title="Agrega vuelo" ok-title="Aceptar" cancel-title="Cancelar" no-close-on-backdrop
    no-close-on-esc :hide-header-close="isPack" @ok="save" @hidden="$emit('close')" @cancel="close">
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
                  <label>Fecha máxima de liquidación*</label>
                  <input v-model="reservation_detail.max_settlement_date" type="date" class="form-control"
                    placeholder="Fecha máxima de liquidación" @change="onSettlementDateChange">
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Fecha máxima de pago*</label>
                  <input v-model="reservation_detail.max_payment_date" type="date" class="form-control"
                    placeholder="Fecha máxima de pago">
                </div>
              </div>

            </div>

            <hr>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Aerolínea*</label>
                  <input :value="reservation_detail.reservable.airline" type="text" class="form-control"
                    placeholder="Nombre de aerolínea"
                    @change="reservation_detail.reservable.airline = capitalizeInput($event.target.value)">
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>PNR*</label>
                  <input v-model="reservation_detail.reservable.PNR" type="text" class="form-control" placeholder="PNR">
                </div>
              </div>
              <!--              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Vuelo redondo*</label>
                  <v-select
                    v-model="reservation_detail.reservable.round"
                    label="text"
                    :clearable="false"
                    :options="round"
                    :reduce="value=>value.value"
                    :get-option-label="options=>options.label"
                  />
                </div>
              </div>-->
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Adultos*</label>
                  <input v-model="reservation_detail.reservable.adults_quantity" type="number" class="form-control"
                    placeholder="Cantidad de adultos" @change="updatePeopleQty" @keydown="onlyNumbers($event)">
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Menores*</label>
                  <input v-model="reservation_detail.reservable.minors_quantity" type="number" class="form-control"
                    placeholder="Cantidad de menores" @change="updatePeopleQty" @input="onlyNumbers($event)">
                </div>
              </div>
            </div>
            <hr>
            <div v-if="reservation_detail.reservable.flight_reservation_people.length > 0" class="row">
              <div v-for="(person, index) of reservation_detail.reservable.flight_reservation_people" :key="index"
                class="col-12">
                <h6>Persona {{ index + 1 }}</h6>
                <div class="row">
                  <div class="col-12 col-md-8">
                    <div class="form-group">
                      <label>Nombre*</label>
                      <input :value="person.full_name" type="text" class="form-control" placeholder="Nombre completo"
                        @change="person.full_name = capitalizeInput($event.target.value)">
                    </div>
                  </div>
                  <div class="col-12 col-md-4">
                    <div class="form-group">
                      <label>Edad*</label>
                      <input v-model="person.age" type="number" class="form-control" placeholder="Edad">
                    </div>
                  </div>
                </div>

                <hr>
              </div>
            </div>

            <div class="d-flex align-items-center">
              <h6>Vuelos*</h6>
              <!--              <b-button
                variant="primary"
                class="btn-icon ml-1"
                @click="addFlightInfo"
              >
                <feather-icon icon="PlusIcon" />
              </b-button>-->
            </div>
            <div class="row">
              <div class="col-12 col-md-12">
                <flights-group-component :flights="reservation_detail.reservable.flight_reservation_flights"
                  @delete-flights="deleteAllFlights" @delete-flight="deleteFlightInfo" />
                <!--                <FlightDetailComponent
                  v-for="(flight, index) of reservation_detail.reservable.flight_reservation_flights"
                  :key="index"
                  :flight="flight"
                  :number="index+1"
                  @delete="deleteFlightInfo(index)"
                  @update="flightUpdated"
                />-->
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Notas generales* (Visible para cliente)</label>
                  <textarea v-model="reservation_detail.reservable.general_notes" type="text" class="form-control"
                    placeholder="Notas generales" />
                </div>
              </div>
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Texto de migración*</label>
                  <textarea v-model="reservation_detail.reservable.migration_text" type="text" class="form-control"
                    placeholder="Texto de migración" />
                </div>
              </div>
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Texto para vuelos internaciones</label>
                  <textarea v-model="reservation_detail.reservable.international_flight_text" type="text"
                    class="form-control" placeholder="Texto de migración" />
                </div>
              </div>
              <div class="col-12 col-md-12">
                <div class="form-group">
                  <label>Texto para vuelos nacionales</label>
                  <textarea v-model="reservation_detail.reservable.national_flight_text" type="text" class="form-control"
                    placeholder="Texto de migración" />
                </div>
              </div>

            </div>
            <hr v-if="!isPack">
            <div v-if="!isPack" class="row">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Precio público*</label>
                  <cleave v-model="reservation_detail.public_price" :options="numberFormatOptions" class="form-control"
                    placeholder="Precio público" :disabled="!hasGlobalPrices" />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Precio neto*</label>
                  <cleave v-model="reservation_detail.net_price" :options="numberFormatOptions" class="form-control"
                    placeholder="Precio neto" :disabled="!hasGlobalPrices" />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Servicio agregado*</label>
                  <cleave v-model="reservation_detail.added_price" :options="numberFormatOptions" class="form-control"
                    placeholder="Precio neto" :disabled="!hasGlobalPrices" />
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

            <hr>
            <div class="row">
              <div class="col-12">
                <div v-if="!reservation_detail.multimedia">
                  <!-- Styled -->
                  <label>Voucher del proveedor</label>
                  <b-form-file v-model="file" placeholder="Escoge el archivo o arrastra aquí..."
                    drop-placeholder="Suelta aquí..." />
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
import { BFormCheckbox, BFormFile } from 'bootstrap-vue'
import ReservationDetailCommentsComponent from '@/views/components/ReservationDetailCommentsComponent.vue'
import { ref } from '@vue/composition-api/dist/vue-composition-api'
import Cleave from 'vue-cleave-component'
import FlightsGroupComponent from '@/views/components/FlightsGroupComponent.vue'

export default {

  name: 'FlightServiceModal',
  components: {
    FlightsGroupComponent,
    VSelect,
    BFormFile,
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
    isPack: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      file: null,
      hasGlobalPrices: true,
      comment: '',
      round: [{ label: 'Si', value: 1 }, { label: 'No', value: 0 }],
      // peopleQty: 0,
    }
  },
  mounted() {
    this.flightUpdated()
    this.updateTotal()
  },
  methods: {
    onSettlementDateChange() {
      // menos 3 días
      const d = new Date(`${this.reservation_detail.max_settlement_date}T00:00:00`)
      d.setDate(d.getDate() - 3)
      // eslint-disable-next-line prefer-destructuring
      this.reservation_detail.max_payment_date = helpers.dateFormat(d)
    },
    close() {
      if (this.isPack && !this.reservationDetailParam.id) {
        this.$emit('cancel-modal')
      }
    },
    show() {
      this.refFormModal.show()
    },
    onlyNumbers(e) {
      const noValidKeys = ['.', '-', '+']
      if (noValidKeys.includes(e.key.toString())) {
        e.preventDefault()
      }
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

      const totalPeople = adultsQty + minorQty

      this.reservation_detail.reservable.flight_reservation_people = []
      for (let i = 0; i < totalPeople; i += 1) {
        this.reservation_detail.reservable.flight_reservation_people.push({
          full_name: '',
          age: null,
        })
      }
    },
    addFlightInfo() {
      this.reservation_detail.reservable.flight_reservation_flights.push({
        departure_city: '',
        departure_airport: '',
        departure_datetime: '',
        arrive_city: '',
        arrive_airport: '',
        arrive_datetime: '',
        public_price: '',
        net_price: '',
        type: null,
        flight_number: '',
        flight_reservation_flight_additional_services: [],
        flight_reservation_flight_addons: [],
      })
    },
    deleteAllFlights() {
      this.reservation_detail.reservable.flight_reservation_flights = [
        {
          departure_city: '',
          departure_airport: '',
          departure_datetime: '',
          arrive_city: '',
          arrive_airport: '',
          arrive_datetime: '',
          public_price: '',
          net_price: '',
          type: 1,
          flight_number: '',
          flight_reservation_flight_additional_services: [],
          flight_reservation_flight_addons: [],
        },
      ]
    },
    deleteFlightInfo(index) {
      const flight = this.reservation_detail.reservable.flight_reservation_flights[index]
      let toDeleteCount = 1
      if (flight.type.toString() === '2') {
        toDeleteCount = this.reservation_detail.reservable.flight_reservation_flights.length - index
      } else if (flight.type.toString() === '3') {
        for (let i = index + 1; i < this.reservation_detail.reservable.flight_reservation_flights.length; i += 1) {
          if (this.reservation_detail.reservable.flight_reservation_flights[i].type.toString() === '2') {
            break
          }
          toDeleteCount += 1
        }
      }
      this.reservation_detail.reservable.flight_reservation_flights.splice(index, toDeleteCount)

      this.flightUpdated()
    },
    flightUpdated() {
      const hasFlightWithPrices = this.reservation_detail.reservable.flight_reservation_flights.filter(flight => (flight.public_price && !Number.isNaN(flight.public_price)) || (flight.net_price && !Number.isNaN(flight.net_price)))
      if (hasFlightWithPrices.length === 0 && !this.hasGlobalPrices) {
        this.reservation_detail.public_price = null
        this.reservation_detail.net_price = null
      }

      this.hasGlobalPrices = hasFlightWithPrices.length === 0
      this.updateTotal()
    },
    updateTotal() {
      if (!this.hasGlobalPrices) {
        let publicPrice = 0
        let netPrice = 0
        let addedPrice = 0

        this.reservation_detail.reservable.flight_reservation_flights.forEach(flight => {
          if (flight.public_price && !Number.isNaN(flight.public_price)) {
            publicPrice += parseFloat(flight.public_price)
          }
          if (flight.net_price && !Number.isNaN(flight.net_price)) {
            netPrice += parseFloat(flight.net_price)
          }
          if (flight.added_price && !Number.isNaN(flight.added_price)) {
            addedPrice += parseFloat(flight.added_price)
          }
        })
        this.reservation_detail.public_price = publicPrice
        this.reservation_detail.net_price = netPrice
        this.reservation_detail.added_price = addedPrice
      }
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
      if (this.reservation_detail.reservable.airline.toString().trim() === '') {
        this.showError('Ingrese la aerolínea')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.PNR.toString().trim() === '') {
        this.showError('Ingrese el PNR')
        e.preventDefault()
        return
      }
      /* if (this.reservation_detail.reservable.round === '') {
        this.showError('Ingrese si el vuelo es redondo')
        e.preventDefault()
      } */
      if (!this.reservation_detail.reservable.adults_quantity || Number.isNaN(this.reservation_detail.reservable.adults_quantity)) {
        this.showError('Ingrese la cantidad de adultos')
        e.preventDefault()
        return
      }
      if ([undefined, null].includes(this.reservation_detail.reservable.minors_quantity) || Number.isNaN(this.reservation_detail.reservable.minors_quantity)) {
        this.showError('Ingrese la cantidad de menores')
        e.preventDefault()
        return
      }
      for (let i = 0; i < this.reservation_detail.reservable.flight_reservation_flights.length; i += 1) {
        const flight = this.reservation_detail.reservable.flight_reservation_flights[i]
        if (!flight.type) {
          this.showError(`Seleccione el tipo de vuelo para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        }
        /* if (flight.departure_city.toString().trim() === '') {
          this.showError(`Ingrese la ciudad de salida para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        } */
        if (flight.departure_airport.toString().trim() === '') {
          this.showError(`Ingrese el aeropuerto de salida para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        }
        if (flight.departure_datetime.toString().trim() === '') {
          this.showError(`Seleccione la fecha de salida para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        }

        /* if (flight.arrive_city.toString().trim() === '') {
          this.showError(`Ingrese la ciudad de llegada para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        } */
        if (flight.arrive_airport.toString().trim() === '') {
          this.showError(`Ingrese el aeropuerto de llegada para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        }
        if (flight.arrive_datetime.toString().trim() === '') {
          this.showError(`Seleccione la fecha de llegada para el vuelo ${i + 1}`)
          e.preventDefault()
          return
        }
        if (!this.hasGlobalPrices) {
          if (!flight.public_price || Number.isNaN(Number(flight.public_price))) {
            this.showError(`Ingrese el precio público para el vuelo ${i + 1}`)
            e.preventDefault()
            return
          }

          if (!flight.net_price || Number.isNaN(Number(flight.net_price))) {
            this.showError(`Ingrese el precio neto para el vuelo ${i + 1}`)
            e.preventDefault()
            return
          }

          if (parseFloat(flight.public_price) < parseFloat(flight.net_price)) {
            this.showError(`El precio público debe de ser mayor que el precio neto para el vuelo ${i + 1}`)
            e.preventDefault()
            return
          }
        }
      }

      if (this.reservation_detail.reservable.general_notes.toString().trim() === '') {
        this.showError('Ingrese notas generales para el cliente')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.migration_text.toString().trim() === '') {
        this.showError('Ingrese el texto de información para migración')
        e.preventDefault()
        return
      }
      /* if (this.reservation_detail.reservable.international_flight_text.toString().trim() === '') {
        this.showError('Ingrese el texto de información para vuelos internacionales')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.national_flight_text.toString().trim() === '') {
        this.showError('Ingrese el texto de información para vuelos nacionales')
        e.preventDefault()
        return
      } */
      if (this.isPack) {
        this.reservation_detail.public_price = 0
        this.reservation_detail.net_price = 0
      } else {
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
      }

      if (!this.reservation_detail.id) {
        this.reservation_detail.reservation_detail_comments.push({
          comment: this.comment,
        })
      }
      if (this.file) {
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
      reservable_type: 'App\\Models\\FlightReservation',
      reservable_id: null,
      public_price: null,
      net_price: null,
      added_price: 0,
      provider_id: null,
      cancellable: true,
      editable: true,
      refundable: true,
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
        airline: '',
        PNR: '',
        round: 0,
        adults_quantity: 0,
        minors_quantity: 0,
        migration_text: '',
        general_notes: 'Para que llegues a tiempo\n'
          + 'Debes estar en el aeropuerto al menos 2 horas antes de la hora de despegue de tu vuelo (3 horas antes para vuelos internacionales).\n'
          + 'La hora de despegue y aterrizaje es la hora local de cada ciudad\n'
          + 'Todos los pasajeros deben presentar una identificación con foto para cambiar este cupón por un pase de abordar.\n'
          + '\n'
          + 'Asegúrate de tener la documentación necesaria para viajar, como pasaporte y visas.\n'
          + 'Algunas aerolíneas cobran por documentar equipaje. El costo del boleto no incluye estos cargos. Consulta con la aerolínea las reglas para documentar equipaje.',
        international_flight_text: '',
        national_flight_text: '',
        is_pack: props.isPack,
        flight_reservation_people: [],
        flight_reservation_flights: [
          {
            departure_city: '',
            departure_airport: '',
            departure_datetime: '',
            arrive_city: '',
            arrive_airport: '',
            arrive_datetime: '',
            public_price: '',
            net_price: '',
            type: 1,
            flight_number: '',
            flight_reservation_flight_additional_services: [],
            flight_reservation_flight_addons: [],
          },
        ],
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
</style>
