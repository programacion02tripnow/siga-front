<template>
  <div class="image-input-container">
    <input
      ref="image-picker"
      type="file"
      style="display: none;"
      @change="onChange(field)"
    >
    <div class="form-group">
      <div
        class="image-container"
        @click="selectImage"
      >
        <img
          v-if="field.fileUrl === ''"
          src="/images/admin/add-image.png"
        >
        <img
          v-if="field.fileUrl !== ''"
          :src="field.fileUrl"
          :alt="field.fileName"
        >
      </div>
      <label @click="selectImage">{{ options.label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageComponent',
  props: ['options', 'field'],
  data() {
    return {}
  },
  methods: {
    onChange(field) {
      const el = this.$refs['image-picker']
      if (el.files && el.files[0]) {
        for (const file of el.files) {
          const reader = new FileReader()
          const { name } = file
          reader.onload = element => {
            field.setValue(name, element.target.result)
            this.$emit('change', field)
          }

          if ((/(.jpg|.jpeg|.png|.gif)$/i).exec(name)) {
            reader.readAsDataURL(file)
          } else {
            alert(`El archivo ${file.name} no se pudo agregar, ya que, no es una imagen`)
          }
        }
      }
    },
    selectImage() {
      this.$refs['image-picker'].click()
    },
  },
}
</script>

<style scoped>
    .image-container {
        display: flex;
        margin: auto;
        background: #c2c3c48a;
        border-radius: 100%;
        width: 120px;
        height: 120px;
        overflow: hidden;
        cursor: pointer;
    }

    .image-container img {
        display: block;
        margin: auto;
        max-width: 100%;
        max-height: 100%;
    }

    label {
        text-align: center;
        display: block;
        cursor: pointer;
    }
</style>
