import Field from './Field'
import SelectComponent from '../components/inputs/SelectComponent.vue'

export default class Select extends Field {
    options;

    constructor(name, label, options, selected = '') {
      super(name, label, 'text', selected)
      this.options = options
    }

    getComponent = () => SelectComponent;

    values() {
      const result = []
      Object.getOwnPropertyNames(this.options).forEach(value => {
        if (typeof this.options[value] === 'string') {
          result.push({ value, text: this.options[value] })
        }
      })
      return result
    }

    getUserValue() {
      const text = this.getText(this.originalValue)
      return this.mask ? this.mask(text) : text
    }

    setValue(value) {
      if (value) {
        this.value = value.toString()
        this.originalValue = value.toString()
      }
    }

    getText(value) {
      return this.options[value]
    }
}
