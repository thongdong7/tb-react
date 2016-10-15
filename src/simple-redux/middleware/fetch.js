import invariant from 'invariant'

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

export function middlewareFetch(dispatch, fn, ...args) {
  if (isFetchAction(fn)) {
    const {url, options} = fn._fetch
//    console.log('fetch action', url, options);
    if (options.start) {
      invariant(typeof options.start === 'function', `FetchAction.options.start must be a function. ${typeof options.start} is provided`)

      options.start(dispatch)
    }

    fetch(url).then(
      response => response.json().then(data => {
//        console.log('data', data);
        if (options.success) {
          options.success(dispatch, data)
        }
      })
    )
    
    throw new StopDispatchException()
  }
}