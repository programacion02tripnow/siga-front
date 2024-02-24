import Model from '@/dc-it/models/Model'

export default class Settlement extends Model {
    endpoint = 'settlements'

    fields = []

    clone = () => Settlement
}
