import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'

export default class Provider extends Model {
    endpoint = 'providers';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new Field('balance', 'Saldo en monedero virtual').hide(),
      new Field('bank', 'Banco').hide(),
      new Field('business_name', 'Razón social'),
      new Field('RFC', 'RFC').hide(),
      new Field('clabe', 'Clabe interbancaria').hide(),
      new Field('notification_mail', 'Correo electrónico'),
      new Field('contact_name', 'Nombre de contacto'),
      new Field('phone', 'Teléfono', 'tel'),
      new BooleanField('has_hotels', 'Reserva de hoteles').hide(),
      new BooleanField('has_tours', 'Reserva de tours').hide(),
      new BooleanField('has_car_rentals', 'Renta de coches').hide(),
      new BooleanField('has_pickups', 'Traslados').hide(),
      new BooleanField('has_flights', 'Vuelos').hide(),
    ];

    clone = () => Provider;
}
