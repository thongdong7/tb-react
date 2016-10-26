import {loadData} from '../data'

class API {
  constructor() {
    this._host = null
  }

  get host() {
    if (!this._host) {
      throw Error('API host must be config before use. Example: api.host = "http://localhost/api/"')
    }

    return this._host
  }

  set host(value) {
    this._host = value
  }

  load = (url, params) => {
    return loadData(this.host + url, params)
  }
}

export const api = new API()
