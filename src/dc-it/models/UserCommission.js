import Model from '@/dc-it/models/Model'
import Relation from '@/dc-it/types/Relation'
import PaymentMethod from '@/dc-it/models/PaymentMethod'
import Field from '@/dc-it/types/Field'

export default class UserCommission extends Model {
    endpoint = 'user_commissions'

    related = ['payment_method']

    fields = [
      new Field('user_id', 'Usuario').hide(),
      new Relation('payment_method', 'Método de pago', PaymentMethod, 'name'),
      new Field('percentage', 'Porcentaje', 'number').applySuffix('%'),
    ];

    clone = () => UserCommission
}
