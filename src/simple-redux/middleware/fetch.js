import invariant from 'invariant'
import Promise from 'promise'

import {StopDispatchException} from '../error'

export function FetchAction(url, options={}) {
  options.start && invariant(typeof options.start === 'function', `FetchAction.options.start must be a function`)

  options.success && invariant(typeof options.success === 'function', `FetchAction.options.success must be a function`)

  options.error && invariant(typeof options.error === 'function', `FetchAction.options.error must be a function`)

  return {
    _action: true,
    _fetch: {
      url,
      options
    }
  }
}

function isFetchAction(data) {
  return data._fetch !== undefined
}

class MiddlewareFetch {
  couldHandle(action) {
    return action._fetch !== undefined
  }

  apply(dispatch, fn, ...args) {
    if (isFetchAction(fn)) {
      const {url, options} = fn._fetch
  //    console.log('fetch action', url, options);
      if (options.start) {
        invariant(typeof options.start === 'function', `FetchAction.options.start must be a function. ${typeof options.start} is provided`)

        options.start(dispatch)
      }

      const p = new Promise(
        (resolve, reject) => {
          fetch(url).then(
            response => response.json().then(data => {
      //        console.log('data', data);
              if (options.success) {
                options.success(dispatch, data)
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
