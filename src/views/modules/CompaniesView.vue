<template>
    <div>
        <table-component :model="model" />
    </div>
</template>
  
<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import Company from '@/dc-it/models/Company'

export default {
    name: 'UsersView',
    components: { TableComponent },
    data() {
        return {
            model: Company,
        }
    },
}
</script>
  
<style scoped></style>
  