<template>
  <div>
    <form @submit.prevent="save">
      <component
        :is="field.getComponent()"
        v-for="field of fields"
        :key="field.name"
        :options="field.getOptions()"
        :field="field"
        @change="changeForm"
      />
      <div class="btn-group">
        <button
          class="btn btn-danger"
          type="button"
          @click="cancel"
        >
          <i class="fa fa-times-circle" />
          Cancelar
        </button>
        <button
          class="btn btn-success"
          type="submit"
        >
          Guardar
          <i class="fa fa-check" />
        </button>
      </div>
      <div style="margin-top:10px;" />
      <b-alert
        variant="danger"
        :show="hasError"
      >
        <h4 class="alert-heading">
          Error
        </h4>
        <div class="alert-body">
          {{ error }}
        </div>
      </b-alert>
    </form>
  </div>
</template>

<script>
import { BAlert } from 'bootstrap-vue'

export default {
  name: 'FormComponent',
  components: {
    BAlert,
  },
  props: {
    model: {},
  },
  data() {
    return {
      fields: [],
      loading: false,
      hasError: false,
      error: '',
    }
  },
  mounted() {
    this.fields = this.model.getFields()
  },
  methods: {
    cancel() {
      this.$emit('cancel-form')
    },
    save() {
      this.model.save().then(response => {
        if (response.result === 'success') {
          this.$emit('save-form', response.data)
        } else {
          this.error = response.error
          this.hasError = true
        }
      })
    },
    changeForm() {
      this.hasError = false
      this.error = ''
    },
  },
}
</script>

<style scoped>

</style>
