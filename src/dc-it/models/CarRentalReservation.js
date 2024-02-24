import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'

export default class CarRentalReservation extends Model {
    endpoint = 'car_rental_reservations';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('pickup', 'Pickup'),
      new Field('datetime_pickup', 'Fecha pickup', 'date'),
      new Field('return_datetime', 'Fecha retorno', 'date'),
      new Field('return', 'Lugar de retorno'),
      new Field('agency_name', 'Nombre de la agencia'),
      new Field('car_category', 'Categoría del auto'),
      new BooleanField('insurance', 'Seguro'),
      new Field('recommendations', 'Recomendaciones'),
    ];

    clone = () => CarRentalReservation;
}
