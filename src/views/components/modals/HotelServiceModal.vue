<template>
  <b-modal ref="refFormModal" title="Agrega servicio de hotel" ok-title="Aceptar" cancel-title="Cancelar"
    no-close-on-backdrop @ok="save" @hidden="$emit('close')">
    <div style="display:flex; align-items: center; justify-content: center">
      <div v-if="reservation_detail" class="container">
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
                  <label>Localizador*</label>
                  <input v-model="reservation_detail.provider_confirmation_number" class="form-control" type="text"
                    placeholder="Localizador">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group">
                  <label>Reflex</label>
                  <b-form-checkbox v-model="reservation_detail.with_payments" switch />
                </div>
              </div>

              <div class="col-12 col-md-6" v-if="reservation_detail.with_payments">
                <div class="form-group">
                  <label>Fecha máxima de pago*</label>
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
                  <input :value="reservation_detail.reservable.destination" class="form-control" type="text"
                    placeholder="Nombre de destino"
                    @change="reservation_detail.reservable.destination = capitalizeInput($event.target.value)">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Hotel*</label>
                  <input :value="reservation_detail.reservable.hotel_name" class="form-control" type="text"
                    placeholder="Nombre de hotel"
                    @change="reservation_detail.reservable.hotel_name = capitalizeInput($event.target.value)">
                </div>
              </div>

              <div class="col-12 col-md-6 d-none">
                <div class="form-group">
                  <label>Tarifa de sanitización</label>
                  <cleave v-model="reservation_detail.reservable.sanitation_rate" class="form-control"
                    :options="numberFormatOptions" placeholder="Tarifa de sanitización" />
                </div>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Check In*</label>
                  <input v-model="reservation_detail.reservable.check_in" class="form-control" type="date"
                    placeholder="Check In">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Check Out*</label>
                  <input v-model="reservation_detail.reservable.check_out" class="form-control" type="date"
                    placeholder="Check Out">
                </div>
              </div>

              <div class="col-12 col-md-4 d-none">
                <div class="form-group">
                  <label>Plan de alimentos*</label>
                  <v-select v-model="reservation_detail.reservable.meal_plan" label="text" :clearable="false"
                    :options="mealPlans" />

                </div>
              </div>
            </div>

            <hr>
            <div class="d-flex align-items-center mb-2">
              <h6>Habitaciones</h6>
              <b-button variant="primary" class="btn-icon ml-1" @click="addRoom">
                <feather-icon icon="PlusIcon" />
              </b-button>
            </div>

            <div class="row">
              <div class="col-12">
                <room-component v-for="(room, index) of reservation_detail.reservable.hotel_reservation_rooms"
                  :key="index" :room="room" :number="index + 1" @delete="deleteRoom(index)" @update="roomUpdated" />
              </div>
            </div>

            <hr>
            <div class="row">
              <div class="col-12 col-md-12">
                <b-form-checkbox v-model="reservation_detail.reservable.is_pack" switch :disabled="reservation_detail.id">
                  Marcar como paquete
                </b-form-checkbox>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Precio público*</label>
                  <cleave v-model="reservation_detail.public_price" :options="numberFormatOptions"
                    :disabled="!hasGlobalPrices" class="form-control" placeholder="Precio público" />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Precio neto*</label>
                  <cleave v-model="reservation_detail.net_price" :options="numberFormatOptions"
                    :disabled="!hasGlobalPrices" class="form-control" placeholder="Precio neto" />
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label>Servicio agregado*</label>
                  <cleave v-model="reservation_detail.added_price" :options="numberFormatOptions"
                    :disabled="!hasGlobalPrices" class="form-control" placeholder="Servicio agregado" />
                </div>
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

            <hr class="d-none">
            <div class="row d-none">
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
import vSelect from 'vue-select'
import { BButton, BFormCheckbox, BFormFile } from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import ReservationDetailCommentsComponent from '@/views/components/ReservationDetailCommentsComponent.vue'
import Cleave from 'vue-cleave-component'
import RoomComponent from '../RoomComponent.vue'
// import HotelBinnacle from '../HotelBinnacleComponent.vue'

export default {

  name: 'HotelServiceView',
  components: {
    ReservationDetailCommentsComponent,
    RoomComponent,
    vSelect,
    BButton,
    BFormCheckbox,
    BFormFile,
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
      comment: '',
      hasGlobalPrices: true,
      file: null,
    }
  },
  mounted() {
    this.roomUpdated()
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
    show() {
      this.refFormModal.show()
    },
    addRoom() {
      this.reservation_detail.reservable.hotel_reservation_rooms.push({
        room_type: '',
        public_price: null,
        net_price: null,
        net_price: null,
        hotel_reservation_room_people: [],
        special_request: '',
        meal_plan: null
      })
    },
    roomUpdated() {
      const hasRoomWithPrices = this.reservation_detail.reservable.hotel_reservation_rooms.filter(room => (room.public_price && !Number.isNaN(room.public_price)) || (room.net_price && !Number.isNaN(room.net_price)))
      if (hasRoomWithPrices.length === 0 && !this.hasGlobalPrices) {
        this.reservation_detail.public_price = null
        this.reservation_detail.net_price = null
      }

      this.hasGlobalPrices = hasRoomWithPrices.length === 0
      this.updateTotal()
    },
    deleteRoom(index) {
      this.reservation_detail.reservable.hotel_reservation_rooms.splice(index, 1)
      this.roomUpdated()
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
    updateTotal() {
      if (!this.hasGlobalPrices) {
        let publicPrice = 0
        let netPrice = 0

        this.reservation_detail.reservable.hotel_reservation_rooms.forEach(room => {
          if (room.public_price && !Number.isNaN(room.public_price)) {
            publicPrice += parseFloat(room.public_price)
          }
          if (room.net_price && !Number.isNaN(room.net_price)) {
            netPrice += parseFloat(room.net_price)
          }
        })
        this.reservation_detail.public_price = publicPrice
        this.reservation_detail.net_price = netPrice
      }
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
      if (!this.reservation_detail.reservable.destination.trim() === '') {
        this.showError('Ingrese un destino')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.hotel_name.trim() === '') {
        this.showError('Ingrese el nombre del hotel')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.reservable.check_in || this.reservation_detail.reservable.check_in.trim() === '' || new Date(this.reservation_detail.reservable.check_in).toString() === 'Invalid Date') {
        this.showError('Seleccione una fecha de Check in')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.reservable.check_out || this.reservation_detail.reservable.check_out.trim() === '' || new Date(this.reservation_detail.reservable.check_out).toString() === 'Invalid Date') {
        this.showError('Seleccione una fecha de Check out')
        e.preventDefault()
        return
      }
      if (new Date(this.reservation_detail.reservable.check_in) > new Date(this.reservation_detail.reservable.check_out)) {
        this.showError('La fecha de check in tiene que ser menor al check out')
        e.preventDefault()
        return
      }
      /* if (!this.reservation_detail.reservable.adults_quantity || Number.isNaN(this.reservation_detail.reservable.adults_quantity)) {
        this.showError('Ingrese la cantidad de adultos')
        e.preventDefault()
        return
      }
      if (!this.reservation_detail.reservable.minors_quantity || Number.isNaN(this.reservation_detail.reservable.minors_quantity)) {
        this.showError('Ingrese la cantidad de menores')
        e.preventDefault()
        return
      }
      if (this.reservation_detail.reservable.minors_quantity > 0) {
        for (let i = 0; i < this.reservation_detail.reservable.minors_quantity; i += 1) {
          if (Number.isNaN(this.reservation_detail.reservation_detail_ages[i])) {
            this.showError(`Ingrese la edad del menor ${i + 1}`)
            e.preventDefault()
            return
          }
        }
      }
      if (this.reservation_detail.reservable.hotel_reservation_rooms.length === 0) {
        this.showError('Ingrese por lo menos una habitación')
        e.preventDefault()
        return
      } */
      for (let i = 0; i < this.reservation_detail.reservable.hotel_reservation_rooms.length; i += 1) {
        const room = this.reservation_detail.reservable.hotel_reservation_rooms[i]
        if (room.room_type.trim() === '') {
          this.showError(`Ingrese el tipo de habitación para la habitación ${i + 1}`)
          e.preventDefault()
          return
        }
        if (!this.hasGlobalPrices) {
          if (!room.public_price || Number.isNaN(Number(room.public_price))) {
            this.showError(`Ingrese el precio público para la habitación ${i + 1}`)
            e.preventDefault()
            return
          }

          // if (!room.net_price || Number.isNaN(Number(room.net_price))) {
          //   this.showError(`Ingrese el precio neto para la habitación ${i + 1}`)
          //   e.preventDefault()
          //   return
          // }

          // if (parseFloat(room.public_price) < parseFloat(room.net_price)) {
          //   this.showError(`El precio público debe de ser mayor que el precio neto para la habitación ${i + 1}`)
          //   e.preventDefault()
          //   return
          // }
        }

        if (room.minors_quantity > 0) {
          for (let j = 0; j < room.minors_quantity; j += 1) {
            if (Number.isNaN(room.hotel_reservation_room_people[j])) {
              this.showError(`Ingrese la edad del menor ${j + 1}`)
              e.preventDefault()
              return
            }
          }
        }
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
      reservable_type: 'App\\Models\\HotelReservation',
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
        hotel_name: '',
        hotel_phone: '',
        resort_rate: null,
        sanitation_rate: null,
        check_in: null,
        check_out: null,
        meal_plan: 'Solo alojamiento',
        is_pack: false,
        hotel_reservation_rooms: [
          {
            room_type: '',
            public_price: null,
            net_price: null,
            special_request: '',
            adults_quantity: null,
            minors_quantity: null,
            hotel_reservation_room_people: [],
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
      for (let i = 0; i < reservationDetail.value.reservable.hotel_reservation_rooms.length; i += 1) {
        reservationDetail.value.reservable.hotel_reservation_rooms[i].hotel_reservation_room_people = props.reservationDetailParam.reservable.hotel_reservation_rooms[i].hotel_reservation_room_people.map(age => {
          if (age.id) {
            return age.age
          }
          return age
        })
      }
      /* reservationDetail.value.reservable.reservation_detail_ages = props.reservationDetailParam.reservation_detail_ages.map(age => {
        if (age.id) {
          return age.age
        }
        return age
      }) */
    }

    const mealPlans = [
      'Solo alojamiento',
      'Todo incluido',
      'Desayuno',
      'Desayuno bufet',
      'Desayuno continental',
      'Desayuno americano',
      'Comida',
    ]

    const numberFormatOptions = {
      prefix: '$ ',
      numeral: true,
      numeralThousandsGroupStyle: 'thousand',
      rawValueTrimPrefix: true,
    }

    return {
      reservation_detail: reservationDetail,
      refFormModal,
      mealPlans,
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
