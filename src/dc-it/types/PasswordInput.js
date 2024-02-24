import Field from './Field'
import PasswordComponent from '../components/inputs/PasswordComponent.vue'

export default class PasswordInput extends Field {
  getComponent = () => PasswordComponent;
}
