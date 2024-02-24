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

export default class FlightReservationPeople extends Model {
    endpoint = 'flight_reservation_people';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('full_name', 'Nombre'),
      new Field('age', 'Edad', 'number'),
    ];

    clone = () => FlightReservationPeople;
}
