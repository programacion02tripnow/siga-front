<template>
  <div
    v-if="options.enabled"
    class="form-group"
  >
    <label>{{ options.label }}</label>
    <v-select
      v-model="field.value"
      label="text"
      :clearable="false"
      :options="field.values()"
      :reduce="value=>value.value"
      :multiple="field.multiple"
      :disabled="!options.enabled"
      @input="onChange"
    />
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'SelectComponent',
  components: {
    vSelect,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['options', 'field'],
  data() {
    return {}
  },
  methods: {
    onChange() {
      this.$emit('change', this.field)
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
