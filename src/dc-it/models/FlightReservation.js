import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import ModulePermission from '@/dc-it/models/ModulePermission'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import Customer from '@/dc-it/models/Customer'
import BooleanField from '@/dc-it/types/BooleanField'
import Select from '../types/Select'

export default class FlightReservation extends Model {
    endpoint = 'flight_reservations';

    related = [];

    round_trip = {
      Sencillo: 0,
      Redondo: 1,
    }

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('airline', 'Aerolínea'),
      new Field('PNR', 'PNR'),
      new Select('round', 'Viaje redondo', round_trip),
      new Field('adults_quantity', 'Cantidad de adultos', 'number'),
      new Field('minors_quantity', 'Cantidad de menores', 'number'),
      new Field('migration_text', 'Texto de migración'),
      new Field('general_notes', 'Notas generales'),
      new Field('international_flight_text', 'Texto de vuelo internacional'),
      new Field('national_flight_text', 'Texto de vuelo nacional'),
      new BooleanField('is_pack', 'Paquete'),

    ];

    clone = () => FlightReservation;
}
