import Field from './Field'
import SelectComponent from '../components/inputs/SelectComponent.vue'

export default class Relation extends Field {
    ModelClass;

    displayField;

    model;

    multiple = false;

    loading = false;

    options = [];

    constructor(name, label, Model, displayField = 'id', value = '') {
      super(name, label, 'text', value)
      this.ModelClass = Model
      this.displayField = displayField
    }

    where(field, operator, value) {
      this.ModelClass = this.ModelClass.where(field, operator, value)
      return this
    }

    initOptions() {
      if (!this.loading) {
        this.loading = true
        this.ModelClass.get().then(models => {
          this.options = models
          this.loading = false
        })
      }
    }

    values() {
      const result = []
      this.options.forEach(option => {
        result.push({ value: option.getAttr('id'), text: option.getAttr(this.displayField) })
      })
      return result
    }

    getComponent = () => {
      if (this.options.length === 0 && !this.loading) {
        setTimeout(() => {
          this.initOptions()
        }, 100)
      }
      return SelectComponent
    }

    /* getComponent() {
      if (this.options.length === 0 && !this.loading) {
        setTimeout(() => {
          this.initOptions()
        }, 100)
      }
      return SelectComponent
    } */

    // eslint-disable-next-line consistent-return
    getSelectedModel() {
      if (this.model) {
        return this.model
      }
      if (this.options.length === 0) {
        return this.value.toString()
      }
      return this.options.find(m => this.value.toString() === m.getAttr('id').toString())
    }

    setValue(value) {
      if (value) {
        if (value.id !== null && value.id !== undefined) {
          this.model = new this.ModelClass()
          this.model.initValues(value)

          this.originalValue = value.id
          this.value = value.id
        } else if (Array.isArray(value)) {
          const result = []
          value.forEach(v => {
            result.push(v.id)
          })
          this.originalValue = result
          this.value = result
        } else {
          super.setValue(value)
        }
      }
    }

    setMultiple() {
      this.multiple = true
      return this
    }

    getUserValue() {
      if (this.model) {
        if (this.isRenderComponent) {
          return this.getRenderComponent()
        }
        return this.mask ? this.mask(this.model.getAttr(this.displayField), this.model) : this.model.getAttr(this.displayField)
      }

      return ''
    }

    getValue() {
      return this.getSelectedModel()
    }
}
