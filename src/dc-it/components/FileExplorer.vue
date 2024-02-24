<template>
  <div class="card">
    <div
      class="card-header"
      style="padding: 0"
    >
      <h4 style="margin: 10px;">
        Administrador de archivos
      </h4>
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="tabSelected===1 ? 'active': ''"
            @click="tabChanged(1)"
          >
            Existentes
          </button>
        </li>
        <li class="nav-item">
          <button
            type="button"
            class="nav-link"
            :class="tabSelected===2 ? 'active': ''"
            @click="tabChanged(2)"
          >
            Agregar
          </button>
        </li>
      </ul>
    </div>
    <div
      class="card-body"
      style="padding:0;"
    >
      <div
        v-if="loading"
        style="min-height: 250px;display: flex;align-items: center; justify-content: center;"
      >
        <div class="loader-container">
          <i class="fa fa-spinner fa-spin" />
        </div>
      </div>

      <div v-if="!loading">
        <div v-if="tabSelected===1">
          <div class="multimedia-main-container">
            <div
              v-if="result.length === 0"
              style="text-align: center;padding-top:20px;"
            >
              <p>No se han creado archivos multimedia</p>
              <button
                type="button"
                class="btn btn-light"
                @click="tabChanged(2)"
              >Agregar nuevo
              </button>
            </div>
            <div
              v-for="file of result"
              :key="file.getAttr('id')"
              class="multimedia-container"
              :class="file===selected ? 'selected' : ''"
              @click="fileClick(file)"
              @dblclick="fileDblClick(file)"
            >
              <div>
                <img
                  :src="file.getAttr('file_url')"
                  :alt="file.getAttr('alt_text')"
                >
              </div>
            </div>
          </div>
        </div>
        <div v-if="tabSelected===2">
          <div class="add-files-container">
            <button
              type="button"
              class="btn btn-light"
              @click="addFiles"
            >Subir un nuevo archivo
            </button>
            <input
              ref="input-element"
              type="file"
              style="display: none;"
              @change="inputChange"
            >
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="selected"
      class="card-footer"
    >
      <div class="row">
        <div class="col-md-12">
          <strong>Detalle del archivo:</strong>
          <div class="row">
            <div class="col-md-2">
              <img
                :src="selected.getAttr('file_url')"
                :alt="selected.getAttr('file_url')"
                style="display: block;width:100%;height: 120px; object-fit: contain"
              >
            </div>
            <div class="col-md-10">
              <p><span>Nombre de archivo: </span>{{ selected.getAttr('alt_text') }}</p>
              <p><span>Enlace de acceso: </span>
                <span v-if="selected.getAttr('id')">
                  <a
                    :href="selected.getAttr('file_url')"
                    target="_blank"
                  >{{ selected.getAttr('file_url') }}</a>
                </span>
                <span v-if="!selected.getAttr('id')">
                  <span style="color: red;">(Archivo sin subir)</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileExplorer',
  props: {
    model: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      result: [],
      loading: true,
      selected: null,
      tabSelected: 1,
    }
  },
  mounted() {
    this.loading = true
    this.model.get().then(models => {
      console.log(models)
      this.result = models
      this.loading = false
    })
  },
  methods: {
    tabChanged(tab) {
      if (tab !== this.tabSelected) {
        this.tabSelected = tab
        this.selected = null
        this.$emit('selectedChange', null)
      }
    },
    addFiles() {
      const input = this.$refs['input-element']
      input.click()
    },
    inputChange() {
      const input = this.$refs['input-element']
      if (!(input.files && input.files)) {
        return
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const file of input.files) {
        const reader = new FileReader()
        const { name } = file

        reader.onload = el => {
          // eslint-disable-next-line new-cap
          const m = new this.model()
          m.setAttr('filename', name)
          m.setAttr('file_url', el.target.result)

          this.result.unshift(m)

          this.loading = true
          m.save().then(response => {
            if (response.result === 'success') {
              m.initValues(response.data)
              this.selected = m
            } else {
              this.result.splice(0, 1)
              // functions.show_error('Ha ocurrido un error al subir un archivo: ' + response.error);
            }
            this.loading = false
          })

          this.tabSelected = 1
        }
        if ((/(.jpg|.jpeg|.png|.gif)$/i).exec(file.name)) {
          reader.readAsDataURL(file)
        } else {
          // eslint-disable-next-line no-alert
          alert(`El archivo ${file.name} no se pudo agregar, ya que, no es una imagen`)
        }
      }
    },
    fileClick(file) {
      this.selected = file
      this.$emit('selectedChange', file)
    },
    fileDblClick(file) {
      this.$emit('dblClick', file)
    },
  },
}
</script>

<style scoped>
.multimedia-main-container, .add-files-container {
  width: 100%;
  display: block;
  height: 350px;
  overflow-x: hidden;
  overflow-y: scroll;
}

.add-files-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.add-files-container p {
  margin: 5px 0;
}

.multimedia-container {
  width: calc(20% - 10px);
  margin: 5px;
  display: block;
  overflow: hidden;
  float: left;
  height: 120px;
  cursor: pointer;
  padding: 7px;
}

.multimedia-container div {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: hidden;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, .1), inset 0 0 0 1px rgba(0, 0, 0, .05);
}

.multimedia-container.selected {
  box-shadow: inset 0 0 2px 3px #fff, inset 0 0 0 7px #5b9dd9;
}

.multimedia-container img {
  display: block;
  object-fit: contain;
  object-position: center;
  width: 100%;
  height: 100%;
}

.nav-link {
  color: #0073aa;
}

.nav-link.active {
  color: #32373c;
}

@media screen and (max-width: 750px) {
  .multimedia-container {
    width: calc(50% - 20px);
  }
}

@media screen and (max-width: 400px) {
  .multimedia-container {
    width: calc(100% - 20px);
  }

  .multimedia-main-container {
    height: calc(100vh - 330px);
  }
}

</style>
