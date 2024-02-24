<template>
  <input type="hidden">
</template>

<script>
export default {
  name: 'HiddenComponent',
  props: ['options', 'field'],
  data() {
    return {}
  },
  methods: {
    onChange(field) {
      this.$emit('change', field)
    },
  },
}
</script>

<style scoped>

</style>
