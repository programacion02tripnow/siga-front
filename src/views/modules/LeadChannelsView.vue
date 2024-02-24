<template>
  <div>
    <table-component
      :model="model"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import LeadChannel from '@/dc-it/models/LeadChannel'

export default {
  name: 'LeadChannels',
  components: { TableComponent },
  data() {
    return {
      model: LeadChannel,
    }
  },
}
</script>

<style scoped>

</style>
