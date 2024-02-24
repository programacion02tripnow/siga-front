<template>
  <div
    v-if="options.enabled"
    :class="options.showLabel ? 'form-group': 'form-control'"
    style="display:block;"
  >
    <label v-if="options.showLabel">{{ options.label }}</label>
    <div class="input-group">
      <div class="input-group-prepend">
        <button
          class="btn btn-light"
          type="button"
          @click="field.value = generateString(6)"
        >
          <feather-icon
            icon="KeyIcon"
          />
        </button>
      </div>
      <input
        v-model="field.value"
        :title="options.label"
        :class="options.showLabel ? 'form-control' : 'without-label'"
        :type="type"
        :placeholder="options.label"
        :disabled="!options.enabled"
        step="any"
        @change="onChange(field)"
      >

      <div class="input-group-append">
        <button
          class="btn btn-light"
          type="button"
          @click="type= type==='password' ? 'text' : 'password'"
        >
          <feather-icon
            icon="EyeIcon"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PasswordComponent',
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
    return {
      type: 'password',
    }
  },
  methods: {
    onChange(field) {
      this.$emit('change', field)
    },
    generateString(length) {
      let result = ''
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      const charactersLength = characters.length
      for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
  },
}
</script>

<style scoped>
.without-label {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
