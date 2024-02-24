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

export default class FlightReservationFlightAddon extends Model {
    endpoint = 'flight_reservation_flight_addons';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new Field('quantity', 'Cantidad'),
      new Field('public_price', 'Precio público', 'number'),
      new Field('net_price', 'Precio neto', 'number'),
    ];

    clone = () => FlightReservationFlightAddon;
}
