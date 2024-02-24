import Model from '@/dc-it/models/Model'
import HTMLField from '@/dc-it/types/HTMLField'

export default class CustomerComment extends Model {
    endpoint = 'customer_comments'

    related = ['user', 'customer_phones']

    fields = [
      // new Field('id', 'Código').disabled().noFilterable(),
      new HTMLField('comment', 'Comentario'),
      // new Relation('user', 'Usuario', User, 'first_name').hide(),

    ];

    clone = () => CustomerComment;
}
