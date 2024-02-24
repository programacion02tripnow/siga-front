<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Customer from '@/dc-it/models/Customer'

export default {
  name: 'CustomersView',
  components: { TableComponent },
  data() {
    return {
      model: Customer,
    }
  },
}
</script>

<style scoped>

</style>
