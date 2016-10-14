import {StopDispatchException} from './error'
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

function buildFnMap(actions) {
  let ret = {}
  for (const field in actions) {
    const action = actions[field]
    if (typeof action === 'function') {
      ret[action] = []
    } else {
      const tmpMap = buildFnMap(action)
      for (const fn in tmpMap) {
        ret[fn] = [field, ...tmpMap[fn]]
      }
    }
  }

  return ret
}

export default function createStore(actions, ...middlewares) {
  const fnMap = buildFnMap(actions)
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
    const paths = fnMap[fn]
    for (const field of paths) {
      if (state) {
        state = state[field]
      }
    }
    return state
  }


  function updateChildState(state, paths, newChildState) {
    if (paths.length == 0) {
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

      try {
        middleware(dispatch, fn, ...args)
      } catch (e) {
        if (e instanceof StopDispatchException) {
          return
        }

        throw e
      }
    }

    invariant(typeof fn === 'function', 'Could not dispatch a non-function. Ensure that dispatch is called as dispatch(fn, ...args)')

    // Get reducers
    const reducers = fn(...args)

    // Find `state child` by fn
    let childState = findChildState(state, fn)
//    console.log('child state', childState);

    // Reduce `state child`
    childState = executeReducers(reducers, childState)
//    console.log('new child state', childState);

    // Update `state child`
    state = updateChildState(state, fnMap[fn], childState)
//    console.log('new state', this.state, this.fnMap[fn]);

    for (const callback of subscribers) {
      callback(state)
    }
  }

  return {
    getState,
    dispatch,
    subscribe
  }
}
