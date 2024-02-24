import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class ModulePermission extends Model {
    endpoint = 'module_permissions';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
    ];

    clone = () => ModulePermission;
}
