<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-8">
          <h6>Servicio adicional {{ number }}</h6>
          <div class="col-4">
            <b-button
              class="btn-icon ml-1"
              variant="danger"
              @click="deleteAdditionalService"
            >
              <feather-icon icon="TrashIcon" />
            </b-button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="form-group">
            <label>Nombre</label>
            <input
              type="text"
              class="form-control text-box-n"
              name="name"
              placeholder="Nombre del servicio adicional"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue'

export default {
  name: 'FlightAdditionalService',

  components: { BButton },

  props: {
    additional_services: {
      type: Object,
      default: () => ({
        name: '',
      }),
    },
    number: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteAdditionalService() {
      this.$emit('delete')
    },
  },
}
</script>
