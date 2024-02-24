import Model from '@/dc-it/models/Model'
import Field from '@/dc-it/types/Field'
import Relation from '@/dc-it/types/Relation'
import User from '@/dc-it/models/User'
import MultipleRelation from '@/dc-it/types/MutipleRelation'
import CustomerPhone from '@/dc-it/models/CustomerPhone'
import CustomerComment from '@/dc-it/models/CustomerComment'

export default class Customer extends Model {
  endpoint = 'customers'

  related = ['user', 'customer_phones', 'customer_comments']

  fields = [
    new Field('id', 'Código').disabled().noFilterable(),
    new Field('first_name', 'Nombre(s)'),
    new Field('last_name', 'Apellido(s)'),
    new Field('email', 'Correo'),
    new Relation('user', 'Usuario', User, 'first_name').hide().disabled(),
    new MultipleRelation('customer_phones', 'Teléfonos', CustomerPhone, 'phone').hide().noFilterable(),
    new MultipleRelation('customer_comments', 'Comentarios', CustomerComment, 'comment').hide().noFilterable(),
  ];

  getNameWithEmail() {
    return `${this.getAttr('first_name')} ${this.getAttr('last_name')} - ${this.getAttr('email')}`
  }

  clone = () => Customer
}
