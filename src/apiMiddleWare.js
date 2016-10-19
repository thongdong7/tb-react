import invariant from 'invariant'
import Promise from 'promise'
import 'whatwg-fetch'
import api from './api'
import {buildUrl} from './data'

import {StopDispatchException} from './simple-redux/error'

export function APIAction(fn) {
  return {
    _action: true,
    _api: fn
  }
}

function isFetchAction(data) {
  return data && data._action === true && typeof data._api === 'function'
}

class MiddlewareAPI {
  couldHandle(action) {
    return action && action._api !== undefined
  }

  apply(dispatch, action, ...args) {
    if (isFetchAction(action)) {
      const fn = action._api
      const {url, success, start} = fn(...args)
  //    console.log('fetch action', url, options);
      if (start) {
        invariant(typeof start === 'function', `APIAction.options.start must be a function. ${typeof start} is provided`)

        start(dispatch)
      }

      const requestUrl = api.host + buildUrl(url, {})

      const p = new Promise(
        (resolve, reject) => {
          fetch(requestUrl).then(
            response => response.json().then(data => {
      //        console.log('data', data);
              if (success) {
                success(dispatch, data)
              }

              resolve(data)
            })
          )
        }
      )


      return new StopDispatchException(p)
    }
  }
}

export const middlewareAPI = new MiddlewareAPI()