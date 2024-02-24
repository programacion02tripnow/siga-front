import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'
import Select from '@/dc-it/types/Select'

export default class PaymentMethodAdditionalField extends Model {
    endpoint = 'payment_methods_additional_fields';

    static options = {
      1: 'Campo abierto',
      2: 'Archivo adjunto',
    }

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new Select('type', 'Tipo de campo', PaymentMethodAdditionalField.options, '1'),
      new BooleanField('is_required', '¿Es obligatorio?'),
    ];

    clone=() => PaymentMethodAdditionalField
}
