<template>
  <b-modal
    ref="refFormModal"
    title="Liquidar servicio"
    ok-title="Aceptar"
    cancel-title="Cancelar"
    no-close-on-backdrop
    @ok="save"
    @hidden="$emit('close')"
  >
    <b-overlay :show="loading">
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Monto a pagar</label>
            <input
              type="text"
              class="form-control"
              :value="numberFormat(reservationDetail.net_price)"
              disabled
            >
          </div>

          <div class="form-group">
            <label>Método de liquidación</label>
            <v-select
              v-model="settlement.settlement_method"
              :disabled="settlement.id"
              label="text"
              :clearable="false"
              :options="types"
              :reduce="value=>value.type"
              :get-option-label="option=>option.label"
            />
          </div>

          <div v-if="settlement.settlement_method.toString()==='1'">
            <p
              v-if="!settlement.id"
              class="m-0 text-warning font-weight-bolder"
            >
              Para confirmar la liquidación se enviará un correo de solicitud de pago a proveedor
              a los usuarios autorizados, posteriormente, algún usuario autorizado debe de confirmar la transferencia
            </p>

            <p
              v-if="settlement.id"
              class="m-0 text-danger font-weight-bolder"
            >
              Las liquidaciones por transferencia solo se pueden confirmar con el link que se provee a través del correo solicitud de pago a proveedor
            </p>
          </div>

          <div v-if="settlement.settlement_method.toString()==='2'">
            <p
              v-if="!settlement.id"
              class="m-0 text-warning font-weight-bolder"
            >
              Para confirmar la liquidación se enviará una contraseña de uso único
              a un usuario autorizador, después tendrá que solicitar e ingresar el código
            </p>

            <div v-if="settlement.id">
              <div class="form-group">
                <label>Contraseña de uso único</label>
                <input
                  v-model="settlement.auth_token"
                  type="text"
                  class="form-control"
                >
              </div>

              <div class="form-group">
                <label>Usuario que autoriza</label>
                <v-select
                  v-model="settlement.authorization_user_id"
                  label="text"
                  :clearable="false"
                  :options="users"
                  :reduce="value=>value.id"
                  :get-option-label="option=>option.username"
                />
              </div>
            </div>
          </div>

          <div v-if="settlement.settlement_method.toString()==='3'">
            <div class="form-group">
              <label>Terminación de tarjeta de pago (últimos 4 dígitos)</label>
              <input
                v-model="settlement.last4"
                type="number"
                class="form-control"
              >
            </div>
          </div>
        </div>
      </div>
    </b-overlay>
  </b-modal>
</template>

<script>
import { BModal, BOverlay } from 'bootstrap-vue'
import vSelect from 'vue-select'
import helpers from '@/dc-it/services/helpers'
import GeneralService from '@/dc-it/services/GeneralService'

export default {
  name: 'SettlementFormModal',
  components: { BModal, vSelect, BOverlay },
  props: {
    reservationDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      types: [
        {
          type: 1,
          label: 'Transferencia',
        },
        /* {
          type: 2,
          label: 'Monedero virtual',
        }, */
        {
          type: 3,
          label: 'Tarjeta de crédito',
        },
      ],
      users: [],
      settlement: {
        reservation_detail_id: null,
        user_id: null,
        user: null,
        auth_token: '',
        settlement_method: 1,
        last4: '',
        date: null,
        authorization_date: null,
        authorization_user_id: null,
      },
      loading: false,
    }
  },
  mounted() {
    GeneralService.getInstance().all('users/with-permissions/VIEW_USER').then(response => {
      this.users = response.data
    })
    if (this.reservationDetail.settlement) {
      this.settlement = JSON.parse(JSON.stringify(this.reservationDetail.settlement))
    }
  },
  methods: {
    show() {
      this.$refs.refFormModal.show()
    },
    save(e) {
      e.preventDefault()
      switch (this.settlement.settlement_method.toString()) {
        case '1': // transferencia
          break
        case '2': // monedero virtual
          break
        case '3': // tarjeta de credito
          if (this.settlement.last4.length !== 4) {
            this.showError('La terminación de la tarjeta debe de ser de 4 dígitos')
            return
          }
          break
        default:
          this.showError('El método de liquidación no es válido')

          return
      }

      this.settlement.reservation_detail_id = this.reservationDetail.id

      this.loading = true
      GeneralService.getInstance().save('settlements', this.settlement).then(response => {
        if (response.result === 'success') {
          switch (this.settlement.settlement_method.toString()) {
            case '1': // transferencia
            case '3': // tarjeta de credito
              this.$refs.refFormModal.hide()
              break
            case '2': // monedero virtual
              if (!this.settlement.id) {
                this.settlement.id = response.data.id
              } else {
                this.$refs.refFormModal.hide()
              }
              break
            default:
              return
          }
        } else {
          this.showError(`Ha ocurrido un error: ${response.error}`)
        }
        this.$emit('save')
        this.loading = false
      })
    },
    numberFormat(number) {
      return helpers.numberFormat(number)
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
  },
}
</script>

<style scoped>

</style>
