<template>
  <div>
    <div v-if="reservation.id" class="d-flex">
      <b-badge pill variant="info" class="mb-2 mr-2" style="font-size: 14px;font-weight: bolder">
        {{ reservation.booking_id }}
      </b-badge>

      <b-badge pill :variant="statusPillVariant" class="mb-2" style="font-size: 14px;font-weight: bolder">
        {{ statusPillText }}
      </b-badge>
    </div>

    <section class="invoice-preview-wrapper">
      <!-- modal para formulario de customer !-->
      <b-modal id="mdlFormCustomer" title="Crear cliente" hide-footer no-enforce-focus>
        <div v-if="customerModel">
          <form-component :model="customerModel" @cancel-form="closeCustomerFormModal"
            @save-form="saveCustomerFormModal" />
        </div>
      </b-modal>

      <!-- modal para formulario de cada servicio !-->
      <component :is="addServiceModal" v-if="addServiceModal" ref="serviceModalComponent" :users="users"
        :providers="providers" :reservation-detail-param="reservationDetailSelected" :is-pack="isPack"
        @save="addServiceSave" @close="cancelServiceModal" @cancel-modal="cancelServiceModalPack"
        @onCommentSaved="initData" />

      <!-- modal para selector de servicio !-->
      <select-service-type-modal ref="selectServiceTypeModal" @onSelect="addServiceSelected" />

      <!-- modal para agregar/editar pago nuevo !-->
      <payment-method-form-modal ref="paymentMethodFormModal" :payment-methods="paymentMethods" :max-amount="saldo"
        :amount="paymentDateSelected ? paymentDateSelected.amount : reservation.with_payments ? 0 : reservation.public_price"
        @save="savePaymentModal" @close="closePaymentMethodFormModal" :wallet="totalWallet" />

      <!-- modal para agregar/editar payment dates !-->
      <reservation-payment-date-form-modal v-if="reservation.with_payments" ref="reservationPaymentDateFormModal"
        :max-amount="maxScheduled" :payment-date="paymentDateSelected" :total-scheduled="totalScheduled"
        @save="savePaymentDateFormModal" @close="closePaymentMethodFormModal" />

      <!-- modal para agregar settlement !-->
      <settlement-form-modal v-if="reservationDetailSelected" ref="settlementFormModal"
        :reservation-detail="reservationDetailSelected" @close="onCloseSettlementForm" @save="saveSettlement" />
      <!--
      sidebar de historial
      !-->
      <reservation-history-modal v-if="reservation.id" v-model="showHistory" :reservation-id="reservation.id"
        @showVersion="showVersion" />
      <reservation-comments-modal v-if="reservation.id" v-model="showComments" :reservation-id="reservation.id" />

      <b-overlay :show="showOverlay">
        <b-row v-if="!loading" class="invoice-preview">
          <b-col cols="12" xl="9" md="8">
            <b-card no-body class="invoice-preview-card">
              <b-card-body class="invoice-padding pb-0">
                <!-- Cliente !-->
                <div class="form-group">
                  <label class=" mr-1">Cliente:</label>

                  <b-input-group>
                    <div class="form-control p-0">
                      <v-select v-model="reservation.customer_id" @input="handleSelect" class="customer-select"
                        label="text" :clearable="false" :options="customers" :reduce="value => value.getAttr('id')"
                        :get-option-label="option => option.getNameWithEmail()" :disabled="!!reservation.id" />
                    </div>
                    <b-input-group-append>
                      <b-button variant="primary" @click="openCustomerFormModal" :disabled="!!reservation.id">
                        <feather-icon icon="PlusIcon" />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>

                  <!--            <input
                      id="client-name"
                      type="text"
                      name="client-name"
                      class="form-control"
                    >-->
                </div>

                <hr>

                <!-- servicios !-->
                <div v-show="reservation.customer_id">
                  <h3 class="mr-2">
                    Servicios
                  </h3>
                  <div class="btn-group">
                    <button v-for="service in serviceTypes" class="btn btn-primary" @click="addServiceSelected(service)">
                      <feather-icon icon="PlusIcon" />
                      Agregar {{ service.text }}
                    </button>
                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-12">
                    <reservation-services-table-component :services="reservation.reservation_details"
                      @onEdit="editService" @onDelete="deleteService" @onSettlement="openSettlementForm"
                      @invoiced="markAsInvoiced" />
                  </div>
                </div>

                <hr>

                <div class="d-none align-items-center">
                  <h3 class="mr-2">
                    Pagos programados
                  </h3>
                  <div class="btn-group">
                    <button class="btn btn-primary" :disabled="maxScheduled <= 0" @click="openPaymentDateFormModal()">
                      <feather-icon icon="PlusIcon" />
                      Programar pago
                    </button>
                  </div>
                </div>

                <div class="d-none row mt-2">
                  <div class="col-12">
                    <reservation-payment-dates-list-table-component :payment-dates="reservation.reservation_payment_dates"
                      :saldo="saldo" @onEdit="editPaymentDate" @onDelete="deletePaymentDate" @onPay="payPaymentDate" />
                  </div>
                </div>


                <!-- pagos !-->
                <div v-if="reservation.id">
                  <hr v-if="reservation.with_payments">

                  <div class="d-flex align-items-center">
                    <h3 class="mr-2">
                      Pagos realizados
                    </h3>
                    <div class="btn-group">
                      <button class="btn btn-primary" @click="openPaymentMethodFormModal()" :disabled="saldo <= 0">
                        <feather-icon icon="PlusIcon" />
                        Agregar pago
                      </button>
                    </div>
                  </div>

                  <div class="row mt-2">
                    <div class="col-12">
                      <reservation-payments-list-table-component :payment-methods="paymentMethods"
                        :payments="reservation.reservation_payments" />
                    </div>
                  </div>
                </div>
              </b-card-body>
            </b-card>
          </b-col>

          <b-col cols="12" md="4" xl="3" class="invoice-actions">

            <b-card v-if="reservation.user" class="invoice-preview-card" title="Agente creador">
              <b-card-body class="p-0">
                <div v-if="!editCreatedUser">
                  <div class="d-flex w-100 overflow-hidden">
                    <user-info-component :value="reservation.user" :model="reservation" />
                  </div>
                </div>
              </b-card-body>
            </b-card>

            <b-card v-if="reservation.edited_by" class="invoice-preview-card" title="Agente editor">
              <b-card-body class="p-0">
                <div>
                  <user-info-component :value="reservation.edited_by" :model="reservation" />
                </div>

              </b-card-body>
            </b-card>

            <b-card title="Totales">
              <b-row><!-- Col: Total -->
                <b-col>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Total público:</span>
                    <b>$ {{ numberFormat(reservation.public_price) }}</b>
                  </div>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Total neto:</span>
                    <b>$ {{ numberFormat(reservation.net_price) }}</b>
                  </div>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Total agregado:</span>
                    <b>$ {{ numberFormat(reservation.added_price) }}</b>
                  </div>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Utilidad:</span>
                    <b>$ {{ numberFormat(totalUtility) }}</b>
                  </div>

                  <hr>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Total pagado:</span>
                    <b>$ {{ numberFormat(totalPaid) }}</b>
                  </div>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Saldo:</span>
                    <b>$ {{ numberFormat(saldo) }}</b>
                  </div>
                </b-col>
              </b-row>
            </b-card>

            <b-card title="Wallet" v-if="totalWallet > 0">
              <b-row><!-- Col: Total -->
                <b-col>
                  <div class="m-0 d-flex justify-content-between">
                    <span>Total en wallet:</span>
                    <b>$ {{ numberFormat(totalWallet) }}</b>
                  </div>
                </b-col>
              </b-row>
            </b-card>

            <b-card v-if="reservation.id">

              <div class="d-none justify-content-between align-items-center my-1">
                <label>Reserva ahora paga después</label>
                <b-form-checkbox v-model="reservation.with_payments" switch />
              </div>

              <!-- Button: Send Invoice -->
              <b-button variant="primary" class="mb-75 d-none" block @click="save">
                Guardar
              </b-button>

              <!-- Button: DOwnload -->
              <b-button variant="danger" class="mb-75 d-none" block @click="$router.replace('/reservations')">
                Cancelar edición
              </b-button>

              <b-button v-if="reservation.id" variant="success" class="mb-75" block @click="showComments = true">
                Comentarios
              </b-button>

              <b-button v-if="reservation.id" variant="secondary" class="mb-75" block @click="showHistory = true">
                Historial
              </b-button>

              <b-button v-if="historyViewing" variant="secondary" class="mb-75" block @click="returnCurrentVersion">
                Regresar a versión actual
              </b-button>

            </b-card>

          </b-col>
        </b-row>
      </b-overlay>

      <div v-if="loading">
        <div class="align-items-center d-flex justify-content-center">
          <b-spinner class="mr-1" variant="primary" />
        </div>
      </div>

    </section>
  </div>
</template>

<script>

import SelectServiceTypeModal from '@/views/components/modals/SelectServiceTypeModal.vue'
import Provider from '@/dc-it/models/Provider'
import {
  BInputGroup,
  BInputGroupAppend,
  BFormInput,
  BButton,
  BSpinner,
  BFormCheckbox,
  BRow,
  BCol,
  BCard,
  BCardBody,
  BOverlay,
  BBadge,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Customer from '@/dc-it/models/Customer'
import FormComponent from '@/dc-it/components/FormComponent.vue'
import ReservationServicesTableComponent from '@/views/components/ReservationServicesTableComponent.vue'
import PaymentMethod from '@/dc-it/models/PaymentMethod'
import PaymentMethodFormModal from '@/views/components/modals/PaymentMethodFormModal.vue'
import ReservationPaymentsListTableComponent from '@/views/components/ReservationPaymentsListTableComponent.vue'
import GeneralService from '@/dc-it/services/GeneralService'
import ReservationPaymentDateFormModal from '@/views/components/modals/ReservationPaymentDateFormModal.vue'
import ReservationPaymentDatesListTableComponent from '@/views/components/ReservationPaymentDatesListTableComponent.vue'
import ReservationHistoryModal from '@/views/components/modals/ReservationHistoryModal.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import SettlementFormModal from '@/views/components/modals/SettlementFormModal.vue'
import ReservationCommentsModal from '@/views/components/modals/ReservationCommentsModal.vue'
import UserInfoComponent from '@/views/components/UserInfoComponent.vue'
import User from '@/dc-it/models/User'

export default {
  name: 'NewReservationView',

  components: {
    ReservationCommentsModal,
    SettlementFormModal,
    ReservationHistoryModal,
    ReservationPaymentDatesListTableComponent,
    ReservationPaymentDateFormModal,
    ReservationPaymentsListTableComponent,
    PaymentMethodFormModal,
    SelectServiceTypeModal,
    UserInfoComponent,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BButton,
    vSelect,
    BSpinner,
    FormComponent,
    ReservationServicesTableComponent,
    BFormCheckbox,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BOverlay,
    BBadge,
  },
  data: () => ({
    addServiceModal: null,
    customerModel: new Customer(),
    loading: false,
    showOverlay: false,
    providers: [],
    allProviders: [],
    customers: [],
    paymentMethods: [],
    totalPaid: 0,
    totalWallet: 0,
    saldo: 0,
    totalScheduled: 0,
    maxScheduled: 0,
    showHistory: false,
    showComments: false,
    statuses: [
      { value: 1, text: 'Pendiente de pago' },
      { value: 2, text: 'Confirmado/Pagado' },
    ],
    serviceTypes: [],
    reservationDetailSelected: null,
    reservationDetailIndex: null,
    paymentDateSelected: null,
    paymentDateIndex: null,
    reservationCopy: null,
    historyViewing: false,
    editCreatedUser: false,
    reservation: {
      id: null,
      customer_id: null,
      user_id: null,
      editable: false,
      cancelable: false,
      with_payments: false,
      paid_to_provider: false,
      public_price: 0,
      net_price: 0,
      added_price: 0,
      status: 1,
      reservation_details: [],
      reservation_payments: [],
      reservation_payment_dates: [],
      reservation_comments: [],
      user: null,
      edited_by: null,
    },
    users: [],
    isPack: false,
  }),
  computed: {
    statusPillVariant() {
      switch (this.reservation.status.toString()) {
        case '0':
          return 'danger'
        case '1':
          return 'warning'
        case 3:
          return 'success'
        default:
          return 'info'
      }
    },
    statusPillText() {
      switch (this.reservation.status.toString()) {
        case '0':
          return 'Cancelado'
        case '1':
          return 'Pendiente de pago'
        case 3:
          return 'Confirmado/Pagado'
        default:
          return 'Desconocido'
      }
    },

    payments() {
      const totalPaid = this.reservation.reservation_payments.reduce((accum, payment) => {
        return accum += payment.amount
      }, 0)

      return totalPaid
    },


    totalWithService() {
      return this.reservation.public_price + this.reservation.added_price
      return (this.reservation.public_price + this.reservation.added_price) - this.reservation.net_price
    },

    totalUtility() {
      return this.totalWithService - this.reservation.net_price
    }
  },
  mounted() {
    this.initData()
    console.log(this.reservation.reservation_payments)
    /* Provider.get().then(providers => {
      this.providers = providers
    }) */
  },

  methods: {
    handleSelect(value) {
      console.log(value)
    },
    initData() {
      this.loading = true
      this.serviceTypes = this.$store.state.reservation.servicesTypesMap
      const promises = [Provider.get(), Customer.get(), PaymentMethod.get(), User.get()]
      if (this.$route.params.id) {
        promises.push(GeneralService.getInstance().all(`reservations/get-form-info/${this.$route.params.id}`))
      }
      Promise.all(promises).then(result => {
        [this.allProviders, this.customers, this.paymentMethods, this.users] = result
        if (this.$route.params.id) {
          this.reservation = result[result.length - 1].data
        }

        this.calcTotal()
        this.loading = false
        this.showOverlay = false

        console.log(this.users)
        if (this.totalWallet > 0) {
          const pm = new PaymentMethod()
          pm.setAttr('id', 0)
          pm.setAttr('name', 'Monedero de cliente')
          pm.setAttr('payment_method_additional_fields', [{
            id: 0,
            name: 'Código de monedero',
            is_required: 0,
            type: 1,
          }])

          this.paymentMethods.push(pm)
        }
      })
    },
    addServiceClick() {
      this.$refs.selectServiceTypeModal.show()
    },
    addServiceSelected(modal) {
      this.addServiceModal = modal.value
      let attr = ''
      // eslint-disable-next-line default-case
      switch (modal.text) {
        case 'Hotel':
          attr = 'has_hotels'
          break
        case 'Tour':
          attr = 'has_tours'
          break
        case 'Vuelo':
          attr = 'has_flights'
          break
        case 'Renta de coche':
          attr = 'has_car_rentals'
          break
        case 'Traslado':
          attr = 'has_pickups'
          break
      }

      this.providers = this.allProviders.filter(provider => provider.getAttr(attr).toString() === 'Si')

      this.$nextTick(() => {
        this.$refs.serviceModalComponent.show()
      })
    },
    addServiceSave(reservationDetail) {
      this.loading = true
      let isPack = false
      this.$nextTick(() => {
        if (this.reservationDetailIndex !== null) {
          this.reservation.reservation_details[this.reservationDetailIndex] = reservationDetail
        } else {
          this.reservation.reservation_details.push(reservationDetail)
          if (reservationDetail.reservable.is_pack) {
            if (!this.isPack) { // Se agregó un hotel como paquete
              isPack = true
              this.isPack = true
              this.addServiceSelected(this.$store.state.reservation.servicesTypesMap[1])
            } else { // Se guardó el vuelo del paquete
              this.isPack = false
            }
          }
        }

        this.reservation.user_id = reservationDetail.user_id
        this.calcTotal()
        // if (!isPack && this.reservation.id)
        {
          this.save()
        }
        this.loading = false
      })
      this.$forceUpdate()
      /* this.addServiceModal = null
      this.reservationDetailSelected = null
      this.reservationDetailIndex = null */
    },
    cancelServiceModal() {
      this.addServiceModal = null
      this.reservationDetailSelected = null
      this.reservationDetailIndex = null
    },
    cancelServiceModalPack() {
      if (this.isPack) {
        this.reservation.reservation_details.splice(this.reservation.reservation_details.length - 1, 1)
        this.isPack = false
      }
    },
    calcTotal() {
      let publicPrice = 0
      let netPrice = 0
      let addedPrice = 0
      this.reservation.reservation_details.forEach(reservationDetail => {
        if (reservationDetail.cancelled_at === null) {
          publicPrice += parseFloat(reservationDetail.public_price)
          netPrice += parseFloat(reservationDetail.net_price)
          addedPrice += parseFloat(reservationDetail.added_price)
        }
      })

      this.reservation.public_price = publicPrice
      this.reservation.net_price = netPrice
      this.reservation.added_price = addedPrice

      this.totalPaid = 0
      this.reservation.reservation_payments.forEach(payment => {
        this.totalPaid += parseFloat(payment.amount)
      })

      if (this.reservation.id) {
        this.totalWallet = this.reservation.customer.wallet


        // this.reservation.customer.customer_wallets.forEach(wallet => {
        //   this.totalWallet += parseFloat(wallet.amount)
        // })
      }

      this.saldo = this.totalWithService - this.totalPaid

      if (this.saldo === 0) {
        this.reservation.status = 2
      }

      this.totalScheduled = 0
      this.reservation.reservation_payment_dates.forEach(payment => {
        if (!payment.reservation_payment) {
          this.totalScheduled += payment.amount
        }
      })
      this.maxScheduled = this.saldo - this.totalScheduled
    },
    openCustomerFormModal() {
      this.$bvModal.show('mdlFormCustomer')
    },
    closeCustomerFormModal() {
      this.$bvModal.hide('mdlFormCustomer')
      this.customerModel = new Customer()
    },
    saveCustomerFormModal(customer) {
      const c = new Customer()
      c.initValues(customer)
      this.customers.push(c)
      this.reservation.customer_id = c.getAttr('id')
      this.closeCustomerFormModal()
    },
    openPaymentMethodFormModal() {
      this.$refs.paymentMethodFormModal.show()
    },
    closePaymentMethodFormModal() {
      this.paymentDateIndex = null
      this.paymentDateSelected = null
    },
    savePaymentModal(payment) {
      if (this.reservation.id) {
        if (this.paymentDateSelected) {
          // eslint-disable-next-line no-param-reassign
          payment.payment_date_id = this.paymentDateSelected.id
        }
        // eslint-disable-next-line no-param-reassign
        payment.reservation_id = this.reservation.id
        this.showOverlay = true
        GeneralService.getInstance().save('reservation_payments', payment).then(() => {
          this.initData()
          this.showOverlay = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Éxito',
              icon: 'CheckIcon',
              text: 'Se guardó correctamente el pago',
              variant: 'success',
            },
          })
        })
      } else {
        this.reservation.reservation_payments.push(payment)
        this.calcTotal()
        this.save()
      }
    },
    openPaymentDateFormModal() {
      this.paymentDateIndex = null
      this.paymentDateSelected = null
      this.$refs.reservationPaymentDateFormModal.show()
    },
    savePaymentDateFormModal(paymentDate) {
      this.loading = true
      this.$nextTick(() => {
        if (this.paymentDateIndex !== null) {
          this.reservation.reservation_payment_dates[this.paymentDateIndex] = Object.assign(this.paymentDateSelected, paymentDate)
        } else {
          this.reservation.reservation_payment_dates.push(paymentDate)
        }
        this.calcTotal()
        this.loading = false
      })
    },
    numberFormat(number) {
      const tmp = parseFloat(number)
      const val = (tmp).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
    save() {
      if (!this.reservation.customer_id) {
        this.showError('Seleccione un cliente')
        return
      }
      if (this.reservation.reservation_details.length === 0) {
        this.showError('Agregue por lo menos un servicio a la reserva')
        return
      }
      if (this.reservation.with_payments && this.reservation.reservation_payment_dates.length === 0) {
        this.showError('Agregue por lo menos una fecha de pago a la reserva')
        return
      }

      this.showOverlay = true
      GeneralService.getInstance().save('reservations', this.reservation).then(response => {
        if (response.result === 'success') {
          // this.$router.replace('/reservations')
          this.showOverlay = false
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Éxito',
              icon: 'CheckIcon',
              text: 'Se guardó correctamente la reserva',
              variant: 'success',
            },
          })
          if (!this.reservation.id) {
            this.$router.push('/edit-reservation/' + response.data.id)
          } else {
            this.editCreatedUser = false
          }
        } else {
          this.showError('Ha ocurrido un error al guardar la reserva')
        }
      }, () => {
        this.showError('Ha ocurrido un error al guardar la reserva')
      })
    },
    editService(index) {
      const reservationDetail = this.reservation.reservation_details[index]
      this.reservationDetailIndex = index
      this.reservationDetailSelected = JSON.parse(JSON.stringify(reservationDetail))
      const serviceModal = this.serviceTypes.find(type => type.class === reservationDetail.reservable_type)
      if (reservationDetail.reservable.is_pack) {
        this.isPack = true
      }
      this.addServiceSelected(serviceModal)
    },
    deleteService(index) {
      const description = this.totalPaid > 0 ? `Se va a generar un monto de $${this.totalPaid} en wallet` : ''
      this.$swal({
        title: '¿Está seguro que desea eliminar el servicio?',
        text: description,
        showCancelButton: true,
        confirmButtonText: `Confirmar`,
        confirmButtonColor: '#41b882',
      }).then(response => {
        if (response.value) {
          this.showOverlay = true
          if (this.reservation.reservation_details[index] && this.reservation.reservation_details[index].id) {
            GeneralService.getInstance().delete('reservations/cancel-service', this.reservation.reservation_details[index].id).then(result => {
              if (result.result === 'success') {

                this.reservation.reservation_details[index] = result.data
                this.initData()

              } else {
                this.showError(`No se ha podido eliminar: ${result.error}`)
                this.showOverlay = false
              }
            }).catch(err => {
              this.showError(`No se ha podido eliminar: ${err.error}`)
              this.showOverlay = false
            })
          } else {
            this.reservation.reservation_details.splice(index, 1)
            this.showOverlay = false
          }
        }
      })
    },
    editPaymentDate(index) {
      this.paymentDateIndex = index
      this.paymentDateSelected = JSON.parse(JSON.stringify(this.reservation.reservation_payment_dates[index]))
      this.$refs.reservationPaymentDateFormModal.show()
    },
    deletePaymentDate(index) {
      this.$swal({
        title: '¿Está seguro que desea eliminar el pago programado?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: '#41b882',
        cancelButtonColor: '#ff7674',
      }).then(response => {
        if (response.value) {
          this.showOverlay = true
          this.reservation.reservation_payment_dates.splice(index, 1)
          this.showOverlay = false
        }
      })
    },
    payPaymentDate(index) {
      this.paymentDateIndex = index
      this.paymentDateSelected = JSON.parse(JSON.stringify(this.reservation.reservation_payment_dates[index]))
      this.openPaymentMethodFormModal()
    },
    showVersion(log) {
      if (!this.historyViewing) {
        this.reservationCopy = JSON.parse(JSON.stringify(this.reservation))
      }
      this.reservation = JSON.parse(log.log)
      this.reservation.reservation_comments = this.reservationCopy.reservation_comments
      for (let i = 0; i < this.reservation.reservation_details.length; i += 1) {
        this.reservation.reservation_details[i].reservation_detail_comments = this.reservationCopy.reservation_details[i].reservation_detail_comments
      }
      this.calcTotal()
      this.historyViewing = true
      this.showHistory = false
    },
    returnCurrentVersion() {
      this.reservation = JSON.parse(JSON.stringify(this.reservationCopy))
      this.calcTotal()
      this.historyViewing = false
    },
    openSettlementForm(index) {
      const reservationDetail = this.reservation.reservation_details[index]
      this.reservationDetailIndex = index
      this.reservationDetailSelected = JSON.parse(JSON.stringify(reservationDetail))
      this.$nextTick(() => {
        this.$refs.settlementFormModal.show()
      })
    },
    markAsInvoiced(index) {
      this.reservation.reservation_details[index].invoiced = 1
      this.save()
    },
    saveSettlement() {
      this.initData()
    },
    onCloseSettlementForm() {
      this.reservationDetailIndex = null
      this.reservationDetailSelected = null
    },
  },

}
</script>

<style lang="scss">
.customer-select .vs__search::placeholder,
.customer-select .vs__dropdown-toggle,
.customer-select .vs__dropdown-menu {
  border: 0;
}
</style>
