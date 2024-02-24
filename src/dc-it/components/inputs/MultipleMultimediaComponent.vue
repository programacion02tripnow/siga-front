<template>
  <div>
    <div class="images-title">
      <h5 class="m-0">
        {{ options.label }}
      </h5>
      <button
        v-if="(field.limit===0 || field.limit > 1)"
        v-b-modal.mdl-select-files
        type="button"
        class="btn btn-outline-secondary btn-icon rounded-circle ml-1"
      >
        <feather-icon icon="PlusIcon" />
      </button>
    </div>

    <div
      v-if="(field.limit===0 || field.limit > 1)"
      class="images-container"
    >
      <div
        v-if="field.models.length===0"
        style="display: flex;width: 100%;height: 100%;align-items: center;justify-content: center;"
      >
        No se han agregado imágenes
      </div>

      <div
        v-for="img of field.models"
        :key="img.getAttr('id')"
        class="img-container"
      >
        <button
          type="button"
          class="btn btn-icon text-danger"
          @click="removeFile(img)"
        >
          <feather-icon icon="XIcon" />
        </button>
        <img
          :src="img.getAttr('file_url')"
          :alt="img.getAttr('alt_text')"
        >
      </div>
    </div>

    <b-avatar
      button
      variant="secondary"
      size="70px"
      class="align-baseline my-2"
      :src="field.models.length>=1 ? field.models[0].getAttr('file_url') : ''"
      @click="addFiles"
    />

    <input
      ref="input-element"
      type="file"
      multiple
      style="display: none;"
      @change="inputChange"
    >

    <b-modal
      id="mdl-select-files"
      centered
      hide-header
      :no-close-on-backdrop="uploading"
      :no-close-on-esc="uploading"
      ok-only
      ok-title="Subir imágenes"
      :ok-disabled="uploading || toUpload.length===0"
      @ok.prevent="uploadFiles"
    >
      <div
        v-if="toUpload.length===0"
        class="drag-drop-container"
        @click="addFiles"
        @drop.prevent="drop($event)"
        @dragover.prevent
        @dragleave.prevent
      >
        <i class="fa fa-file" />
        <p>Haz click para seleccionar archivos o arrastra aquí tus archivos</p>
        <p>(Máximo 2Mb/por archivo)</p>
      </div>

      <div
        v-if="toUpload.length>0"
        class="drag-drop-container"
        style="justify-content: flex-start;overflow-x: hidden;overflow-y: scroll;"
        @drop.prevent="drop($event)"
        @dragover.prevent
        @dragleave.prevent
        @click="addFiles"
      >
        <ul>
          <li
            v-for="(file, index) of toUpload"
            :key="index"
          >
            <div class="d-flex">
              <button
                type="button"
                class="btn btn-icon"
                :class="file.hasError?'text-danger':''"
                :disabled="file.uploading || file.uploaded"
                @click.stop="removeFileToUpload(file)"
              >
                <i
                  v-if="file.uploading === false && file.uploaded === false"
                  class="fa fa-times"
                />
                <i
                  v-if="file.uploading === true && file.uploaded === false"
                  class="fa fa-spinner fa-spin"
                />
                <i
                  v-if="file.uploading === false && file.uploaded === true"
                  class="fa fa-check"
                />
              </button>
              <img
                :src="file.url"
                :alt="file.name"
              >
              <label>{{ file.name }}</label>

            </div>
          </li>
        </ul>
      </div>

      <div class="mt-2">
        <a
          href="https://compressjpeg.com/es/"
          class="btn btn-secondary btn-block"
          target="_blank"
        >¿Quieres comprimir tus
          imágenes?</a>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { BAvatar } from 'bootstrap-vue'

export default {
  name: 'MultipleMultimediaComponent',
  components: {
    BAvatar,
  },
  props: {
    options: {
      required: true,
      type: Object,
    },
    field: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      toUpload: [],
      uploading: false,
      hasError: false,
    }
  },
  methods: {
    uploadFiles() {
      this.uploading = true
      for (let i = 0; i < this.toUpload.length; i += 1) {
        const m = new this.field.Model()
        m.setAttr('filename', this.toUpload[i].name)
        m.setAttr('file_url', this.toUpload[i].url)
        this.toUpload[i].uploading = true
        m.save().then(response => {
          this.toUpload[i].uploading = false
          if (response.result === 'success') {
            this.toUpload[i].uploaded = true
            m.initValues(response.data)
            this.field.models.push(m)
          } else {
            this.toUpload[i].hasError = true
            this.showError(`Ha ocurrido un error al subir un archivo: ${response.error}`)
          }

          this.uploading = this.toUpload.filter(file => file.uploading).length > 0
          this.hasError = this.toUpload.filter(file => file.hasError).length > 0
          if (!this.uploading && !this.hasError) {
            this.toUpload = []
            this.$bvModal.hide('mdl-select-files')
          }
        })
      }
    },
    removeFileToUpload(file) {
      this.toUpload.splice(this.toUpload.indexOf(file), 1)
    },
    removeFile(file) {
      this.field.deleteModel(file)
    },
    addFiles() {
      const input = this.$refs['input-element']
      input.click()
    },
    inputChange() {
      const input = this.$refs['input-element']
      if (input.files && input.files) {
        this.addMultipleFiles(input.files)
      }
    },
    addMultipleFiles(files) {
      // eslint-disable-next-line no-restricted-syntax
      for (const file of files) {
        const reader = new FileReader()
        const { name } = file

        reader.onload = el => {
          this.toUpload.push({
            name,
            url: el.target.result,
            uploading: false,
            uploaded: false,
            hasError: false,
          })

          if (this.field.limit === 1) {
            this.field.models = []
            this.uploadFiles()
          }
        }
        const size = file.size / 1024 / 1024
        if (size > 5) {
          this.showError('El peso del archivo no puede exceder los 5mb')
          return
        }
        if ((/(.jpg|.jpeg|.png|.gif)$/i).exec(file.name)) {
          reader.readAsDataURL(file)
        } else {
          this.showError(`El archivo ${file.name} no se pudo agregar, ya que, no es una imagen`)
        }
      }
    },
    drop(e) {
      this.addMultipleFiles(e.dataTransfer.files)
    },
    showError(text) {
      this.$swal({
        title: 'Error',
        text,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        confirmButtonColor: '#41b882',
      })
    },
  },
}
</script>

<style lang="scss">
.images-title {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.images-container {
    display: flex;
    padding: 10px;
    height: 100px;
    background: #8080801f;
    margin: 10px 0;
    flex-wrap: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;

    .img-container {
        margin-right: 10px;
        position: relative;

        button {
            position: absolute;
            top: -17px;
            right: -17px;
        }

        img {
            display: block;
            height: 70px;
            width: auto;
        }
    }
}

.drag-drop-container {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #808080;
    background: white;
    border: 2px dashed rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    transition: all linear 0.3s;
    flex-direction: column;
    height: 50vh;
    font-size: 25px;
    text-align: center;

    &:hover {
        color: blue;
        border-color: blue;
    }

    ul {
        list-style: none;
        padding: 10px;
        font-size: 15px;
        width: 100%;

        div {
            align-items: center;

            img {
                width: 70px;
                margin-right: 10px;
            }
        }
    }
}

</style>
