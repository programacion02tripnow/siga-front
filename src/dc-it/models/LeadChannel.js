import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class LeadChannel extends Model {
    endpoint = 'lead_channels';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
    ];

    clone = () => LeadChannel;
}
