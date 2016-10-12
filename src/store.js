export function executeReducersArray(reducers, state) {
  for (let reducer of reducers) {
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
//    this.state = undefined
    this.state = {}
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

  dispatch1 = (action, ...args) => {
    const reducers = this.actions[action.name](...args)
    this.state = executeReducersArray(reducers, this.state)
    for (const callback of this.subscribers) {
      callback(this.state)
    }
  }

  findChildState = (state, fn) => {
    const paths = this.fnMap[fn]
    for (const field of paths) {
      state = state[field]
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

    return {
      ...state,
      [head]: this.updateChildState(state[head], tail, newChildState)
    }
  }

  dispatch = (fn, ...args) => {
    const fnName = fn.name
    console.log('name', fnName);

    // Find reducers
  //  console.log('fn', fn);
    const reducers = fn(...args)
  //  console.log('reducers', reducers);

    // Find path

    // Find `state child` by fn name
    let childState = this.findChildState(this.state, fn)
    console.log('child state', childState);

    // Reduce `state child`
    childState = executeReducersArray(reducers, childState)
    console.log('new child state', childState);

    // Update `state child`
    this.state = this.updateChildState(this.state, this.fnMap[fn], childState)
    console.log('new state', this.state);

    return this.state
  }
}
