<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Lead from '@/dc-it/models/Lead'

export default {
  name: 'LeadsBackupView',
  components: { TableComponent },
  data() {
    return {
      model: Lead,
    }
  },
}
</script>

<style scoped>

</style>
