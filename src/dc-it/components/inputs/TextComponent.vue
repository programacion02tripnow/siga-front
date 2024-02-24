<template>
  <div
    v-if="options.enabled"
    :class="options.showLabel ? 'form-group': 'form-control'"
    style="display:block;"
  >
    <label v-if="options.showLabel">{{ options.label }}</label>
    <input
      v-model="field.value"
      :class="options.showLabel ? 'form-control' : 'without-label'"
      :type="options.type"
      :placeholder="options.label"
      :disabled="!options.enabled"
      step="any"
      @change="onChange(field)"
    >
  </div>
</template>

<script>
export default {
  name: 'TextInputComponent',
  props: {
    options: {
      type: Object,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
  },
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
    .without-label {
        width: 100%;
        height: 100%;
        border:none;
    }
</style>
