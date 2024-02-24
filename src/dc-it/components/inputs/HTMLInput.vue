<template>
  <div
    :class="options.showLabel ? 'form-group': 'form-control'"
    style="display:block;"
  >
    <label v-if="options.showLabel">{{ options.label }}</label>
    <textarea
      v-model="field.value"
      :class="options.showLabel ? 'form-control' : 'without-label'"
      :placeholder="options.label"
      :disabled="!options.enabled"
      @change="onChange(field)"
    />
  </div>
</template>

<script>

export default {
  name: 'HTMLInput',
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

<style>
    textarea {
        resize: none;
        height: 150px !important;
    }
</style>
