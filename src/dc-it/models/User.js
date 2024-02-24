import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import PasswordInput from '@/dc-it/types/PasswordInput'
import Relation from '@/dc-it/types/Relation'
import Role from '@/dc-it/models/Role'
import Multimedia from '@/dc-it/models/Multimedia'
import MultipleMultimedia from '@/dc-it/types/MultipleMultimedia'

export default class User extends Model {
    endpoint = 'users'

    related = ['role', 'multimedia']

    actions = [
      {
        class: 'btn-secondary',
        disabled() {
          return false
        },
        text: 'Comisiones',
        icon: 'SlidersIcon',
        action: 'commissionSettings',
        params(model) {
          return {
            id: model.getAttr('id'),
          }
        },
      },
    ]

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new MultipleMultimedia('multimedia', 'Foto de perfil', [], Multimedia).setLimit(1).hide(),
      new Relation('role', 'Rol', Role, 'name'),
      new Field('username', 'Correo electrónico'),
      new PasswordInput('password', 'Contraseña').hide(),
      new Field('first_name', 'Nombre(s)'),
      new Field('last_name', 'Apellido(s)'),
      new Field('phone', 'Teléfono', 'tel').hide(),
      new Field('birthday', 'Fecha de nacimiento', 'date').hide(),
      new Field('hotels_commission', 'Comisión de hoteles', 'number').hide(),
      new Field('tours_commission', 'Comisión de tours', 'number').hide(),
      new Field('car_rentals_commission', 'Comisión de renta de autos', 'number').hide(),
      new Field('pickups_commission', 'Comisión de traslados', 'number').hide(),
      new Field('flights_commission', 'Comisión de vuelos', 'number').hide(),
    ];

    clone = () => User;
}
