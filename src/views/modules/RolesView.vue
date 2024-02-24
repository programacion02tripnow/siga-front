<template>
  <div>
    <table-component
      :model="model"
      :show-form="false"
      url-create-form="/roles/new"
      url-edit-form="/roles/edit"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Role from '@/dc-it/models/Role'

export default {
  name: 'RolesView',
  components: { TableComponent },
  data() {
    return {
      model: Role,
    }
  },
}
</script>

<style scoped>

</style>
