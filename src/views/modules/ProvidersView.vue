<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Provider from '@/dc-it/models/Provider'

export default {
  name: 'UsersView',
  components: { TableComponent },
  data() {
    return {
      model: Provider,
    }
  },
}
</script>

<style scoped>

</style>
