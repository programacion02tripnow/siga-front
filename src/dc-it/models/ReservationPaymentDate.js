import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
<<<<<<< HEAD
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import PaymentMethodAdditionalField from '@/dc-it/models/PaymentMethodAdditionalField'
import CustomerPhone from '@/dc-it/models/CustomerPhone'
=======
>>>>>>> af2bb6388aad9f76dece528ca55cfa1b7756c3d9

export default class ReservationPaymentDate extends Model {
    endpoint = 'reservation_payment_dates'

    related = []

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('amount', 'Monto', 'number'),
      new Field('date', 'Fecha', 'date'),

    ];

    clone = () => ReservationPaymentDate;
}
