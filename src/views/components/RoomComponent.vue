<template>
  <b-card>
    <template #header>
      <h6>Habitación {{ number }}</h6>
      <b-button variant="danger" class="btn-icon ml-1" @click="deleteRoom">
        <feather-icon icon="TrashIcon" />
      </b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Nombre de habitación*</label>
          <input :value="room.room_type" class="form-control" type="text" placeholder="Nombre de habitación"
            @change="room.room_type = roomUpdated($event.target.value)">
        </div>
      </div>

      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Plan de alimentos*</label>
          <v-select v-model="room.meal_plan" label="text" :clearable="false" :options="mealPlans" />

        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Cantidad de adultos*</label>
          <input v-model="room.adults_quantity" class="form-control" type="number" placeholder="Cantidad de adultos"
            @change="roomUpdated">
        </div>
      </div>

      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Cantidad de menores*</label>
          <v-select v-model="room.minors_quantity" label="text" :clearable="false" :options="[1, 2, 3]" />

        </div>
      </div>

    </div>
    <hr v-if="room.minors_quantity && !isNaN(room.minors_quantity) && room.minors_quantity > 0">

    <div v-if="room.minors_quantity && !isNaN(room.minors_quantity) && room.minors_quantity > 0" class="row">
      <div v-for="(index) in parseInt(room.minors_quantity)" :key="index" class="col-12 col-md-3">
        <div class="form-group">
          <label>Edad menor {{ index }}*</label>
          <input v-model="room.hotel_reservation_room_people[index - 1]" type="number" class="form-control"
            @change="roomUpdated">
        </div>
      </div>
    </div>

    <hr v-if="room.minors_quantity && !isNaN(room.minors_quantity) && room.minors_quantity > 0">

    <div class="row">
      <div class="col-12">
        <label>Peticiones especiales</label>
        <textarea v-model="room.special_request" class="form-control" placeholder="Peticiones especiales"
          @change="roomUpdated" />
      </div>
    </div>
  </b-card>
</template>

<script>
import helpers from '@/dc-it/services/helpers'
import { BCard, BButton } from 'bootstrap-vue'
import Cleave from 'vue-cleave-component'
import vSelect from 'vue-select'

export default {
  name: 'RoomComponent',
  components: {
    BCard, BButton, Cleave, vSelect,
  },
  props: {
    room: {
      type: Object,
      default: () => ({
        room_type: '',
        public_price: '',
        net_price: '',
        special_request: '',
      }),
    },
    number: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      numberFormatOptions: {
        prefix: '$ ',
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        rawValueTrimPrefix: true,
      },
      mealPlans: [
        'Solo alojamiento',
        'Todo incluido',
        'Desayuno',
        'Desayuno bufet',
        'Desayuno continental',
        'Desayuno americano',
        'Comida',
      ]
    }
  },
  methods: {
    deleteRoom() {
      this.$emit('delete')
    },
    roomUpdated(value) {
      this.$emit('update')
      return helpers.capitalize(value)
    },
  },
}
</script>
