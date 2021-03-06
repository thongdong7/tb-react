import invariant from 'invariant'
import Promise from 'promise'
import 'whatwg-fetch'
import {api} from './core'
import {buildUrl} from '../data'

import {StopDispatchException} from '../simple-redux/error'

export function APIAction(fn) {
  return {
    _action: true,
    _api: fn
  }
}

function isFetchAction(data) {
  return data && data._action === true && typeof data._api === 'function'
}

export class MiddlewareAPI {
  constructor(options={}){
    this.options = options
    this.fetchOptions = options.session ? {credentials: 'include'} : {}
  }

  couldHandle(action) {
    return action && action._api !== undefined
  }

  apply(dispatch, action, ...args) {
    if (isFetchAction(action)) {
      const fn = action._api
      const {url, params={}, success, error, start} = fn(...args)
  //    console.log('fetch action', url, options);
      if (start) {
        invariant(typeof start === 'function', `APIAction.options.start must be a function. ${typeof start} is provided`)

        start(dispatch)
      }

      const requestUrl = api.host + buildUrl(url, params)

      const p = new Promise(
        (resolve, reject) => {
          fetch(requestUrl, this.fetchOptions).then(
            response => {
              const ok = response.status == 200

              // TODO Handle case when could not convert response to json
              response.json().then(data => {
        //        console.log('data', data);
                if (ok && success) {
                  success(dispatch, data)
                }

                if (!ok && error) {
                  if (this.options.error) {
                    // Handle
                    this.options.error(dispatch, data, response.status)
                  }

                  error(dispatch, data)
                }

                resolve(data)
              })
            }
          )
        }
      )


      return new StopDispatchException(p)
    }
  }
}

export const middlewareAPI = new MiddlewareAPI()
