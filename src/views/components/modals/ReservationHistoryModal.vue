<template>
  <b-sidebar
    :visible="showed"
    right
    backdrop
    backdrop-variant="dark"
    lazy
    @change="(val) => $emit('close', val)"
  >
    <div
      v-if="loading"
      class="px-3 py-2"
    >
      <div class="align-items-center d-flex justify-content-center">
        <b-spinner
          class="mr-1"
          variant="primary"
        />
      </div>
    </div>

    <div
      v-if="!loading"
      class="px-1 py-2"
    >
      <div
        v-for="log of logs"
        :key="log.id"
        class="card"
      >
        <div class="card-body">
          <h6>
            Modificación hecha por:
            <br>
            {{ log.user.username }}
          </h6>
          <p class="m-0">
            Fecha modificación:
            <br>
            {{ dateFormat(log.created_at, true) }}
          </p>
          <hr>
          <button
            class="btn btn-icon btn-flat-primary"
            @click="showHistory(log)"
          >
            <feather-icon icon="EyeIcon" />
          </button>
        </div>
      </div>
    </div>
  </b-sidebar>
</template>

<script>
import { BSidebar, BSpinner } from 'bootstrap-vue'
import GeneralService from '@/dc-it/services/GeneralService'
import helpers from '@/dc-it/services/helpers'

export default {
  name: 'ReservationHistoryModal',
  components: {
    BSidebar,
    BSpinner,
  },
  model: {
    prop: 'showed',
    event: 'close',
  },
  props: {
    showed: {
      type: Boolean,
      required: true,
    },
    reservationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      logs: [],
    }
  },
  mounted() {
    if (this.reservationId) {
      this.loading = true
      GeneralService.getInstance().all(`reservation/get-history/${this.reservationId}`).then(response => {
        this.logs = response.data
        this.loading = false
      })
    }
  },
  methods: {
    dateFormat(date, time) {
      return helpers.dateFormat(new Date(date), time)
    },
    showHistory(log) {
      this.$emit('showVersion', log)
    },
  },
}
</script>

<style scoped>

</style>
