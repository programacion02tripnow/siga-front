import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class Company extends Model {
    endpoint = 'companies';

    fields = [
        new Field('id', 'ID').disabled().noFilterable(),
        new Field('name', 'Nombre'),
        new Field('code', 'Codigo'),
        new Field('consecutive', 'Consecutivo'),
    ];

    clone = () => Company;
}
