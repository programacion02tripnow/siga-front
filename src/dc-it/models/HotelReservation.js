import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'
import HotelReservationRoom from '@/dc-it/models/HotelReservationRoom'
import MultipleRelation from '@/dc-it/types/MutipleRelation'

export default class HotelReservation extends Model {
    endpoint = 'hotel_reservations';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('destination', 'Destino'),
      new Field('hotel_name', 'Hotel'),
      new Field('hotel_phone', 'Teléfono del hotel'),
      new Field('resort_rate', 'Calificación del hotel', 'number'),
      new Field('sanitation_rate', 'Calificación de higiene', 'number'),
      new Field('check_in', 'Check In', 'date'),
      new Field('check_out', 'Check Out', 'date'),
      new Field('adults_quantity', 'Cantidad de adultos', 'number'),
      new Field('minors_quantity', 'Cantidad de menores', 'number'),
      new Field('meal_plan', 'Plan de comidas'),
      new BooleanField('is_pack', 'Paquete'),
      new MultipleRelation('hotel_reservation_rooms', 'Habitaciones', HotelReservationRoom).setMultiple(),
    ];

    clone = () => HotelReservation;
}
