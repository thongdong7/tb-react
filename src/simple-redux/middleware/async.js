import {StopDispatchException} from '../error'

export function AsyncAction(fn) {
//  console.log('this is async action');
  return {
    async: fn
  }
}

function isAsyncAction(data) {
  return data.async !== undefined
}

function getAsyncFunction(data) {
  return data.async
}

export function middlewareAsyncAction(dispatch, fn, ...args) {
//  console.log('async middle ware');
  if (isAsyncAction(fn)) {
//    console.log('process async action');
//      console.log('is async', fn);
    fn = getAsyncFunction(fn)
    fn(dispatch)(...args)

    throw new StopDispatchException()
  }
}
