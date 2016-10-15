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

function isActionConfig(data) {
  return data.length === 2
}


function buildFnMap(config, isAction, state) {
  let fnMap = new IdDict()

  if (isActionConfig(config)) {
    let [action, initState] = config
    state = initState

    const [tmpMap, _] = buildFnMap(action, isAction)
    for (const fn of tmpMap.keys()) {
      invariant(!fnMap.has(fn), `Could not map action as had another action with the same function: ${fn}`)
      fnMap.put(fn, tmpMap.get(fn))
    }
  } else {
    for (const field in config) {
      if (state == undefined) {
        state = {}
      }
      const childConfig = config[field]
      let action
      let initState
      if (isActionConfig(childConfig)) {
        [action, initState] = childConfig
        state[field] = initState
  //      console.log('init field', field, initState);

      } else {
        action = childConfig
      }

      if (isAction(action)) {
  //      console.log('found actions', action);
        fnMap.put(action, [])
  //      state[field] = undefined
      } else {
  //      console.log('field', field);
        const [tmpMap, _] = buildFnMap(action, isAction)
  //      state[field] = tmpRet.state
        for (const fn of tmpMap.keys()) {
          invariant(!fnMap.has(fn), `Could not map action for field ${field} as had another action with the same function: ${fn}`)
          fnMap.put(fn, [field, ...tmpMap.get(fn)])
        }
      }
    }
  }

  return [
    fnMap,
    state
  ]
}

export default function createStore(actions, ...middlewares) {
  function isAction(action) {
    const isMiddlewareAction = middlewares.some(m => m.couldHandle(action))
    return isMiddlewareAction || typeof action === 'function'
  }

  const mapResult = buildFnMap(actions, isAction, undefined)
  const fnMap = mapResult[0]
  let state = mapResult[1]
//  console.log(fnMap);
//  return
  let subscribers = []
//  let state = undefined

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
//    console.log('path', fn, paths);
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
