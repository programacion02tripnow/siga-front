import Field from './Field'
import MultipleFormComponent from '../components/inputs/MultipleFormComponent.vue'

export default class MultipleRelation extends Field {
    limit = 0;

    min = 1;

    model;

    models = [];

    constructor(name, label, Model, value = []) {
      super(name, label, 'text', value)
      this.Model = Model
    }

    getComponent = () => MultipleFormComponent;

    setLimit(limit) {
      this.limit = limit
      return this
    }

    setMin(min) {
      this.min = min
      return this
    }

    addModel() {
      const m = new this.Model()
      this.models.push(m)
      return m
    }

    deleteModel(model) {
      this.models.splice(this.models.indexOf(model), 1)
    }

    getValue() {
      return this.models
    }

    getUserValue() {
      if (this.isRenderComponent) {
        return this.getRenderComponent()
      }
      return this.mask ? this.mask(this.originalValue.length) : this.originalValue.length
    }

    setValue(value) {
      this.models = []
      this.originalValue = []

      if (Array.isArray(value)) {
        value.forEach(v => {
          this.addItem(v)
        })
      } else {
        this.addItem(value)
      }
    }

    addItem(values) {
      const m = new this.Model()
      m.initValues(values)
      this.models.push(m)
      this.originalValue.push(m)
    }
}
