<template>
  <div>
    <b-modal
      ref="refFormModal"
      title="Descargar reporte en excel"
      ok-title="Descargar"
      cancel-title="Cancelar"
      no-close-on-backdrop
      @ok="download"
    >
      <div class="row">
        <div class="col-12">
          <div
            class="alert alert-primary"
            role="alert"
          >
            <p>Se necesita por lo menos un filtro, se puede hacer cualquier combinación</p>
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-12">
          <h6>Filtro por cliente</h6>
        </div>

        <div class="col-12 col-md-4">
          <div class="form-group">
            <label>Nombre(s)</label>
            <input
              v-model="name"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="form-group">
            <label>Apellido(s)</label>
            <input
              v-model="lastName"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-12 col-md-4">
          <div class="form-group">
            <label>Correo electrónico</label>
            <input
              v-model="email"
              type="text"
              class="form-control"
            >
          </div>
        </div>
      </div>
      <hr>
      <div class="row">
        <div class="col-12">
          <h6>Filtro por reserva</h6>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Booking ID</label>
            <input
              v-model="bookingId"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Confirmación de proveedor</label>
            <input
              v-model="confirmationProvider"
              type="text"
              class="form-control"
            >
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Método de liquidación</label>
            <v-select
              v-model="settlementMethod"
              label="text"
              :clearable="true"
              :options="settlementTypes"
              :reduce="value=>value.type"
              :get-option-label="option=>option.label"
            />
          </div>
        </div>
        <div class="col-12 col-md-3">
          <div class="form-group">
            <label>Método de pago</label>
            <v-select
              v-model="paymentMethod"
              label="text"
              :clearable="true"
              :options="paymentMethods"
              :reduce="value=>value.getAttr('id')"
              :get-option-label="option=>option.getAttr('name')"
            />
          </div>
        </div>
      </div>
      <hr>
    </b-modal>

    <table-component
      ref="tableComponent"
      :model="model"
      :show-form="false"
      url-create-form="/new-reservation"
      url-edit-form="/edit-reservation"
    >
      <template v-slot:actions>
        <b-button
          variant="outline-primary"
          class="btn-icon"
          @click="openModal($event)"
        >
          <feather-icon
            icon="DownloadCloudIcon"
          />
        </b-button>
        <b-dropdown
          text="Más opciones"
          variant="outline-primary"
        >
          <b-dropdown-item
            :variant="showOnlyPaid ? 'primary' : ''"
            @click="showOnlyPaidReservations"
          >
            <feather-icon
              v-if="showOnlyPaid"
              icon="CheckIcon"
            />
            Mostrar reservas con algún servicio liquidadas
          </b-dropdown-item>
          <b-dropdown-item
            :variant="showOnlyNoPaid ? 'primary' : ''"
            @click="showOnlyNoPaidReservations"
          >
            <feather-icon
              v-if="showOnlyNoPaid"
              icon="CheckIcon"
            />
            Mostrar reservas pendientes de liquidación
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </table-component>
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Reservation from '@/dc-it/models/Reservation'
import { BButton, BDropdown, BDropdownItem } from 'bootstrap-vue'
import vSelect from 'vue-select'
import PaymentMethod from '@/dc-it/models/PaymentMethod'
import Model from '@/dc-it/models/Model'
import GeneralService from '../../dc-it/services/GeneralService'

export default {
  name: 'ReservationsView',
  components: {
    TableComponent, BButton, vSelect, BDropdown, BDropdownItem,
  },
  data() {
    return {
      model: Reservation,
      showModal: false,
      name: '',
      lastName: '',
      email: '',
      bookingId: '',
      confirmationProvider: '',
      settlementMethod: '',
      paymentMethod: '',
      settlementTypes: [
        {
          type: 1,
          label: 'Transferencia',
        },
        {
          type: 2,
          label: 'Monedero virtual',
        },
        {
          type: 3,
          label: 'Tarjeta de crédito',
        },
      ],
      paymentMethods: [],
      showOnlyPaid: false,
      showOnlyNoPaid: false,
    }
  },
  mounted() {
    PaymentMethod.where('id', '>', 0).get().then(paymentMethods => {
      this.paymentMethods = paymentMethods
    })
  },
  methods: {
    openModal() {
      this.$refs.refFormModal.show()
    },
    download(e) {
      e.preventDefault()
      const m = new Model()
      if (this.name.trim() !== '') {
        m.where('customer.first_name', '=', this.name)
      }
      if (this.lastName.trim() !== '') {
        m.where('customer.last_name', '=', this.lastName)
      }
      if (this.email.trim() !== '') {
        m.where('customer.email', '=', this.lastName)
      }
      if (this.bookingId.trim() !== '') {
        m.where('booking_id', '=', this.bookingId)
      }
      if (this.confirmationProvider.trim() !== '') {
        m.where('reservation_details.provider_confirmation_number', '=', this.confirmationProvider)
      }
      if (this.settlementMethod) {
        m.where('reservation_details.settlement.settlement_method', '=', this.settlementMethod)
      }
      if (this.paymentMethod) {
        m.where('reservation_payments.payment_method_id', '=', this.paymentMethod)
      }

      GeneralService.getInstance().download('reservations/report', { filter: m.filter }).then(result => {
        const fileName = 'reporte-reservas.xlsx'
        const a = document.createElement('a')
        document.body.appendChild(a)
        // a.setAttribute('style', 'display: none');
        /* const blob = new Blob([result], {
          type: '',
        }) */ // new Blob([response], {type: 'app/xlsx'});
        const url = window.URL.createObjectURL(result)
        a.href = url
        a.download = fileName
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },
    showOnlyPaidReservations() {
      if (this.showOnlyPaid) {
        this.$refs.tableComponent.filterFields = []
        this.$refs.tableComponent.clearFilter()
        this.showOnlyPaid = false
      } else {
        if (this.showOnlyNoPaid) {
          this.showOnlyNoPaid = false
        }
        this.$refs.tableComponent.filterFields = [
          {
            function: 'where',
            operator: '>',
            field: 'reservation_details.settlement.authorization_user_id',
            value: 0,
          },
          {
            function: 'where',
            operator: '=',
            field: 'reservation_details.cancelled_by_id',
            value: null,
          },
        ]
        this.$refs.tableComponent.applyFilter()
        this.showOnlyPaid = true
      }
    },
    showOnlyNoPaidReservations() {
      if (this.showOnlyNoPaid) {
        this.$refs.tableComponent.filterFields = []
        this.$refs.tableComponent.clearFilter()
        this.showOnlyNoPaid = false
      } else {
        if (this.showOnlyPaid) {
          this.showOnlyPaid = false
        }
        this.$refs.tableComponent.filterFields = [
          {
            function: 'whereDoesntHave',
            operator: '>',
            field: 'reservation_details.settlement.authorization_user_id',
            value: 0,
          },
          {
            function: 'where',
            operator: '=',
            field: 'reservation_details.cancelled_by_id',
            value: null,
          },
        ]
        this.$refs.tableComponent.applyFilter()
        this.showOnlyNoPaid = true
      }
    },
  },
}
</script>

<style scoped>

</style>
