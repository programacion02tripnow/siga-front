<template>
  <b-overlay
    class="h-100"
    :show="loading"
  >
    <div class="mb-1">
      <button
        class="btn btn-primary"
        @click="createNew"
      >
        Crear lead
      </button>
    </div>
    <div
      class="d-flex"
      style="height: 90%; overflow-x:auto;"
    >
      <b-card
        v-for="status in statuses"
        :key="status.getAttr('id')"
        class="card-column"
        no-body
      >

        <template #header>
          <div class="w-100">
            <h4 class="mb-0 text-center">
              {{ status.getAttr('name') }}
            </h4>
          </div>
        </template>
        <b-card-body style="padding:0 1rem 1rem">
          <div class="cards-container">
            <draggable
              :list="lists[status.getAttr('name')]"
              tag="div"
              group="leads"
              class="list-group list-group-flush cursor-move h-100"
              :data-name="status.getAttr('name')"
              :data-id="status.getAttr('id')"
              @add="onChangeColumn"
            >
              <b-card
                v-for="lead in lists[status.getAttr('name')]"
                :key="lead.getAttr('id')"
                :data-id="lead.getAttr('id')"
              >
                <p>Cliente: {{ lead.getAttr('first_name') }} {{ lead.getAttr('last_name') }}</p>
                <p v-if="lead.getAttr('phone')">
                  Teléfono: {{ lead.getAttr('phone') }}
                </p>
                <p>Email: {{ lead.getAttr('email') }}</p>

                <b-button-group
                  class="mt-2 text-right"
                  size="sm"
                >
                  <b-button
                    v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                    variant="primary"
                    class="btn-icon rounded-circle"
                    @click="editLead(lead)"
                  >
                    <feather-icon icon="EditIcon" />
                  </b-button>

                </b-button-group>
              </b-card>

            </draggable>
          </div>
        </b-card-body>
      </b-card>

      <div
        class="card-column text-center d-flex align-items-center justify-content-center"
        style="position: relative;"
      >
        <b-button
          v-ripple.400="'rgba(255, 255, 255, 0.15)'"
          variant="primary"
          class="btn-icon rounded-circle"
          size="lg"
          style="position: absolute;"
        >
          <feather-icon icon="SunriseIcon" />
        </b-button>

        <div>
          <draggable
            :list="toCustomerList"
            tag="div"
            group="leads"
            class="list-group list-group-flush cursor-move h-100"
            data-name="customerList"
            data-id="0"
            @add="toCustomer"
          >
            <b-card
              v-for="lead in toCustomerList"
              :key="lead.getAttr('id')"
              :data-id="lead.getAttr('id')"
              class="scale-down-center"
            >
              <p>Cliente: {{ lead.getAttr('name') }}</p>
              <p>Teléfono: 9991852216</p>
            </b-card>

          </draggable>
        </div>

      </div>
    </div>

    <b-modal
      id="mdlForm"
      :title="titleModal"
      hide-footer
      no-enforce-focus
    >
      <div v-if="modelSelected">
        <form-component
          :model="modelSelected"
          @cancel-form="closeForm"
          @save-form="saveForm"
        />
      </div>
    </b-modal>

  </b-overlay>
</template>

<script>
import Lead from '@/dc-it/models/Lead'
import {
  BCard, BOverlay, BCardBody, BButton, BButtonGroup,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import LeadStatus from '@/dc-it/models/LeadStatus'
import Ripple from 'vue-ripple-directive'
import draggable from 'vuedraggable'
import GeneralService from '@/dc-it/services/GeneralService'
import FormComponent from '@/dc-it/components/FormComponent.vue'

export default {
  name: 'LeadsView',
  components: {
    BCard, BOverlay, BCardBody, BButton, BButtonGroup, draggable, FormComponent,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      model: Lead,
      titleModal: 'Crear lead',
      modelSelected: undefined,
    }
  },
  methods: {
    onChangeColumn(e) {
      const index = e.to.getAttribute('data-name')
      const newStatus = e.to.getAttribute('data-id')
      const el = this.lists[index][e.newIndex]
      const status = this.statuses.find(leadStatus => newStatus.toString() === leadStatus.getAttr('id').toString())
      el.setAttr('lead_status', status.toJSON())
      el.getAttr('lead_status')
      el.save()
      this.$forceUpdate()
    },
    createNew() {
      this.titleModal = 'Crear lead'
      this.modelSelected = new Lead()
      this.$bvModal.show('mdlForm')
    },
    editLead(lead) {
      this.titleModal = 'Editar lead'
      this.modelSelected = new Lead()
      this.modelSelected.initValues(lead.toJSON())
      this.$bvModal.show('mdlForm')
    },
    toCustomer() {
      const leadId = this.toCustomerList[0].getAttr('id')
      GeneralService.getInstance().save('leads/create_customer', {
        lead_id: leadId,
      }).then(() => {
        this.toCustomerList = []
      })
      this.$forceUpdate()
    },
    closeForm() {
      this.$bvModal.hide('mdlForm')
      this.modelSelected = undefined
    },
    saveForm() {
      this.$bvModal.hide('mdlForm')
      this.modelSelected = undefined
      this.loadLeads()
    },
  },
  setup() {
    const statuses = ref([])
    const loading = ref(true)
    const lists = ref({})
    const toCustomerList = ref([])

    const loadLeads = () => {
      loading.value = true
      statuses.value.forEach(leadStatus => {
        lists.value[leadStatus.getAttr('name')] = []
      })
      Lead.where('customer_id', '=', null).get().then(leads => {
        leads.forEach(lead => {
          if (lists.value[lead.getAttr('lead_status')]) {
            lists.value[lead.getAttr('lead_status')].push(lead)
          }
        })

        loading.value = false
      })
    }

    LeadStatus.where('id', '>', 0).get().then(leadStatuses => {
      statuses.value = leadStatuses
      // loading.value = false

      leadStatuses.forEach(leadStatus => {
        lists.value[leadStatus.getAttr('name')] = []
      })

      loadLeads()
    })

    return {
      loading,
      statuses,
      lists,
      toCustomerList,
      loadLeads,
    }
  },
}
</script>

<style scoped lang="scss">
.card-column {
  width: 350px;
  margin-right: 20px;
  flex: 0 0 auto;

  .cards-container {
    height: 100%;
    width: 100%;
    background: #f1f1f1;
    padding: 10px;
    overflow-y: auto;

    .card {
      margin-bottom: 1rem;
    }

    p {
      margin: 0
    }
  }

  .scale-down-center {
    -webkit-animation: scale-down-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    animation: scale-down-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
  }

  /**
   * ----------------------------------------
   * animation scale-down-center
   * ----------------------------------------
   */
  @-webkit-keyframes scale-down-center {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
    }
  }
  @keyframes scale-down-center {
    0% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
    100% {
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
    }
  }

}
</style>
