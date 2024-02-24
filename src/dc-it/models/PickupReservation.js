import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
<<<<<<< HEAD
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import ModulePermission from '@/dc-it/models/ModulePermission'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import Customer from '@/dc-it/models/Customer'
import BooleanField from '@/dc-it/types/BooleanField'
=======
>>>>>>> af2bb6388aad9f76dece528ca55cfa1b7756c3d9

export default class PickupReservation extends Model {
    endpoint = 'pickup_reservations';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('destination', 'Destino'),
      new Field('pickup', 'Pickup'),
      new Field('pickup_comment', 'Comentario'),
      new Field('datetime', 'Fecha y hora', 'date'),
      new Field('adults_quantity', 'Cantidad de adultos', 'number'),
      new Field('minors_quantity', 'Cantidad de menores', 'number'),
      new Field('type', 'Tipo'),
      new Field('transportation_type', 'Tipo de transportación'),
      new Field('provider_notes', 'Notas del proveedor'),

    ];

    clone = () => PickupReservation;
}
