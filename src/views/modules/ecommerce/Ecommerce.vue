<template>
  <section id="dashboard-ecommerce">
    <b-row class="match-height">
      <b-col
        xl="4"
        md="6"
      >
        <ecommerce-medal :data="data.congratulations" />
      </b-col>
      <b-col
        xl="8"
        md="6"
      >
        <ecommerce-statistics :data="data.statisticsItems" />
      </b-col>
    </b-row>

    <b-row class="match-height">

      <!-- Goal Overview Card -->
      <b-col
        lg="4"
        md="6"
      >
        <ecommerce-goal-overview :data="data.goalOverview" />
      </b-col>
      <!--/ Goal Overview Card -->

      <!-- Transaction Card -->
      <b-col
        lg="4"
        md="6"
      >
        <ecommerce-transactions :data="data.transactionData" />
      </b-col>
      <!--/ Transaction Card -->
    </b-row>
  </section>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue'

import HotelIcon from '@/assets/images/icons/hotel.png'
import TourIcon from '@/assets/images/icons/tour.png'
import FlightIcon from '@/assets/images/icons/flight.png'
import CarRentalIcon from '@/assets/images/icons/car-rental.png'
import PickupIcon from '@/assets/images/icons/transfer.png'
import EcommerceTransactions from './EcommerceTransactions.vue'
import EcommerceGoalOverview from './EcommerceGoalOverview.vue'
import EcommerceStatistics from './EcommerceStatistics.vue'
import EcommerceMedal from './EcommerceMedal.vue'

export default {
  components: {
    BRow,
    BCol,

    EcommerceMedal,
    EcommerceStatistics,
    EcommerceGoalOverview,
    EcommerceTransactions,
  },
  data() {
    return {
      data: {
        congratulations: {
          name: 'John',
          saleToday: '48900',
        },
        statisticsItems: [
          {
            icon: 'TrendingUpIcon',
            color: 'light-primary',
            title: '200',
            subtitle: 'Reservas',
            customClass: 'mb-2 mb-xl-0',
          },
          {
            icon: 'UserIcon',
            color: 'light-info',
            title: '800',
            subtitle: 'Clientes',
            customClass: 'mb-2 mb-xl-0',
          },
          {
            icon: 'BoxIcon',
            color: 'light-danger',
            title: '$150,000',
            subtitle: 'Total vendido',
            customClass: 'mb-2 mb-sm-0',
          },
          {
            icon: 'DollarSignIcon',
            color: 'light-success',
            title: '$75,000',
            subtitle: 'Revenue',
            customClass: '',
          },
        ],
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
        goalOverview: {
          completed: '786,617',
          inProgress: '13,561',
          series: [83],
        },
        transactionData: [
          {
            mode: 'Hoteles',
            avatar: HotelIcon,
            avatarVariant: 'light-primary',
            payment: '$74',
            deduction: false,
          },
          {
            mode: 'Vuelos',
            avatar: FlightIcon,
            avatarVariant: 'light-primary',
            payment: '$480',
            deduction: false,
          },
          {
            mode: 'Transfers',
            avatar: PickupIcon,
            avatarVariant: 'light-primary',
            payment: '$480',
            deduction: false,
          },
          {
            mode: 'Tours',
            avatar: TourIcon,
            avatarVariant: 'light-primary',
            payment: '$23',
            deduction: false,
          },
          {
            mode: 'Renta de coches',
            avatar: CarRentalIcon,
            avatarVariant: 'light-primary',
            payment: '$98',
            deduction: false,
          },
        ],
      },
    }
  },
  created() {
    // data
    /* this.$http.get('/ecommerce/data')
      .then(response => {
        this.data = response.data

        // ? Your API will return name of logged in user or you might just directly get name of logged in user
        // ? This is just for demo purpose
        const userData = getUserData()
        this.data.congratulations.name = userData.fullName.split(' ')[0] || userData.username
      }) */
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/dashboard-ecommerce.scss';
@import '@core/scss/vue/libs/chart-apex.scss';
</style>
