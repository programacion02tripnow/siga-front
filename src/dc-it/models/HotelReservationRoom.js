import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class HotelReservationRoom extends Model {
    endpoint = 'hotel_reservation_rooms';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('room_type', 'Tipo'),
      new Field('public_price', 'Precio público', 'number'),
      new Field('net_price', 'Precio neto', 'number'),
      new Field('special_request', 'Peticiones especiales'),
    ];

    clone = () => HotelReservationRoom;
}
