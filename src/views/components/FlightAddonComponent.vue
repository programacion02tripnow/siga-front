<template>
  <b-card>
    <template #header>
      <h6>Addon {{ addon_number }}</h6>
      <b-button
        class="btn-icon ml-1"
        variant="danger"
        @click="deleteAddon"
      >
        <feather-icon icon="TrashIcon" />
      </b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-3">
        <div class="form-group">
          <label>Nombre</label>
          <input
            type="text"
            class="form-control text-box-n"
            placeholder="Nombre addon"
          >
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            class="form-control"
            placeholder="Cantidad"
          >
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="form-group">
          <label>Precio publico</label>
          <input
            type="text"
            class="form-control text-box-n"
            placeholder="Precio publico"
          >
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="form-group">
          <label>Precio neto</label>
          <input
            type="text"
            class="form-control text-box-n"
            placeholder="Precio neto"
          >
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import { BCard, BButton } from 'bootstrap-vue'

export default {

  name: 'FlightAddonComponent',

  components: { BCard, BButton },
  props: {
    flight_addons: {
      type: Object,
      default: () => ({
        name: '',
        quantity: '',
        public_price: '',
        net_price: '',
      }),
    },
    addon_number: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteAddon() {
      this.$emit('delete')
    },
  },
}
</script>
