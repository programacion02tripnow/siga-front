import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import ModulePermission from '@/dc-it/models/ModulePermission'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import Customer from '@/dc-it/models/Customer'
import BooleanField from '@/dc-it/types/BooleanField'

export default class FlightReservationFlight extends Model {
    endpoint = 'flight_reservation_flights';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('type', 'Tipo'),
      new Field('departure_city', 'Ciudad de salida'),
      new Field('departure_airport', 'Aeropuerto de salida'),
      new Field('departure_datetime', 'Fecha y hora de salida'),
      new Field('arrive_city', 'Ciudad de llegada'),
      new Field('arrive_airport', 'Aeropuerto de llegada'),
      new Field('arrive_datetime', 'Fecha y hora de llegada'),
      new Field('public_price', 'Precio público', 'number'),
      new Field('net_price', 'Precio neto', 'number'),
    ];

    clone = () => FlightReservationFlight;
}
