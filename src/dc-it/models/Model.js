import GeneralService from '../services/GeneralService'
import Paginate from './Paginate'
import helpers from '../services/helpers'

export default class Model {
    fields = [];

    extraData = {};

    endpoint = '';

    filter = [];

    related = [];

    primaryKey = 'id';

    relations = {};

    services;

    actions = [];

    constructor() {
      this.services = GeneralService.getInstance()
    }

    static getFields() {
      return new this().getFields()
    }

    static where(field, operator, value) {
      const instance = new this()
      instance.where(field, operator, value)
      return instance
    }

    static whereHas(field, operator, value) {
      const instance = new this()
      instance.whereHas(field, operator, value)
      return instance
    }

    static whereDoesntHave(field, operator, value) {
      const instance = new this()
      instance.whereDoesntHave(field, operator, value)
      return instance
    }

    static whereMonth(field, value) {
      const instance = new this()
      instance.whereMonth(field, value)
      return instance
    }

    static whereYear(field, value) {
      const instance = new this()
      instance.whereYear(field, value)
      return instance
    }

    static with(relations) {
      const instance = new this()
      instance.with(relations)

      return instance
    }

    static async find(id) {
      const m = new this()
      return m.find(id)
    }

    static async get() {
      const m = new this()
      return m.get()
    }

    static async paginate(page) {
      const i = new this()
      return i.paginate(page)
    }

    async get() {
      const response = await this.services.filter(this.endpoint, { filter: this.filter }, helpers.serialize(this.related))
      const d = []
      if (response.result === 'success') {
        const { data } = response
        data.forEach(m => {
          const instance = new (this.clone())()
          instance.initValues(m)
          d.push(instance)
        })
      }
      return d
    }

    async paginate(page) {
      const response = await this.services.all(`${this.endpoint}/related/${helpers.serialize(this.related)}`, page)
      if (response.result === 'success') {
        const d = []
        const { data } = response
        data.data.forEach(m => {
          const instance = new (this.clone())()
          instance.initValues(m)
          d.push(instance)
        })

        return new Paginate(d, data.current_page, data.last_page, data.per_page, data.total, this.related, this.clone())
      }

      return null
    }

    with(related) {
      if (typeof related === 'string') {
        this.related.push(related)
      } else {
        related.forEach((n, index) => {
          this.related.push(related[index])
        })
      }

      return this
    }

    whereDoesntHave(field, operator, value) {
      this.filter.push({
        function: 'whereDoesntHave',
        field,
        operator,
        value,
      })
    }

    whereHas(field, operator, value) {
      this.filter.push({
        function: 'whereHas',
        field,
        operator,
        value,
      })
    }

    where(field, operator, value) {
      this.filter.push({
        function: 'where',
        field,
        operator,
        value,
      })

      return this
    }

    whereMonth(field, value) {
      this.filter.push({
        function: 'whereMonth',
        field,
        value,
      })

      return this
    }

    whereYear(field, value) {
      this.filter.push({
        function: 'whereYear',
        field,
        value,
      })

      return this
    }

    orWhere(field, operator, value) {
      this.filter.push({
        function: 'orWhere',
        field,
        operator,
        value,
      })

      return this
    }

    initValues(values) {
      Object.getOwnPropertyNames((values)).forEach(val => {
        this.setAttr(val, values[val])
        /* if (typeof values[val] === 'object' && values[val] !== null) {
                    this[val]().initValues(values[val]);
                } else {
                    this.setAttr(val, values[val]);
                } */
      })
      return this
    }

    findField(name = '') {
      return this.fields.find(f => f.name === name)
    }

    setAttr(field, value) {
      const f = this.findField(field)
      if (f) {
        f.setValue(value)
      } else {
        this.extraData[field] = value
      }
    }

    getAttr(field, user = true) {
      const f = this.findField(field)
      let data = false
      if (f) {
        data = user ? f.getUserValue() : f.getValue()
      } else if (this.extraData[field]) {
        data = this.extraData[field]
      }
      return data
    }

    getFields() {
      return this.fields
    }

    getEndpoint() {
      return this.endpoint
    }

    async delete() {
      return this.services.delete(this.endpoint, this.getAttr(this.primaryKey))
    }

    async save() {
      return this.services.save(this.endpoint, this.toJSON())
    }

    toJSON() {
      const result = {}
      this.fields.forEach(f => {
        let value = f.getValue()
        if (Array.isArray(value)) {
          const v = []
          value.forEach(item => {
            if (item instanceof Model) {
              v.push(item.toJSON())
            } else {
              v.push(item)
            }
          })
          value = v
        } else if (typeof value === 'object') {
          if (value != null) {
            if (value instanceof Model) {
              const { primaryKey } = value
              const id = value.getAttr(primaryKey)
              if (id) {
                value = id
              } else {
                value = value.toJSON()
              }
            }
          }
        }
        result[f.name] = value
      })

      return result
    }

    clone = () => Model;
}
