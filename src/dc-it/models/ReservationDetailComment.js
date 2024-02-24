import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
<<<<<<< HEAD
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import PaymentMethodAdditionalField from '@/dc-it/models/PaymentMethodAdditionalField'
import CustomerPhone from '@/dc-it/models/CustomerPhone'
=======
>>>>>>> af2bb6388aad9f76dece528ca55cfa1b7756c3d9

export default class ReservationDetailComment extends Model {
    endpoint = 'reservation_detail_comments'

    related = ['user']

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('comment', 'Comentario'),
      new Relation('user', 'Usuario', User, 'first_name').hide(),

    ];

    clone = () => ReservationDetailComment;
}
