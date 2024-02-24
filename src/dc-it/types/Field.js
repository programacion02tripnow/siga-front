import TextComponent from '../components/inputs/TextComponent.vue'

export default class Field {
    name = '';

    label = '';

    originalValue;

    value = '';

    type = '';

    enabled = true;

    mask;

    visible = true;

    showLabel = true;

    filterable = true;

    component = null;

    isRenderComponent = false;

    constructor(name, label = '', type = 'text', value = '') {
      this.name = name
      this.label = name
      this.type = type
      if (value !== undefined) {
        this.value = value
        this.originalValue = value
      }
      if (label !== '') {
        this.label = label
      }
    }

    disabled() {
      this.enabled = false
      return this
    }

    default(value) {
      this.value = value
      return this
    }

    renderComponent(component) {
      this.isRenderComponent = true
      this.component = component

      return this
    }

    applyMask(masked) {
      this.mask = masked
      return this
    }

    applyPrefix(prefix) {
      return this.applyMask(value => `${prefix}${value}`)
    }

    applySuffix(suffix) {
      return this.applyMask(value => `${value}${suffix}`)
    }

    getComponent = () => TextComponent;

    getRenderComponent = () => this.component

    getOptions() {
      return {
        label: this.label,
        type: this.type,
        enabled: this.enabled,
        showLabel: this.showLabel,
      }
    }

    getUserValue() {
      if (this.isRenderComponent) {
        return this.getRenderComponent()
      }
      return this.mask ? this.mask(this.originalValue) : this.originalValue
    }

    getValue() {
      return this.value
    }

    getOriginalValue() {
      return this.originalValue
    }

    resetValue() {
      this.value = this.originalValue
    }

    setValue(value) {
      if (this.type === 'number' && value) {
        this.value = parseFloat(value)
        this.originalValue = parseFloat(value)
      } else {
        this.value = value
        this.originalValue = value
      }
    }

    hide() {
      this.visible = false
      this.noFilterable()
      return this
    }

    noFilterable() {
      this.filterable = false
      return this
    }

    hideLabel() {
      this.showLabel = false
      return this
    }
}
