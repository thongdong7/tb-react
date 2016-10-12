export function executeReducersArray(reducers, state) {
  for (let reducer of reducers) {
    state = reducer(state)
  }

  return state
}

export default class Store {
  constructor(actions) {
    this.actions = actions
    this.state = undefined
    this.subscribers = []
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

  dispatch = (action, ...args) => {
    const reducers = this.actions[action.name](...args)
    this.state = executeReducersArray(reducers, this.state)
    for (const callback of this.subscribers) {
      callback(this.state)
    }
  }
}
