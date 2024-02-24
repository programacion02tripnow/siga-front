import Field from './Field'
import HTMLInput from '../components/inputs/HTMLInput.vue'

export default class HTMLField extends Field {
  getComponent = () => HTMLInput;
}
