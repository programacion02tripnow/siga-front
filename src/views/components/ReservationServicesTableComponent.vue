<template>
  <b-table class="position-relative" :items="services" responsive :fields="columns" primary-key="id" show-empty
    empty-text="No se han agregado servicios" :tbody-tr-class="rowClass">
    <template #cell(service)="data">
      <b-media vertical-align="center" :class="{ cancelled: !!data.item.cancelled_at }">
        <template #aside>
          <b-img :src="icons[data.item.reservable_type]" blank-color="#ccc" width="40" alt="placeholder" />
        </template>

        <div v-if="data.item.reservable_type === 'App\\Models\\HotelReservation'">
          <h6 class="media-heading">
            Hotel: {{ data.item.reservable.hotel_name }}
          </h6>
          <b-card-text class="mb-0">
            <p class="m-0">
              {{ data.item.reservable.hotel_reservation_rooms.length }} Habitaciones
            </p>
            <p class="m-0">
              {{ data.item.reservable.adults_quantity }} Adultos, {{ data.item.reservable.minors_quantity }}
              Menores
            </p>
          </b-card-text>
        </div>

        <div v-if="data.item.reservable_type === 'App\\Models\\FlightReservation'">
          <h6 class="media-heading">
            Aerolínea: {{ data.item.reservable.airline }}
          </h6>
          <b-card-text class="mb-0">
            <p class="m-0">
              Cantidad de vuelos:
            </p>
            <p class="font-weight-bolder m-0">
              {{ data.item.reservable.flight_reservation_flights.length }}
            </p>
            <p class="m-0">
              {{ data.item.reservable.adults_quantity }} Adultos, {{ data.item.reservable.minors_quantity }}
              Menores
            </p>
          </b-card-text>
        </div>

        <div v-if="data.item.reservable_type === 'App\\Models\\TourReservation'">
          <h6 class="media-heading">
            Tour: {{ data.item.reservable.tour_name }}
          </h6>
          <b-card-text class="mb-0">
            <p v-if="data.item.reservable.package_name" class="m-0">
              Paquete:
            </p>
            <p v-if="data.item.reservable.package_name" class="m-0 font-weight-bolder">
              {{ data.item.reservable.package_name }}
            </p>
            <p class="m-0">
              {{ data.item.reservable.adults_quantity }} Adultos, {{ data.item.reservable.minors_quantity }}
              Menores
            </p>
          </b-card-text>
        </div>

        <div v-if="data.item.reservable_type === 'App\\Models\\PickupReservation'">
          <b-card-text class="mb-0">
            <p class="m-0">
              Meeting Point:
            </p>
            <p class="m-0 font-weight-bolder">
              {{ data.item.reservable.pickup }}
            </p>
            <p class="m-0">
              Tipo de vehículo:
            </p>
            <p class="m-0 font-weight-bolder">
              {{ data.item.reservable.transportation_type }}
            </p>
            <p class="m-0">
              {{ data.item.reservable.adults_quantity }} Adultos, {{ data.item.reservable.minors_quantity }}
              Menores
            </p>
          </b-card-text>
        </div>

        <div v-if="data.item.reservable_type === 'App\\Models\\CarRentalReservation'">
          <b-card-text class="mb-0">
            <p class="m-0">
              Entrega:
            </p>
            <p class="font-weight-bolder m-0">
              {{ data.item.reservable.pickup }}, {{ dateFormat(data.item.reservable.datetime_pickup) }}
            </p>
            <p class="m-0">
              Devolución:
            </p>
            <p class="font-weight-bolder m-0">
              {{ data.item.reservable.return }}, {{ dateFormat(data.item.reservable.return_datetime) }}
            </p>
          </b-card-text>
        </div>

      </b-media>
    </template>

    <template #cell(additional)="data">
      <div v-if="data.item.reservable_type === 'App\\Models\\HotelReservation'"
        :class="{ cancelled: !!data.item.cancelled_at }">
        <p class="m-0">
          Check In:
        </p>
        <p class="font-weight-bolder m-0">
          {{ dateFormat(data.item.reservable.check_in, false) }}
        </p>
        <p class="m-0">
          Check out:
        </p>
        <p class="font-weight-bolder m-0">
          {{ dateFormat(data.item.reservable.check_out, false) }}
        </p>
      </div>

      <div v-if="data.item.reservable_type === 'App\\Models\\FlightReservation'"
        :class="{ cancelled: !!data.item.cancelled_at }">
        <p class="m-0">
          PNR:
        </p>
        <p class="font-weight-bolder m-0">
          {{ data.item.reservable.PNR }}
        </p>
      </div>

      <div v-if="data.item.reservable_type === 'App\\Models\\TourReservation'"
        :class="{ cancelled: !!data.item.cancelled_at }">
        <p class="m-0">
          Fecha:
        </p>
        <p class="font-weight-bolder m-0">
          {{ dateFormat(data.item.reservable.date, false) }}
        </p>
      </div>

      <div v-if="data.item.reservable_type === 'App\\Models\\PickupReservation'"
        :class="{ cancelled: !!data.item.cancelled_at }">
        <p class="m-0">
          Fecha/Hora:
        </p>
        <p class="font-weight-bolder m-0">
          {{ dateFormat(data.item.reservable.datetime, true) }}
        </p>
      </div>

      <div v-if="data.item.reservable_type === 'App\\Models\\CarRentalReservation'"
        :class="{ cancelled: !!data.item.cancelled_at }">
        <p class="m-0">
          Tipo de vehículo:
        </p>
        <p class="font-weight-bolder m-0">
          {{ data.item.reservable.car_category }}
        </p>
        <p class="m-0">
          Agencia:
        </p>
        <p class="font-weight-bolder m-0">
          {{ data.item.reservable.agency_name }}
        </p>
      </div>

    </template>

    <template #cell(prices)="data">
      <p class="m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        Público:
      </p>
      <p class="font-weight-bolder m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        ${{ numberFormat(data.item.public_price) }}
      </p>
      <p class="m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        Neto:
      </p>
      <p class="font-weight-bolder m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        ${{ numberFormat(data.item.net_price) }}
      </p>
      <p class="m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        Servicio:
      </p>
      <p class="font-weight-bolder m-0" :class="{ cancelled: !!data.item.cancelled_at }">
        ${{ numberFormat(data.item.added_price) }}
      </p>
      <div
        v-if="['App\\Models\\HotelReservation', 'App\\Models\\FlightReservation'].indexOf(data.item.reservable_type) !== -1">
        <b-badge v-if="data.item.reservable.is_pack" variant="info">
          Paquete
        </b-badge>
      </div>

    </template>

    <template #cell(actions)="data">
      <b-button-group v-if="data.item.cancelled_at === null">
        <a v-if="data.item.multimedia && !!data.item.multimedia.id" v-b-tooltip.hover
          :href="data.item.multimedia.file_url" target="_blank" class="btn btn-secondary"
          title="Ver voucher del proveedor">
          <feather-icon icon="EyeIcon" size="20" />
        </a>
        <b-button v-b-tooltip.hover variant="warning"
          :disabled="(data.item.id && !data.item.editable) || !!data.item.settlement" title="Editar servicio"
          @click="editClick(data)">
          <feather-icon icon="Edit2Icon" size="20" />
        </b-button>
        <b-button v-b-tooltip.hover variant="danger" :disabled="false"
          :title="data.item.id ? 'Cancelar servicio' : 'Eliminar servicio'" @click="deleteClick(data)">
          <feather-icon icon="XCircleIcon" size="20" />
        </b-button>

        <b-button v-if="!data.item.settlement || !data.item.settlement.authorization_date" v-b-tooltip.hover
          variant="success" :disabled="(!data.item.id)"
          :title="!data.item.settlement ? 'Liquidar' : 'Confirmar liquidación'" @click="settlementClick(data)">
          <feather-icon icon="DollarSignIcon" size="20" />
        </b-button>

        <b-button v-b-tooltip.hover variant="info" :disabled="(!data.item.id)"
          :title="data.item.invoiced.toString() === '1' ? 'Facturado' : 'Marcar como facturado'"
          @click="markAsInvoiced(data)">
          <feather-icon icon="FileTextIcon" size="20" />
        </b-button>
      </b-button-group>

      <div v-if="data.item.settlement && data.item.settlement.authorization_date" class="mt-2">
        <p class="m-0 font-weight-bolder">
          Servicio liquidado
        </p>
        <p class="m-0">
          Autorizó: {{ data.item.settlement.authorization_user.username }}
        </p>
        <p class="m-0">
          Fecha: {{ data.item.settlement.authorization_date }}
        </p>
        <p class="m-0">
          Método de liquidación: {{ getSettlementMethodLabel(data.item.settlement.settlement_method) }}
        </p>
        <p v-if="data.item.settlement.settlement_method.toString() === '3'" class="m-0">
          Tarjeta: {{ (data.item.settlement.last4) }}
        </p>
      </div>

      <div v-if="data.item.settlement && !data.item.settlement.authorization_date" class="mt-2">
        <p class="m-0 font-weight-bolder">
          Liquidación solicitada
        </p>
        <p class="m-0">
          Solicitó: {{ data.item.settlement.user.username }}
        </p>
        <p class="m-0">
          Fecha: {{ data.item.settlement.date }}
        </p>
        <p class="m-0">
          Método de liquidación: {{ getSettlementMethodLabel(data.item.settlement.settlement_method) }}
        </p>
      </div>

      <div v-if="data.item.cancelled_at">
        <p class="m-0" style="color:white;">
          Cancelado el
        </p>
        <p class="font-weight-bolder m-0" style="color:white; font-weight: bolder;">
          {{ dateFormat(data.item.cancelled_at) }}
        </p>

        <p class="m-0" style="color:white;">
          Cancelado por
        </p>
        <p class="font-weight-bolder m-0" style="color:white; font-weight: bolder;">
          {{ (data.item.cancelled_by.username) }}
        </p>
      </div>
    </template>

  </b-table>
</template>
<script>

import {
  BTable, BMedia, BImg, BCardText, BButton, BButtonGroup, VBTooltip, BBadge,
} from 'bootstrap-vue'
import HotelIcon from '@/assets/images/icons/hotel.png'
import TourIcon from '@/assets/images/icons/tour.png'
import FlightIcon from '@/assets/images/icons/flight.png'
import CarRentalIcon from '@/assets/images/icons/car-rental.png'
import PickupIcon from '@/assets/images/icons/transfer.png'
import helpers from '@/dc-it/services/helpers'

export default {
  name: 'ReservationServicesTableComponent',
  components: {
    BTable,
    BMedia,
    BImg,
    BCardText,
    BButton,
    BButtonGroup,
    BBadge,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  props: {
    services: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    columns: [
      { key: 'service', label: 'Servicio' },
      { key: 'additional', label: 'Información adicional' },
      { key: 'prices', label: 'Precios' },
      { key: 'actions', label: 'Acciones' },
    ],
    icons: {
      // eslint-disable-next-line global-require
      'App\\Models\\HotelReservation': HotelIcon,
      'App\\Models\\TourReservation': TourIcon,
      'App\\Models\\FlightReservation': FlightIcon,
      'App\\Models\\CarRentalReservation': CarRentalIcon,
      'App\\Models\\PickupReservation': PickupIcon,
    },
  }),
  methods: {
    getSettlementMethodLabel(settlementMethod) {
      // 1=> Transferencia, 2=>Monedero, 3=>Tarjeta de crédito
      switch (settlementMethod.toString()) {
        case '1':
          return 'Transferencia'
        case '2':
          return 'Monedero'
        case '3':
          return 'Tarjeta de crédito'
        default:
          return ''
      }
    },
    numberFormat(number) {
      const tmp = parseFloat(number)
      const val = (tmp).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    editClick(item) {
      this.$emit('onEdit', item.index)
    },
    deleteClick(item) {
      this.$emit('onDelete', item.index)
    },
    settlementClick(item) {
      this.$emit('onSettlement', item.index)
    },
    markAsInvoiced(item) {
      if (item.item.invoiced.toString() === '0') {
        this.$emit('invoiced', item.index)
      }
    },
    dateFormat(date, time) {
      return helpers.dateFormat(new Date(date), time)
    },
    rowClass(item, type) {
      if (!item || type !== 'row') {
        return ''
      }
      if (item.cancelled_at) {
        return 'row-cancelled'
      }

      return ''
    },
  },
}
</script>

<style>
.row-cancelled {
  background: #ea545594;
}

.cancelled {
  text-decoration: line-through;
}
</style>
