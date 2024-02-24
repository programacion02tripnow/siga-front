<template>
  <div>
    <table-component
      :model="model"
      @save-form="updateRole"
    />
  </div>
</template>

<script>
import TableComponent from '@/dc-it/components/TableComponent.vue'
import User from '@/dc-it/models/User'

export default {
  name: 'UsersView',
  components: { TableComponent },
  data() {
    return {
      model: User,
    }
  },
  methods: {
    updateRole() {
      this.$store.dispatch('app/updateUserInfo').then(user => {
        localStorage.setItem('userData', JSON.stringify(user))
        this.$ability.update(user.ability)
      })
    },
  },
}
</script>

<style scoped>

</style>
