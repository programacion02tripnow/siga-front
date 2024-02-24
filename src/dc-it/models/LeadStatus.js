import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'

export default class LeadStatus extends Model {
    endpoint = 'lead_statuses';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new Field('color', 'Color', 'color'),
      new Field('order', 'Orden', 'number'),
      new BooleanField('cancelled_status', 'Estado cancelado'),
    ];

    clone = () => LeadStatus;
}
