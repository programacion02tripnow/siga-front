import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'

export default class CarRentalAddon extends Model {
    endpoint = 'car_rental_addons';

    related = [];

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('name', 'Nombre'),
      new Field('public_price', 'Precio público', 'number'),
      new Field('net_price', 'Precio neto', 'number'),
    ]

    clone = () => CarRentalAddon;
}
