import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import ModulePermission from '@/dc-it/models/ModulePermission'

export default class Module extends Model {
    endpoint = 'modules';

    related = ['module_permissions']

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new MultipleRelation('module_permissions', 'Permisos', ModulePermission).hide().noFilterable(),

    ];

    clone = () => Module;
}
