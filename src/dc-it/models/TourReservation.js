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

export default class TourReservation extends Model {
    endpoint = 'tour_reservations';

    related = []

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('destination', 'Destino'),
      new Field('tour_name', 'Nombre del tour'),
      new Field('package_name', 'Nombre del paquete'),
      new Field('date', 'Fecha', 'date'),
      new Field('adults_quantity', 'Cantidad de adultos', 'number'),
      new Field('minors_quantity', 'Cantidad de menores', 'number'),
      new Field('description', 'Descripción'),

    ];

    clone = () => TourReservation;
}
