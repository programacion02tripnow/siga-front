import Field from './Field'
import ImageComponent from '../components/inputs/ImageComponent.vue'

export default class Image extends Field {
    fileUploaded = false;

    fileName = '';

    fileUrl = '';

    folder = '';

    constructor(name, label, folder, value) {
      super(name, label, 'text', value)
      this.folder = folder
    }

    getComponent = () => ImageComponent;

    setValue(value, fileUrl = '') {
      if (fileUrl !== '') {
        this.fileUploaded = false
        this.fileUrl = fileUrl
      } else {
        this.fileUploaded = true
        this.fileUrl = `/storage/images/${this.folder}/${value}`
      }

      this.fileName = value
    }

    getUserValue() {
      return `<img style="display: block;width:100%;max-width: 70px;" src="${this.fileUrl}" alt="${this.fileName}">`
    }

    getValue() {
      return {
        image: this.fileUrl,
        name: this.fileName,
        edited: !this.fileUploaded,
      }
    }

    toJSON() {
      return this.getValue()
    }
}
