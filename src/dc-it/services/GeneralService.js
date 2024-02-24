import axios from '@axios'

export default class GeneralService {
  static instance;

  url = '/api/';

  // auth = AuthService.getInstance();

  // headers;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GeneralService()
    }
    return this.instance
  }

  async all(endpoint, page = 1) {
    try {
      const response = await axios.get(`${this.url}${endpoint}?page=${page}`)
      return response.data
    } catch (e) {
      throw (e.response.data)
    }
  }

  async save(endpoint, data = {}) {
    try {
      const url = `${this.url}${endpoint}${data.id ? `/${data.id}` : ''}`
      let response
      if (data.id) {
        response = await axios.put(url, data)
      } else {
        response = await axios.post(url, data)
      }

      return response.data
    } catch (e) {
      return e.response.data
    }
  }

  async filter(endpoint, filter, related) {
    const url = `${this.url}${endpoint}/filter/${related}`
    try {
      const response = await axios.post(url, filter)
      return response.data
    } catch (e) {
      throw (e.response.data)
    }
  }

  async download(endpoint, data) {
    const url = `${this.url}${endpoint}`
    try {
      const response = await axios.post(url, data, {
        responseType: 'blob',
      })
      return response.data
    } catch (e) {
      throw (e.response.data)
    }
  }

  async delete(endpoint, id) {
    const url = `${this.url}${endpoint}/${id}`

    try {
      const response = await axios.delete(url)
      return response.data
    } catch (e) {
      throw (e.response.data)
    }
  }

  async wallet(endpoint, id, payload) {
    const url = `${this.url}${endpoint}/${id}`

    try {
      const response = await axios.post(url, payload)
      return response.data
    } catch (e) {
      throw (e.response.data)
    }
  }
}
