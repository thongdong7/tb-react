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

export default class Store {
  constructor(actions) {
    this.actions = actions
    this.state = undefined
    this.subscribers = []

    this.fnMap = buildFnMap(actions)
  }

  subscribe = (callback) => {
    if (this.subscribers.indexOf(callback) >= 0) {
      console.error('subscribe too much times.');
    } else {
      this.subscribers.push(callback)

      return () => {
        let index = this.subscribers.indexOf(callback);
        if (index > -1) {
          this.subscribers.splice(index, 1)
        }
      }
    }
  }

  getState() {
    return this.state
  }

  findChildState = (state, fn) => {
    const paths = this.fnMap[fn]
    for (const field of paths) {
      if (state) {
        state = state[field]
      }
    }
    return state
  }


  updateChildState = (state, paths, newChildState) => {
    if (paths.length == 0) {
      return newChildState
    }

    const head = paths[0]
    const tail = paths.slice(1)
  //  console.log('tail', tail);

    const headState = state ? state[head] : undefined

    return {
      ...state,
      [head]: this.updateChildState(headState, tail, newChildState)
    }
  }

  dispatch = (fn, ...args) => {
    invariant(typeof fn === 'function', 'Could not dispatch a non-function. Ensure that dispatch is called as dispatch(fn, ...args)')

    // Get reducers
    const reducers = fn(...args)

    // Find `state child` by fn
    let childState = this.findChildState(this.state, fn)
//    console.log('child state', childState);

    // Reduce `state child`
    childState = executeReducers(reducers, childState)
//    console.log('new child state', childState);

    // Update `state child`
    this.state = this.updateChildState(this.state, this.fnMap[fn], childState)
//    console.log('new state', this.state, this.fnMap[fn]);

    for (const callback of this.subscribers) {
      callback(this.state)
    }

    return this.state
  }
}
