<template>
  <b-modal id="service_type_modal" ref="serviceTypeModal" title="Selecciona el tipo de servicio" ok-title="Aceptar"
    cancel-title="Cancelar" no-close-on-backdrop @ok="selectClick">
    <div class="form-group">
      <label>Tipo de servicio</label>
      <v-select v-model="selected" label="text" :clearable="false" :options="types" :reduce="value => value" />
    </div>
  </b-modal>
</template>

<script>
import { BModal } from 'bootstrap-vue'
import vSelect from 'vue-select'

export default {
  name: 'SelectServiceTypeModal',
  components: { BModal, vSelect },
  data() {
    return {
      types: [],
      selected: null,

    }
  },
  mounted() {
    this.types = this.$store.state.reservation.servicesTypesMap
    // console.log(this.types)
  },
  methods: {
    show() {
      this.$refs.serviceTypeModal.show()
    },
    selectClick(e) {
      if (this.selected === null) {
        e.preventDefault()
        return
      }

      console.log(this.selected)
      this.$emit('onSelect', this.selected)
      this.$refs.serviceTypeModal.hide()
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
