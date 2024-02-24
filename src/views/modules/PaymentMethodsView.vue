<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import PaymentMethod from '@/dc-it/models/PaymentMethod'

export default {
  name: 'PaymentMethodsView',
  components: { TableComponent },
  data() {
    return {
      model: PaymentMethod,
    }
  },
}
</script>

<style scoped>

</style>
