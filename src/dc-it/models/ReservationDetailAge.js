import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class ReservationDetailAge extends Model {
    endpoint = 'reservation_detail_ages';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('age', 'Edad', 'number'),
    ];

    clone = () => ReservationDetailAge;
}
