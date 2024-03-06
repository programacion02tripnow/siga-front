import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import BooleanField from '@/dc-it/types/BooleanField'
import Relation from '@/dc-it/types/Relation'
import LeadStatus from '@/dc-it/models/LeadStatus'
import User from '@/dc-it/models/User'
import LeadChannel from '@/dc-it/models/LeadChannel'
import LeadComment from './LeadComments'
import MultipleRelation from '@/dc-it/types/MutipleRelation'

export default class Lead extends Model {
  endpoint = 'leads';

  related = ['lead_channel', 'lead_status', 'user', 'lead_comments']

  fields = [
    new Field('id', 'Código').disabled().noFilterable(),
    new Field('first_name', 'Nombre'),
    new Field('last_name', 'Apellido(s)'),
    new Relation('user', 'Ejecutivo', User, 'username').applyMask((_val, model) => `${model.getAttr('first_name')} ${model.getAttr('last_name')}`),
    new Field('email', 'Correo'),
    new Field('phone', 'Teléfono', 'number'),
    new BooleanField('is_agency', 'Agencia').hide(),
    new BooleanField('is_mini_vacs', 'Mini vacs').hide(),
    new Relation('lead_channel', 'Canal de contacto', LeadChannel, 'name'),
    new Field('campaign', 'Campaña'),
    new Field('destination', 'Destino').hide(),
    new Field('desirable_date', 'Fecha deseada de viaje', 'date').hide(),
    new Relation('lead_status', 'Estado', LeadStatus, 'name').applyMask((_val, model) => {
      return '<span class="badge badge-pill" style="color: #000;background: ' + model.getAttr('color') + '">' + _val + '</span>'
    }),
    new MultipleRelation('lead_comments', 'Comentarios', LeadComment, 'comment').hide().noFilterable(),
  ];

  clone = () => Lead;
}
