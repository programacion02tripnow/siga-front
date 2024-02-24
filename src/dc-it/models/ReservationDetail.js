import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import Relation from '@/dc-it/types/Relation'
import Provider from '@/dc-it/models/Provider'
import BooleanField from '@/dc-it/types/BooleanField'
import HTMLField from '@/dc-it/types/HTMLField'

export default class ReservationDetail extends Model {
    endpoint = 'reservation_details';

    fields = [
      new Field('id', 'Código').disabled().noFilterable(),
      new Field('public_price', 'Precio público'),
      new Field('net_price', 'Precio neto'),
      new Relation('provider', 'Proveedor', Provider),
      new BooleanField('cancellable', 'Cancelable'),
      new BooleanField('editable', 'Editable'),
      new BooleanField('refundable', 'Reembolsable'),
      new HTMLField('terms_conditions', 'Términos y condiciones'),
      new Field('provider_confirmation_number', 'Número de confirmación de proveedor'),
    ]

    clone = () => ReservationDetail;
}
