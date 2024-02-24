<template>
  <div>
    <div class="multimedia-picker">
      <h5>{{ options.label }}</h5>
      <button
        class="btn btn-light btn-add-multimedia"
        type="button"
        @click="showModalEvent"
      >
        <i
          v-if="!field.value"
          class="fa fa-search"
        />
        <img
          v-if="field.value"
          :src="field.getValue().getAttr('file_url')"
          :alt="field.getValue().getAttr('alt_text')"
        >
      </button>
    </div>

    <b-modal
      id="file-picker"
      v-model="showModal"
      size="xl"
      centered
    >
      <template v-slot:modal-header />
      <div v-if="showModal">
        <file-explorer
          :model="model"
          @selectedChange="selectedChange"
          @dblClick="dblClick"
        />
      </div>
      <template v-slot:modal-footer>
        <button
          type="button"
          class="btn btn-secondary"
          @click="showModal = false"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-primary"
          :disabled="!selectable"
          @click="selectConfirm"
        >
          Seleccionar
        </button>
      </template>
    </b-modal>

  </div>
</template>

<script>
import Multimedia from '../../models/Multimedia'
import FileExplorer from '../FileExplorer.vue'

export default {
  name: 'MultimediaPicker',
  components: { FileExplorer },
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

  // ['options', 'field'],
  data() {
    return {
      model: Multimedia,
      showModal: false,
      selectable: null,
    }
  },
  methods: {
    showModalEvent() {
      this.showModal = true
    },
    selectedChange(event) {
      this.selectable = event
    },
    dblClick(event) {
      this.selectedChange(event)
      this.selectConfirm()
    },
    selectConfirm() {
      this.field.value = this.selectable
      console.log(this.field)
      this.showModal = false
    },
  },
}
</script>

<style scoped>
.multimedia-picker {
    margin-bottom: 10px;
}

.btn-add-multimedia {
    width: 200px;
    height: 120px;
    overflow: hidden;
}

.btn-add-multimedia img {
    display: block;
    width: 100%;
    height: 120px;
    object-fit: contain;
}

</style>
