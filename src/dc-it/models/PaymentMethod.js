import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import PaymentMethodAdditionalField from '@/dc-it/models/PaymentMethodAdditionalField'

export default class PaymentMethod extends Model {
    endpoint ='payment_methods';

    related = ['payment_method_additional_fields']

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      // new BooleanField('requires_auth', '¿Requiere autenticación?'),
      new MultipleRelation('payment_method_additional_fields', 'Campos adicionales', PaymentMethodAdditionalField).hide().noFilterable(),
    ]

    clone = () => PaymentMethod
}
