import invariant from 'invariant'
import Promise from 'promise'

import {StopDispatchException} from '../error'

//export function FetchAction(url, options={}) {
//  options.start && invariant(typeof options.start === 'function', `FetchAction.options.start must be a function`)
//
//  options.success && invariant(typeof options.success === 'function', `FetchAction.options.success must be a function`)
//
//  options.error && invariant(typeof options.error === 'function', `FetchAction.options.error must be a function`)

export function FetchAction(fn) {
  return {
    _action: true,
    _fetch: fn
  }
}

function isFetchAction(data) {
  return data._action === true && typeof data._fetch === 'function'
}

class MiddlewareFetch {
  couldHandle(action) {
    return action._fetch !== undefined
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
