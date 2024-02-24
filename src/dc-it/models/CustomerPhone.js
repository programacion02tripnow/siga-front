import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class CustomerPhone extends Model {
    endpoint = 'customer_phones'

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('phone', 'Teléfono'),
    ];

    clone = () => CustomerPhone;
}
