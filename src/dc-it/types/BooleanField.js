import Field from './Field'
import SelectComponent from '../components/inputs/SelectComponent.vue'

export default class BooleanField extends Field {
    options = [
      {
        value: 0,
        text: 'No',
      }, {
        value: 1,
        text: 'Si',
      },
    ];

    constructor(name, label, selected = '') {
      super(name, label, 'number', selected)
    }

    getComponent = () => SelectComponent;

    values() {
      return this.options
    }

    getUserValue() {
      const text = this.getText(this.originalValue)
      return this.mask ? this.mask(text) : text
    }

    getText = value => ((value && value.toString() === '1') ? 'Si' : 'No');
}
