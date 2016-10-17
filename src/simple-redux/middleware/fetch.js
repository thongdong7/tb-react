import invariant from 'invariant'
import Promise from 'promise'
import 'whatwg-fetch'

import {StopDispatchException} from '../error'

export function FetchAction(fn) {
  return {
    _action: true,
    _fetch: fn
  }
}

function isFetchAction(data) {
  return data && data._action === true && typeof data._fetch === 'function'
}

class MiddlewareFetch {
  couldHandle(action) {
    return action && action._fetch !== undefined
  }

  apply(dispatch, action, ...args) {
    if (isFetchAction(action)) {
      const fn = action._fetch
      const {url, success, start} = fn(...args)
  //    console.log('fetch action', url, options);
      if (start) {
        invariant(typeof start === 'function', `FetchAction.options.start must be a function. ${typeof start} is provided`)

        start(dispatch)
      }

      const p = new Promise(
        (resolve, reject) => {
          fetch(url).then(
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

export const middlewareFetch = new MiddlewareFetch()
