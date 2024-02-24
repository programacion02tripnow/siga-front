import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class FlightReservationFlightAdditionalService extends Model {
    endpoint = 'flight_reservation_flight_additional_services';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
    ];

    clone = () => FlightReservationFlightAdditionalService;
}
