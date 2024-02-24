<template>
  <section id="dashboard-ecommerce">
    <b-row
      v-if="!loading"
      class="match-height"
    >
      <!--      <b-col
        xl="4"
        md="6"
      >
        <ecommerce-medal :data="data.congratulations" />
      </b-col>-->
      <b-col
        xl="12"
        md="12"
      >
        <ecommerce-statistics :data="data.statisticsItems" />
      </b-col>
    </b-row>

    <b-row
      v-if="!loading"
      class="match-height"
    >

      <!-- Transaction Card -->
      <b-col
        lg="4"
        md="6"
      >
        <ecommerce-transactions :data="data.transactionData" />
      </b-col>
      <!--/ Transaction Card -->

      <b-col
        lg="4"
        md="6"
      >
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">
              Anuncios generales
            </h4>
          </div>
          <div class="card-body">
            <p class="m-0 text-center">
              Sin anuncios
            </p>
          </div>
        </div>
      </b-col>
    </b-row>

    <b-row v-if="loading">
      <b-col class="text-center">
        <b-spinner label="Loading..." />
      </b-col>
    </b-row>
  </section>
</template>

<script>
import { BCol, BRow, BSpinner } from 'bootstrap-vue'
import EcommerceStatistics from '@/views/modules/ecommerce/EcommerceStatistics.vue'
import EcommerceTransactions from '@/views/modules/ecommerce/EcommerceTransactions.vue'
import HotelIcon from '@/assets/images/icons/hotel.png'
import FlightIcon from '@/assets/images/icons/flight.png'
import PickupIcon from '@/assets/images/icons/transfer.png'
import TourIcon from '@/assets/images/icons/tour.png'
import CarRentalIcon from '@/assets/images/icons/car-rental.png'
import GeneralService from '@/dc-it/services/GeneralService'
import helpers from '@/dc-it/services/helpers'

export default {
  name: 'DashboardView',
  components: {
    BRow,
    BCol,
    BSpinner,

    EcommerceStatistics,
    EcommerceTransactions,
  },
  data() {
    return {
      data: {
        congratulations: {
          name: 'John',
          saleToday: '48900',
        },
        statisticsItems: [],
        statisticsOrder: {
          series: [
            {
              name: '2020',
              data: [45, 85, 65, 45, 65],
            },
          ],
        },
        statisticsProfit: {
          series: [
            {
              data: [0, 20, 5, 30, 15, 45],
            },
          ],
        },
        earningsChart: {
          series: [53, 16, 31],
        },
        revenue: {
          years: ['2020', '2019', '2018'],
          price: '25,852',
          budget: '56,800',
          revenueReport: {
            series: [
              {
                name: 'Earning',
                data: [95, 177, 284, 256, 105, 63, 168, 218, 72],
              },
              {
                name: 'Expense',
                data: [-145, -80, -60, -180, -100, -60, -85, -75, -100],
              },
            ],
          },
          budgetChart: {
            series: [
              {
                data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62],
              },
              {
                data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27],
              },
            ],
          },
        },
        transactionData: [],
      },
      loading: true,
    }
  },
  created() {
    GeneralService.getInstance().all('dashboard/info').then(response => {
      if (response.result === 'success') {
        this.data.statisticsItems = [
          {
            icon: 'TrendingUpIcon',
            color: 'light-primary',
            title: response.month_reservations,
            subtitle: 'Reservas',
            customClass: 'mb-2 mb-xl-0',
          },
          {
            icon: 'UserIcon',
            color: 'light-info',
            title: response.month_new_customers,
            subtitle: 'Clientes',
            customClass: 'mb-2 mb-xl-0',
          },
          {
            icon: 'BoxIcon',
            color: 'light-danger',
            title: `$${helpers.numberFormat(response.month_sales)}`,
            subtitle: 'Total vendido',
            customClass: 'mb-2 mb-sm-0',
          },
          {
            icon: 'DollarSignIcon',
            color: 'light-success',
            title: `$${helpers.numberFormat(response.month_profit)}`,
            subtitle: 'Revenue',
            customClass: '',
          },
        ]
        this.data.transactionData = [

          {
            mode: 'Hoteles',
            avatar: HotelIcon,
            avatarVariant: 'light-primary',
            payment: response.reservation_service_types.HotelReservation,
            deduction: false,
          },
          {
            mode: 'Vuelos',
            avatar: FlightIcon,
            avatarVariant: 'light-primary',
            payment: response.reservation_service_types.FlightReservation,
            deduction: false,
          },
          {
            mode: 'Transfers',
            avatar: PickupIcon,
            avatarVariant: 'light-primary',
            payment: response.reservation_service_types.PickupReservation,
            deduction: false,
          },
          {
            mode: 'Tours',
            avatar: TourIcon,
            avatarVariant: 'light-primary',
            payment: response.reservation_service_types.TourReservation,
            deduction: false,
          },
          {
            mode: 'Renta de coches',
            avatar: CarRentalIcon,
            avatarVariant: 'light-primary',
            payment: response.reservation_service_types.CarRentalReservation,
            deduction: false,
          },

        ]
      }

      this.loading = false
    })
  },
}
</script>

<style scoped>

</style>
