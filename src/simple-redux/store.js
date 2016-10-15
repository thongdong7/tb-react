import {StopDispatchException} from './error'
import IdDict from './iddict'

import isPlainObject from 'lodash/isPlainObject'
import invariant from 'invariant'


function executeReducers(reducers, state) {
  if (reducers.constructor === Array) {
    return executeReducersArray(reducers, state)
  } else {
    return executeReducersArray([reducers], state)
  }
}

export function executeReducersArray(reducers, state) {
  for (let reducer of reducers) {
    invariant(typeof reducer === 'function', `Reducer must be function. Got ${reducer}`)
    state = reducer(state)
  }

  return state
}

function isActionObject(action) {
  return action._action === true
}

function getActionName(action) {
  return action._name || action.name || action
}

function buildFnMap(actions, isAction) {
  let ret = new IdDict()

  for (const field in actions) {
    const action = actions[field]
//    console.log('field', field, action);

    if (isAction(action)) {
//      console.log('found actions', action);
      ret.put(action, [])
    } else {
      const tmpMap = buildFnMap(action, isAction)
      for (const fn of tmpMap.keys()) {
        invariant(!ret.has(fn), `Could not map action for field ${field} as had another action with the same function: ${fn}`)
        ret.put(fn, [field, ...tmpMap.get(fn)])
      }
    }
//    continue
//    if (typeof action === 'function') {
//      invariant(ret[action] === undefined, 'Could not map action for field ${field} as had another action with the same function')
//      ret[action] = []
//    } else if (isPlainObject(action)) {
//      if (isActionObject(action)) {
////        console.log('action object', field);
//        ret[action] = []
//      } else {
////        console.log('buildFnMap', field, action);
//        const tmpMap = buildFnMap(action)
//        for (const fn in tmpMap) {
//          invariant(ret[fn] === undefined, `Could not map action for field ${field} as had another action with the same function: ${fn}`)
//          ret[fn] = [field, ...tmpMap[fn]]
//        }
//      }
//    } else {
//      console.log('action is not plain object', field, action);
//    }
  }

  return ret
}

export default function createStore(actions, ...middlewares) {
  function isAction(action) {
    const isMiddlewareAction = middlewares.some(m => m.couldHandle(action))
    return isMiddlewareAction || typeof action === 'function'
  }

  const fnMap = buildFnMap(actions, isAction)
//  console.log(fnMap);
//  return
  let subscribers = []
  let state = undefined

  function subscribe(callback) {
    if (subscribers.indexOf(callback) >= 0) {
      console.error('subscribe too much times.');
    } else {
      subscribers.push(callback)

      return () => {
        let index = subscribers.indexOf(callback);
        if (index > -1) {
          subscribers.splice(index, 1)
        }
      }
    }
  }

  function getState() {
    return state
  }

  function findChildState(state, fn) {
    const paths = fnMap.get(fn)
    console.log('path', fn, paths);
    if (!paths) {
      return state
    }

    for (const field of paths) {
      if (state) {
        state = state[field]
      }
    }
    return state
  }


  function updateChildState(state, paths, newChildState) {
    if (!paths || paths.length == 0) {
      return newChildState
    }

    const head = paths[0]
    const tail = paths.slice(1)
  //  console.log('tail', tail);

    const headState = state ? state[head] : undefined

    return {
      ...state,
      [head]: updateChildState(headState, tail, newChildState)
    }
  }

  function dispatch(fn, ...args) {
//    console.log('dispatch');
    for (const middleware of middlewares) {
//      console.log('middleware', middleware);
//      console.log(dispatch);
//      console.log(fn);
      if (!middleware.couldHandle(fn)) {
        continue
      }

      try {
        middleware.apply(dispatch, fn, ...args)
      } catch (e) {
        if (e instanceof StopDispatchException) {
          return
        }

        throw e
      }
    }

    invariant(typeof fn === 'function', 'Could not dispatch a non-function. Ensure that dispatch is called as dispatch(fn, ...args)')

    // Get reducers
//    console.log(fn.name);
    const reducers = fn(...args)

    // Find `state child` by fn
    let childState = findChildState(state, fn)
//    console.log('child state', childState);

    // Reduce `state child`
    childState = executeReducers(reducers, childState)
//    console.log('new child state', childState);

    // Update `state child`
    state = updateChildState(state, fnMap.get(fn), childState)

    for (const callback of subscribers) {
//      console.log('callback', callback, state);
      callback(state)
    }
//    console.log('dispatch complete');
  }

  return {
    getState,
    dispatch,
    subscribe
  }
}
