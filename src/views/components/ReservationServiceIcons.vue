<template>
  <div class="d-flex flex-wrap">
    <div
      v-for="service in value"
      :key="service.getAttr('id')"
    >
      <img
        v-if="!service.getAttr('cancelled_at')"
        v-b-tooltip.hover
        :src="icons[service.getAttr('reservable_type')][0]"
        alt=""
        style="width: 20px;margin-right: 10px;"
        :title="icons[service.getAttr('reservable_type')][1] + ' (' + service.getAttr('provider_confirmation_number') + ')'"
      >
    </div>
  </div>
</template>

<script>

import HotelIcon from '@/assets/images/icons/hotel.png'
import TourIcon from '@/assets/images/icons/tour.png'
import FlightIcon from '@/assets/images/icons/flight.png'
import CarRentalIcon from '@/assets/images/icons/car-rental.png'
import PickupIcon from '@/assets/images/icons/transfer.png'
import { VBTooltip } from 'bootstrap-vue'

export default {
  name: 'ReservationServiceIcons',
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    model: {
      type: Object,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      icons: {
        'App\\Models\\HotelReservation': [HotelIcon, 'Hotel'],
        'App\\Models\\TourReservation': [TourIcon, 'Tour'],
        'App\\Models\\FlightReservation': [FlightIcon, 'Vuelo'],
        'App\\Models\\CarRentalReservation': [CarRentalIcon, 'Renta de coche'],
        'App\\Models\\PickupReservation': [PickupIcon, 'Transportación'],
      },
    }
  },
}
</script>

<style scoped>

</style>
