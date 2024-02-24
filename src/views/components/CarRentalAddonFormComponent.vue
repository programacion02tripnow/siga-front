<template>
  <b-card>
    <template #header>
      <h6>Adicional {{ number }}</h6>
      <b-button
        variant="danger"
        class="btn-icon ml-1"
        @click="deleteAddon"
      >
        <feather-icon icon="TrashIcon" />
      </b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Nombre*</label>
          <input
            :value="addon.name"
            type="text"
            class="form-control"
            placeholder="Nombre del adicional"
            @change="addon.name = capitalizeInput($event.target.value)"
          >
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Precio público</label>
          <input
            v-model="addon.public_price"
            type="text"
            class="form-control text-box-n"
            placeholder="Precio público"
          >
        </div>
      </div>
      <div class="col-12 col-md-4">
        <div class="form-group">
          <label>Precio neto</label>
          <input
            v-model="addon.net_price"
            type="text"
            class="form-control"
            placeholder="Precio neto"
          >
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import helpers from '@/dc-it/services/helpers'
import { BCard, BButton } from 'bootstrap-vue'
// import helpers from 'markdown-it/lib/helpers'

export default {
  name: 'CarRentalAddonFormComponent',

  components: { BCard, BButton },
  props: {
    addon: {
      type: Object,
      default: () => ({
        net_price: null,
        public_price: null,
        name: '',
      }),
    },
    number: {
      type: Number,
      required: true,
    },
  },
  methods: {
    deleteAddon() {
      this.$emit('delete')
    },
    roomAddon() {
      this.$emit('update')
    },
    capitalizeInput(value) {
      return helpers.capitalize(value)
    },
  },
}
</script>
