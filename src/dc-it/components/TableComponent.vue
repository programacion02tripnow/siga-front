<template>
  <div>
    <div class="card">
      <div class="card-header">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <b-button-toolbar justify>
                <b-button-group>
                  <b-button
                    v-if="permissions.create"
                    variant="outline-primary"
                    class="btn-icon"
                    @click="addNew"
                  >
                    <feather-icon
                      icon="PlusIcon"
                    />
                  </b-button>
                  <b-button
                    variant="outline-primary"
                    class="btn-icon"
                    @click="updateData"
                  >
                    <feather-icon
                      icon="RefreshCcwIcon"
                    />
                  </b-button>
                  <!-- @slot Usar el slot para agregar más botones en la parte de arriba de la tabla -->
                  <slot name="actions" />
                </b-button-group>
                <b-button-group v-if="permissions.filter">

                  <b-input-group class="ml-2">
                    <b-form-input v-model="filter" />
                    <b-input-group-append>
                      <b-button
                        v-if="permissions.filter"
                        variant="outline-primary"
                        class="btn-icon"
                        :disabled="filter.trim()===''"
                        @click="applyFilter"
                      >
                        <feather-icon
                          icon="FilterIcon"
                        />
                      </b-button>
                      <b-button
                        v-if="filterApplied"
                        variant="outline-primary"
                        class="btn-icon"
                        @click="clearFilter"
                      >
                        <feather-icon
                          icon="XSquareIcon"
                        />
                      </b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-button-group>

              </b-button-toolbar>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <b-table
          responsive
          show-empty
          :items="data"
          :busy="loading"
          :fields="displayableFields"
          class="mb-0"
        >
          <template #table-busy>
            <div class="loader-container">
              <div style="display: block;margin:auto; text-align: center;">
                <b-spinner
                  class="mr-1"
                  variant="primary"
                />
              </div>
            </div>
          </template>

          <template #empty>
            <h4 class="text-center">
              No se han encontrado resultados
            </h4>
          </template>

          <template #cell()="data">
            <div
              v-if="data.field.key!=='actions' && !data.field.isComponent"
              v-html="data.item.getAttr(data.field.key)"
            />

            <div
              v-if="data.field.key!=='actions' && data.field.isComponent"
              data-type="component"
            >
              <component
                :is="data.item.getAttr(data.field.key)"
                :value="data.item.getAttr(data.field.key, false)"
                :model="data.item"
              />
            </div>

            <div
              v-if="data.field.key==='actions'"
            >
              <div class="btn-group d-flex justify-content-end">
                <button
                  v-if="permissions.edit"
                  class="btn btn-success"
                  @click="update(data.item)"
                >
                  <feather-icon
                    icon="EditIcon"
                  />
                </button>

                <button
                  v-for="(action, i) of data.item.actions"
                  :key="i"
                  class="btn"
                  :class="action.class"
                  style="color:white"
                  :disabled="action.disabled()"
                  @click="callToAction(data.item, action)"
                >
                  <feather-icon
                    :icon="action.icon"
                  />
                  {{ action.text }}
                </button>

                <button
                  v-if="permissions.delete"
                  class="btn btn-danger"
                  @click="deleteItem(data.item)"
                >
                  <feather-icon
                    icon="TrashIcon"
                  />
                </button>
              </div>
            </div>
          </template>
        </b-table>

      </div>
      <div
        v-if="!loading"
        class="card-footer"
      >
        <div class="row">
          <div class="col-md-6">
            <div>
              Mostrando {{ data.length }} de {{ paginate ? paginate.total : data.length }}
              {{ paginate && paginate.total === 1 ? 'registro' : 'registros' }}
            </div>
          </div>
          <div class="col-md-6 d-flex justify-content-end">
            <b-pagination
              v-if="paginate"
              v-model="paginate.currentPage"
              :total-rows="paginate.total"
              :per-page="paginate.perPage"
              @change="gotoPage"
            />

          </div>
        </div>
      </div>
    </div>

    <b-modal
      v-if="showForm"
      id="mdlForm"
      :title="titleModal"
      hide-footer
      no-enforce-focus
      no-close-on-backdrop
    >
      <div v-if="modelSelected">
        <form-component
          :model="modelSelected"
          @cancel-form="closeForm"
          @save-form="saveForm"
        />
      </div>
    </b-modal>

  </div>
</template>
<script>

import {
  BButton, BButtonToolbar, BButtonGroup, BTable, BSpinner, BPagination, BInputGroup, BFormInput, BInputGroupAppend,
} from 'bootstrap-vue'

import Ripple from 'vue-ripple-directive'
import { ref } from '@vue/composition-api'
import Paginate from '@/dc-it/models/Paginate'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import FormComponent from './FormComponent.vue'

/**
* Componente principal para realizar CRUD sencillo
* o en su defecto renderear table con un array de objetos Model
 * @displayName TableComponent
 */
export default {
  name: 'TableComponent',
  components: {
    BButton,
    BButtonToolbar,
    BButtonGroup,
    BTable,
    BSpinner,
    BPagination,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,
    FormComponent,
  },
  directives: {
    Ripple,
  },
  props: {
    /**
     *  Modelo a usar para la tabla, debe ser un modelo de la librería dc-it
     */
    model: {
      required: true,
    },
    /**
     * Filtro inicial, sirve para configurar un filtro desde el principio del objeto
     * Debe de ser un array de objects con la siguiente estructura
     * {
     *   field: 'nombre del campo a filtrar',
     *   operator: 'operador a usar, puede ser =, >, <, >=, <=, contains',
     *   value: 'valor a filtrar',
     *   function: 'función a usar para el filtro, puede ser where, whereHas, whereDoesntHave'
     * }
     */
    initFilter: {
      type: Array,
      default() {
        return []
      },
    },
    /**
     * Valor booleano que indica si el componente TableComponent, mostrará un formulario para crear/editar un nuevo registro del modelo
     */
    showForm: {
      type: Boolean,
      default: true,
    },
    /**
     * Ruta a dónde mandar en caso de que showForm sea false y haya permiso para creación
     */
    urlCreateForm: {
      type: String,
      default: '/create',
    },

    /**
     * Ruta a dónde mandar en caso de que showForm sea false y haya permiso para edición
     */
    urlEditForm: {
      type: String,
      default: '/edit',
    },
    /**
     * Objeto para configurar los permisos de la tabla
     */
    permissions: {
      required: false,
      type: Object,
      default: () => ({
        create: true,
        edit: true,
        delete: true,
        filter: true,
      }),
    },
    hideActionsColumn: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      titleModal: 'Agregar nuevo',
      modelSelected: undefined,
      personalizedModal: undefined,
      personalizedData: undefined,
    }
  },
  methods: {
    clearFilter() {
      this.filter = ''
      this.filterApplied = false
      /**
       * Evento que se emite cuando se limpia el filtro
       */
      this.$emit('clearFilter')
      this.updateData()
    },
    closeForm() {
      this.$bvModal.hide('mdlForm')
      this.modelSelected = undefined
    },
    saveForm() {
      this.closeForm()
      this.updateData()
      /**
       * Evento que se emite cuando se guarda el formulario ya sea en edición o creación
       */
      this.$emit('save-form')
    },
    addNew() {
      if (this.showForm) {
        // eslint-disable-next-line new-cap
        this.modelSelected = new this.model()
        /**
         * Evento que se emite cuando se abre el formulario para agregar un nuevo registro
         */
        this.$emit('add-new')
        this.$bvModal.show('mdlForm')
      } else {
        this.$router.push(this.urlCreateForm)
      }
    },
    updateData() {
      if (this.filterApplied) {
        this.applyFilter()
      } else {
        this.loading = true
        this.paginate.reloadPage().then(paginate => {
          this.newPage(paginate)
          this.loading = false
        })
      }
    },
    update(model) {
      if (this.showForm) {
        // eslint-disable-next-line new-cap
        this.modelSelected = new this.model()
        this.modelSelected.initValues(model.toJSON())
        this.$bvModal.show('mdlForm')
      } else {
        this.$router.push(`${this.urlEditForm}/${model.getAttr('id')}`)
      }
    },
    deleteItem(model) {
      this.$swal({
        title: '¿Está seguro que desea eliminar el registro?',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        confirmButtonColor: '#41b882',
        cancelButtonColor: '#ff7674',
      }).then(response => {
        if (response.value) {
          this.loading = true
          model.delete().then(() => {
            this.updateData()
          }).catch(err => {
            this.$toast({
              component: ToastificationContent,
              props: {
                title: '¡Error!',
                icon: 'XIcon',
                text: err.error,
                variant: 'danger',
              },
            })
            this.loading = false
          })
        }
      })
    },
    prevPage() {
    },
    gotoPage(page) {
      if (!(page == null || page === '')) {
        this.loading = true
        this.paginate.gotoPage(page).then(paginate => {
          this.newPage(paginate)
        })
      }
    },
    nextPage() {
    },
    callToAction(item, action) {
      if (typeof action.action === 'function') {
        // TODO add personalized modal
        /* this.personalizedModal = action.action();
        this.personalizedData = action.params(item);
        setTimeout(() => {
          this.$bvModal.show('mdlPersonalized');
        }, 200); */
      } else {
        this.$router.push({ name: action.action, params: action.params(item) })
      }
    },
  },
  setup(props) {
    const data = ref([])
    const fields = ref([])
    const displayableFields = ref([])
    const paginate = ref(null)
    const loading = ref(false)
    const filter = ref('')
    const filterApplied = ref(false)
    const filterFields = ref([])

    const newPage = page => {
      paginate.value = page
      data.value = page.models
      loading.value = false
    }

    const applyFilter = () => {
      let hasFilters = false
      // eslint-disable-next-line new-cap
      const m = new props.model()
      if (filter.value.trim() !== '') {
        const filterableFields = fields.value.filter(field => field.filterable)
        for (let i = 0; i < filterableFields.length; i += 1) {
          if (i === 0) {
            m.orWhere(filterableFields[i].getFieldName(), 'contains', filter.value)
            hasFilters = true
          } else {
            m.orWhere(filterableFields[i].getFieldName(), 'contains', filter.value)
          }
        }
      }

      /* filterFields.value.forEach((item, index) => {
        switch (item.function) {
          case 'whereDoesntHave':
            m.whereDoesntHave(item.field, item.operator, item.value)
            hasFilters = true
            break
          case 'whereHas':
            m.whereHas(item.field, item.operator, item.value)
            hasFilters = true
            break
          case 'where':
            m.where(item.field, item.operator, item.value)
            hasFilters = true
            break
          default:
            if (hasFilters) {
              m.orWhere(item.field, 'contains', item.value)
            } else if (index === 0) {
              m.where(item.field, 'contains', item.value)
              hasFilters = true
            }
        }
      }) */

      filterFields.value.forEach(item => {
        const operator = item.operator ?? 'contains'
        m.where(item.field, operator, item.value)
        hasFilters = true
        /* if (hasFilters) {
          m.orWhere(item.field, operator, item.value)
        } else if (index === 0) {
          m.where(item.field, operator, item.value)
          hasFilters = true
        } */
      })

      if (hasFilters) {
        loading.value = true
        m.get().then(models => {
          data.value = models
          filterApplied.value = true
          loading.value = false
        })
      }
    }

    const loadData = () => {
      loading.value = true
      fields.value = props.model.getFields()
      const visibleFields = props.model.getFields().filter(field => field.visible)
      displayableFields.value = visibleFields.map(field => ({
        key: field.name,
        label: field.label,
        isComponent: field.isRenderComponent,
      }))

      if (!props.hideActionsColumn) {
        displayableFields.value.push({
          key: 'actions',
          label: 'Acciones',
        })
      }

      if (props.initFilter.length === 0) {
        Paginate.initPagination(props.model).then(page => {
          newPage(page)
        })
      } else {
        filterFields.value = props.initFilter
        applyFilter()
      }
    }

    loadData()
    return {
      data,
      fields,
      loadData,
      paginate,
      loading,
      newPage,
      displayableFields,
      applyFilter,
      filter,
      filterApplied,
      filterFields,
    }
  },
}
</script>

<style scoped>
.filter-options {
  position: relative;
  display: inline-block;
  z-index: 1050;
}

.filter-options .options-container {
  padding-top: 20px;
}

.filter-options .options-container .row > div {
  padding: 5px !important;
}

.filter-options .options-container {
  width: 500px;
}

</style>
