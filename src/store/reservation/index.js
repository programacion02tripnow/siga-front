import HotelServiceModal from '@/views/components/modals/HotelServiceModal.vue'
import FlightServiceModal from '@/views/components/modals/FlightServiceModal.vue'
import TourServiceModal from '@/views/components/modals/TourServiceModal.vue'
import CarRentalServiceModal from '@/views/components/modals/CarRentalServiceModal.vue'
import PickupServiceModal from '@/views/components/modals/PickupServiceModal.vue'

export default {
  namespaced: true,
  state: {
    servicesTypesMap: [
      {
        text: 'Hotel',
        class: 'App\\Models\\HotelReservation',
        value: HotelServiceModal,
      },
      {
        text: 'Vuelo',
        class: 'App\\Models\\FlightReservation',
        value: FlightServiceModal,
      },
      // {
      //   text: 'Tour',
      //   class: 'App\\Models\\TourReservation',
      //   value: TourServiceModal,
      // },
      // {
      //   text: 'Renta de coche',
      //   class: 'App\\Models\\CarRentalReservation',
      //   value: CarRentalServiceModal,
      // },

      // {
      //   text: 'Traslado',
      //   class: 'App\\Models\\PickupReservation',
      //   value: PickupServiceModal,
      // },
    ],
  },
  getters: {},
  actions: {},
}
