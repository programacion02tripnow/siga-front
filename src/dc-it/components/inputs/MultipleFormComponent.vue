<template>
  <div class="multiple-form-container">
    <h5>{{ field.label }}</h5>
    <div>
      <div
        v-for="(model, key, index) in field.models "
        :key="index"
        class="model-container"
      >
        <component
          :is="f.getComponent()"
          v-for="f of model.getFields()"
          :key="f.name"
          :options="f.getOptions()"
          :field="f"
        />
        <button
          type="button"
          class="btn btn-danger"
          @click="field.deleteModel(model)"
        >
          <feather-icon
            icon="TrashIcon"
          />
        </button>
      </div>
      <p
        v-if="field.models.length === 0"
        style="text-align: center;font-style: italic;"
      >
        Sin agregar {{ field.label.toLowerCase() }}
      </p>
    </div>
    <button
      class="btn btn-secondary"
      type="button"
      @click="field.addModel()"
    >
      Agregar nuevo
    </button>
  </div>
</template>

<script>
export default {
  name: 'MultipleFormComponent',
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

<style scoped>
    .multiple-form-container {
        padding: 10px;
        background: #8080801f;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .model-container {
        position: relative;
        padding: 30px 10px 0;
        border-radius: 10px;
        border: 1px solid;
        margin-bottom: 10px;
    }

    .btn-danger {
        position: absolute;
        top: 5px;
        right: 10px;
    }
</style>
