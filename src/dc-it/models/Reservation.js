import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import Customer from '@/dc-it/models/Customer'
import BooleanField from '@/dc-it/types/BooleanField'
import UserInfoComponent from '@/views/components/UserInfoComponent.vue'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import ReservationDetail from '@/dc-it/models/ReservationDetail'
import ReservationServiceIcons from '@/views/components/ReservationServiceIcons.vue'

export default class Reservation extends Model {
    endpoint = 'reservations';

    related = ['user.multimedia', 'customer', 'cancelled_by', 'reservation_details.reservable', 'edited_by.multimedia']

    fields = [
      new Field('id', 'Código').disabled().noFilterable().hide(),
      new Field('booking_id', 'ID').disabled(),
      new Relation('user', 'Agente creador', User, 'first_name').renderComponent(UserInfoComponent),
      new Relation('edited_by', 'Agente editor', User, 'first_name').renderComponent(UserInfoComponent),
      new Relation('customer', 'Cliente', Customer, 'first_name').applyMask((_val, model) => `${model.getAttr('first_name')} ${model.getAttr('last_name')}`),
      new BooleanField('editable', 'Editable').hide(),
      new BooleanField('cancelable', 'Cancelable').hide(),
      new BooleanField('with_payments', 'Incluye pagos').hide(),
      new Field('cancelled_at', 'Fecha de cancelación', 'date').hide(),
      new Relation('cancelled_by', 'Cancelado por', User, 'first_name').hide(),
      new MultipleRelation('reservation_details', 'Servicios', ReservationDetail).renderComponent(ReservationServiceIcons),
      new Field('status', 'Estado').applyMask(val => {
        if (val.toString() === '0') {
          return '<span class="badge badge-pill badge-light-danger">Cancelado</span>'
        }
        return (val.toString() === '1' ? '<span class="badge badge-pill badge-light-warning">Pendiente de pago</span>' : '<span class="badge badge-pill badge-light-success">Confirmado/Pagado</span>')
      }),
    ];

    clone = () => Reservation;
}
