import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'
import Relation from '@/dc-it/types/Relation'
import LeadStatus from '@/dc-it/models/LeadStatus'
import User from '@/dc-it/models/User'
import LeadChannel from '@/dc-it/models/LeadChannel'

export default class Lead extends Model {
  endpoint = 'leads';

  related = ['lead_channel', 'lead_status', 'user']

  fields = [
    new Field('id', 'Código').disabled().noFilterable(),
    new Field('first_name', 'Nombre'),
    new Field('last_name', 'Apellido(s)'),
    new Field('email', 'Correo'),
    new Field('phone', 'Teléfono', 'number'),
    new BooleanField('is_agency', 'Agencia').hide(),
    new BooleanField('is_mini_vacs', 'Mini vacs'),
    new Relation('lead_channel', 'Canal de contacto', LeadChannel, 'name'),
    new Field('campaign', 'Campaña'),
    new Field('destination', 'Destino').hide(),
    new Field('desirable_date', 'Fecha deseada de viaje', 'date').hide(),
    new Relation('lead_status', 'Estado', LeadStatus, 'name'),
    new Relation('user', 'Usuario', User, 'username').hide(),
  ];

  clone = () => Lead;
}
