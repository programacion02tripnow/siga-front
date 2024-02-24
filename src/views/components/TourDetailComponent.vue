<template>
  <b-card>
    <template #header>
      <h6>Tour {{ number }}</h6>
      <b-button
        variant="danger"
        class="bton-icon ml-1"
      >
        <feather-icon
          icon="TrashIcon"
          @click="deleteTour"
        />
      </b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Nombre del paquete</label>
          <input
            id="package_name"
            type="text"
            class="form-control"
            name="package_name"
            :value="tour.tour_type"
            @change="tour.tour_type = capitalizeInput($event.target.value)"
          >
        </div>
      </div>
      <div class="col-12 col-md-4">
        <label>Precio publico</label>
        <input
          id="public_price"
          v-model="tour.public_price"
          type="text"
          class="form-control"
          name="public_price"
        >
      </div>
      <div class="col-12 col-md-4">
        <label>Precio neto</label>
        <input
          id="net_price"
          v-model="tour.net_price"
          type="text"
          class="form-control"
          name="net_price"
        >
      </div>
      <div class="col-12 col-md-12">
        <label>Comentarios</label>
        <textarea
          id="special_request"
          v-model="tour.net_price"
          type="text"
          class="form-control"
          name="special_request"
        />
      </div>
    </div>
  </b-card>
</template>

<script>
import aux from '@/dc-it/services/helpers'
import { BCard, BButton } from 'bootstrap-vue'
import helpers from 'markdown-it/lib/helpers'

export default {
  name: 'TourDetail',
  components: { BCard, BButton },
  props: {
    tour: {
      type: Object,
      default: () => ({
        tour_type: '',
        public_price: '',
        net_price: '',
        special_request: '',
      }),
    },
    number: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteTour() {
      this.$emit('delete')
    },
    capitalizeInput(value) {
      return aux.capitalize(value)
    },
  },
}
</script>
