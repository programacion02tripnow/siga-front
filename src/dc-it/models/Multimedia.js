import Model from './Model'
import Field from '../types/Field'
import Select from '../types/Select'

export default class Multimedia extends Model {
    endpoint = 'multimedia';

    types = {
      image: 'Imagen',
      video: 'Vídeo',
      document: 'Documento',
    };

    fields = [
      new Field('id', 'Código', 'number'),
      new Field('filename', 'Texto alterno'),
      new Field('file_url', 'URL de Acceso'),
      new Select('type', 'Tipo', this.types, 'image'),
      new Field('is_local', 'Archivo local', 'checkbox'),
    ];

    clone = () => Multimedia;
}
