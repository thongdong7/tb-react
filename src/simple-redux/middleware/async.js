import {StopDispatchException} from '../error'

function isAsyncAction(data) {
  return data.async !== undefined
}

function getAsyncFunction(data) {
  return data.async
}

export default function asyncActionMiddleware(dispatch, fn, ...args) {
//  console.log('async middle ware');
  if (isAsyncAction(fn)) {
    console.log('process async action');
//      console.log('is async', fn);
    fn = getAsyncFunction(fn)
    fn(dispatch)(...args)

    throw new StopDispatchException()
  }
}
