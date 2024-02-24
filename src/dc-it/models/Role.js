import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class Role extends Model {
    endpoint = 'roles';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
    ];

    clone = () => Role;
}
