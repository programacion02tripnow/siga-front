<template>
  <b-card>
    <template #header>
      <h6>Vuelo {{ number }}</h6>
      <b-button
        class="btn-icon ml-1"
        variant="danger"
        @click="deleteFlightDetail"
      >
        <feather-icon icon="TrashIcon" />
      </b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Tipo*</label>
          <v-select
            v-model="flight.type"
            label="text"
            :clearable="false"
            :options="types"
            :reduce="value=>value.value"
            :get-option-label="option=>option.label"
          />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Número de vuelo*</label>
          <input
            v-model="flight.flight_number"
            type="text"
            class="form-control"
            placeholder="Número de vuelo"
          >
        </div>
      </div>

    </div>
    <hr>
    <div class="row">
      <!--      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Ciudad de salida*</label>
          <input
            :value="flight.departure_city"
            type="text"
            class="form-control"
            placeholder="Ciudad de salida"
            @change="flight.departure_city = capitalizeInput($event.target.value)"
          >
        </div>
      </div>-->
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Aeropuerto de salida*</label>
          <input
            v-model="flight.departure_airport"
            type="text"
            class="form-control"
            placeholder="Aeropuerto de salida"
            @change="flight.departure_airport=capitalizeInput($event.target.value)"
          >
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Fecha/hora de salida*</label>
          <flat-pickr
            v-model="flight.departure_datetime"
            class="form-control"
            :config="{ enableTime: true,dateFormat: 'Y-m-d H:i', time_24hr: true}"
          />
          <!--          <input
            v-model="flight.departure_datetime"
            type="datetime-local"
            class="form-control text-box-n"
            placeholder="Fecha/Hora de salida"
          >-->
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <!--
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Ciudad de llegada*</label>
          <input
            :value="flight.arrive_city"
            type="text"
            class="form-control"
            placeholder="Ciudad de llegada"
            @change="flight.arrive_city = capitalizeInput($event.target.value)"
          >
        </div>
      </div>
-->
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Aeropuerto de llegada*</label>
          <input
            :value="flight.arrive_airport"
            type="text"
            class="form-control"
            placeholder="Aeropuerto de llegada"
            @change="flight.arrive_airport = capitalizeInput($event.target.value)"
          >
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Fecha/hora de llegada*</label>
          <flat-pickr
            v-model="flight.arrive_datetime"
            class="form-control"
            :config="{ enableTime: true,dateFormat: 'Y-m-d H:i', time_24hr: true}"
          />
          <!--          <input
            v-model="flight.arrive_datetime"
            type="datetime-local"
            class="form-control"
            placeholder="Fecha/hora de llegada"
          >-->
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Precio público</label>
          <cleave
            v-model="flight.public_price"
            :options="numberFormatOptions"
            class="form-control"
            placeholder="Precio público"
            @input="flightUpdated"
          />
        </div>
      </div>
      <div class="col-12 col-md-6">
        <div class="form-group">
          <label>Precio neto</label>
          <cleave
            id="net_price"
            v-model="flight.net_price"
            :options="numberFormatOptions"
            class="form-control text-box-n"
            name="net_price"
            placeholder="Precio neto"
            @input="flightUpdated"
          />
        </div>
      </div>
    </div>
    <!--    <hr>
    <div class="row">

      <div class="d-flex alignt-items-center">
        <h6>Addon</h6>
        <b-button
          variant="primary"
          class="btn-icon lm-1"
          @click="addFlightAddon"
        >
          <feather-icon
            icon="PlusIcon"
          />
        </b-button>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-12">
        <FlightAddonComponent
          v-for="(addon, index) of flight_addons"
          :key="index"
          :flight_addon="addon"
          :addon_number="index+1"
          @delete="deleteAddon(index)"
        />
      </div>
    </div>-->
  </b-card>
</template>

<script>
import helpers from '@/dc-it/services/helpers'
import vSelect from 'vue-select'
import { BCard, BButton } from 'bootstrap-vue'
import Cleave from 'vue-cleave-component'
import flatPickr from 'vue-flatpickr-component'

export default {

  name: 'FlightDetailComponent',
  components: {
    vSelect, BCard, BButton, Cleave, flatPickr,
  },
  props: {
    flight: {
      type: Object,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      types: [
        { label: 'Ida', value: 1 },
        { label: 'Vuelta', value: 2 },
      ],
      numberFormatOptions: {
        prefix: '$ ',
        numeral: true,
        numeralThousandsGroupStyle: 'thousand',
        rawValueTrimPrefix: true,
      },
    }
  },
  methods: {
    deleteFlightDetail() {
      this.$emit('delete')
    },
    flightUpdated() {
      this.$emit('update')
    },
    capitalizeInput(value) {
      return helpers.capitalize(value)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
