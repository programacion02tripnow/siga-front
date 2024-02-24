import Field from './Field'
import MultimediaPicker from '../components/inputs/MultimediaPicker.vue'

export default class MultimediaInput extends Field {
    ModelClass;

    displayField;

    model;

    constructor(name, label, Model, displayField = 'id', value = '') {
      super(name, label, 'text', value)
      this.ModelClass = Model
      this.displayField = displayField
    }

    getComponent = () => MultimediaPicker;

    getUserValue() {
      return this.mask ? this.mask(this.originalValue.getAttr(this.displayField)) : this.originalValue.getAttr(this.displayField)
    }

    setValue(value) {
      if (value) {
        this.model = new (this.ModelClass)()
        this.originalValue = new (this.ModelClass)()

        this.model.initValues(value)
        this.value = this.model
        this.originalValue.initValues(value)
      }
    }
}
