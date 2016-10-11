export default class Store {
  constructor() {
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

  dispatch = (reducers) => {
    let state = this.state
    for (let reducer of reducers) {
      state = reducer(state)
    }

//    console.log(state)
    this.state = state
    for (const callback of this.subscribers) {
      callback(this.state)
    }
  }
}
