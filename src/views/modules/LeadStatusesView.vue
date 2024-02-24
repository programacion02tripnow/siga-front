<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import LeadStatus from '@/dc-it/models/LeadStatus'

export default {
  name: 'LeadStatusesView',
  components: { TableComponent },
  data() {
    return {
      model: LeadStatus,
    }
  },
}
</script>

<style scoped>

</style>
