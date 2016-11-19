import {loadData} from '../data'

class API {
  constructor() {
    this._host = null

    // Turn off this to avoid cross domain error for API which not support session.
    this._useSession = true;
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

  set useSession(value) {
    this._useSession = value
  }

  get options() {
    if (this._useSession) {
      return {credentials: 'include'}
    } else {
      return {}
    }
  }

  load = (url, params) => {
    return loadData(this.host + url, params, this.options)
  }
}

export const api = new API()
