import MultipleMultimediaComponent from '../components/inputs/MultipleMultimediaComponent.vue'
import MultipleRelation from './MutipleRelation'

export default class MultipleMultimedia extends MultipleRelation {
  constructor(name, label, value = [], model) {
    super(name, label, model, value)
  }

  getComponent = () => MultipleMultimediaComponent;

  /* setValue(value) {
        console.log(value);
    } */
}
