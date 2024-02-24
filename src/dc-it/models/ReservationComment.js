import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import UserInfoComponent from '@/views/components/UserInfoComponent.vue'

export default class ReservationComment extends Model {
    endpoint = 'reservation_comments';

    related = ['user.multimedia']

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('comment', 'comment'),
      new Relation('user', 'Agente', User, 'first_name').renderComponent(UserInfoComponent),
      new Field('reservation_id', 'Reserva'),
      new Field('created_at', 'Fecha de creación', 'date').hide(),

    ];

    clone = () => ReservationComment;
}
