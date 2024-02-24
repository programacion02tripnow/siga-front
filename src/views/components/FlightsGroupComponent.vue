<template>
  <div
    class="d-flex"
    style="overflow: auto"
  >
    <div
      v-for="(flight, index) of flights"
      :key="index"
      class="d-flex"
    >

      <div
        v-if="flight.type.toString()==='2'"
        class="ml-2 d-flex align-items-center"
        style="width: 200px;"
      >
        <div class="btn-group-vertical">
          <button
            class=" btn btn-secondary"
            @click="addScale(false)"
          >
            Agregar escala
          </button>
        </div>
      </div>

      <div
        class="card mr-2"
        style="width:300px;"
      >
        <div class="card-header justify-content-end">
          <button
            class="btn btn-danger"
            @click="deleteFlight(flight, index)"
          >
            <feather-icon
              icon="TrashIcon"
            />
          </button>
        </div>
        <div class="card-body">
          <div class="text-center">
            <h5>{{ types[flight.type] }}</h5>
            <feather-icon
              icon="SendIcon"
              size="26"
              class="my-1"
            />
            <div class="form-group">
              <label>Número de vuelo</label>
              <input
                v-model="flight.flight_number"
                type="text"
                class="form-control"
              >
            </div>
            <div class="form-group">
              <label>IATA Salida</label>
              <input
                :value="flight.departure_airport.toString().toUpperCase()"
                type="text"
                class="form-control"
                @input="flight.departure_airport = $event.target.value.toString().toUpperCase()"
              >
            </div>
            <div class="form-group">
              <label>Fecha de salida</label>
              <flat-pickr
                v-model="flight.departure_datetime"
                class="form-control"
                :config="{ enableTime: true,dateFormat: 'Y-m-d H:i', time_24hr: true, allowInput: true}"
                @input="dateChanged(flight, index)"
              />
            </div>

            <div class="form-group">
              <label>IATA Llegada</label>
              <input
                :value="flight.arrive_airport.toString().toUpperCase()"
                type="text"
                class="form-control"
                @input="flight.arrive_airport = $event.target.value.toString().toUpperCase()"
              >
            </div>
            <div class="form-group">
              <label>Fecha de Llegada</label>
              <flat-pickr
                v-model="flight.arrive_datetime"
                class="form-control"
                :config="{ enableTime: true,dateFormat: 'Y-m-d H:i', time_24hr: true, allowInput: true}"
              />
            </div>

          </div>
        </div>
      </div>

    </div>

    <div
      class="ml-2 d-flex align-items-center"
      style="width: 200px;"
    >
      <div class="btn-group-vertical">
        <button
          v-if="!isRoundTrip"
          class=" btn btn-primary"
          @click="toRoundTrip"
        >
          Convertir a redondo
        </button>
        <button
          class=" btn btn-secondary"
          @click="addScale(true)"
        >
          Agregar escala
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/*
Tipos de vuelo
1 -> ida
2 ->vuelta
3->escala
 */

import flatPickr from 'vue-flatpickr-component'
import helpers from '@/dc-it/services/helpers'

export default {
  name: 'FlightsGroupComponent',
  components: { flatPickr },
  props: {
    flights: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      types: {
        1: 'Salida',
        2: 'Regreso',
        3: 'Escala',
      },
    }
  },
  computed: {
    isRoundTrip() {
      return this.flights.some(flight => flight.type.toString() === '2')
    },
  },
  mounted() {

  },
  methods: {
    toRoundTrip() {
      const flights = JSON.parse(JSON.stringify(this.flights)).reverse()
      // eslint-disable-next-line no-restricted-syntax
      for (const flight of flights) {
        const tmpFlight = JSON.parse(JSON.stringify(flight))
        tmpFlight.type = this.isRoundTrip ? 3 : 2 // flight.type.toString() === '1' ? 2 : 3
        tmpFlight.departure_city = flight.arrive_city
        tmpFlight.departure_airport = flight.arrive_airport
        tmpFlight.departure_datetime = ''
        tmpFlight.arrive_city = flight.departure_city
        tmpFlight.arrive_airport = flight.departure_airport
        tmpFlight.arrive_datetime = ''
        tmpFlight.flight_number = ''
        this.flights.push(tmpFlight)
      }
    },
    addScale(isLast) {
      let index = this.flights.length - 1
      if (!isLast && this.isRoundTrip) {
        index = this.flights.findIndex(flight => flight.type.toString() === '2') - 1
      }
      const flight = this.flights[index]
      const tmpFlight = JSON.parse(JSON.stringify(this.flights[index]))
      tmpFlight.type = 3
      tmpFlight.departure_city = flight.arrive_city
      tmpFlight.departure_airport = flight.arrive_airport
      tmpFlight.departure_datetime = flight.arrive_datetime
      tmpFlight.arrive_city = ''
      tmpFlight.arrive_airport = ''
      tmpFlight.arrive_datetime = ''
      tmpFlight.flight_number = ''
      this.flights.splice(index + 1, 0, tmpFlight)
    },
    deleteFlight(flight, index) {
      let title = '¿Está seguro que desea borrar el vuelo?'
      // eslint-disable-next-line default-case
      switch (flight.type.toString()) {
        case '1': // Salida
          if (this.isRoundTrip || this.flights.length > 1) {
            title += '<br>Se borrarán todos los vuelos'
          }
          this.$swal({
            title,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar',
          }).then((result => {
            if (result.isConfirmed) {
              this.$emit('delete-flights')
            }
          }))
          break
        case '2': // Retorno
          if (this.flights.length >= index) {
            title += '<br>Se borrarán todas las escalas del vuelo de retorno'
          }
          this.$swal({
            title,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar',
          }).then((result => {
            if (result.isConfirmed) {
              this.$emit('delete-flight', index)
            }
          }))
          break
        case '3': // escala
          title += '<br>Se borrarán las escalas subsecuentes'
          this.$swal({
            title,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar',
          }).then((result => {
            if (result.isConfirmed) {
              this.$emit('delete-flight', index)
            }
          }))
      }
    },
    dateChanged(flight, index) {
      const d = new Date(flight.departure_datetime)
      d.setTime(d.getTime() + (2 * 60 * 60 * 1000))
      this.flights[index].arrive_datetime = helpers.dateFormat(d, true)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
