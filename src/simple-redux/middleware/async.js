import {StopDispatchException} from '../error'

export function AsyncAction(fn) {
//  console.log('this is async action');
  return {
    async: fn
  }
}

function isAsyncAction(data) {
  return data && data.async !== undefined
}

function getAsyncFunction(data) {
  return data.async
}

class MiddlewareAsyncAction {
  couldHandle(action) {
    return isAsyncAction(action)
  }

  apply(dispatch, fn, ...args) {
//    console.log('async apply', fn);
    fn = getAsyncFunction(fn)
    fn(dispatch)(...args)

    return new StopDispatchException()
  }
}

export const middlewareAsyncAction = new MiddlewareAsyncAction()
