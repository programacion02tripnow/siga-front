import Field from './Field'
import HiddenComponent from '../components/inputs/HiddenComponent.vue'

export default class ModelValue extends Field {
    model;

    constructor(name, label, model, value = '') {
      super(name, label, 'text', value)
      this.model = model
    }

    getComponent = () => HiddenComponent;

    getUserValue = () => '';

    setValue(value) {
      this.value = value
    }
}
