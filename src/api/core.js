
/**
 * Load data from url
 * @param url
 * @returns {*}
 */
async function loadData(url: string, options={}) {
  // console.log('url', url);
  const response = await fetch(url, options)
//  console.log('response', response);
  if (response.status == 200) {
    return response.json()
  } else {
    let data
    if (response.status == 404) {
      data = await response.json()
    } else {
      data = {
        ok: false,
        message: `Error ${response.status} (${response.statusText}): ${response.body}`
      }
    }

    throw new APIException(data)
  }
}

function buildUrl(url, params) {
  const queryString = objectToQuerystring(params)
  return url + (queryString ? "?" + queryString : "")
}

/**
 * Convert object to query string
 *
 * @param obj
 * @returns {string}
 */
function objectToQuerystring (obj) {
  let tmp = []
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      tmp.push(`${k}=${obj[k]}`)
    }
  }

  return tmp.join('&')
}

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
    // console.log('url', url, typeof(url));
    let fullUrl = this.host
    if (typeof(url) == 'function') {
       fullUrl += url(params)
    } else {
      fullUrl += buildUrl(url, params)
    }

    return loadData(fullUrl, this.options)
  }
}

export const api = new API()
