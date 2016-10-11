import React, {Component} from 'react';
import logo from './logo.svg';

//styles
import './App.less';
import './App.scss';
import './App.styl';
import styles from './Modules.css';

class Store {
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

let nextTodoId = 0
const actions = {
  addTodo: (text) => ([
    // reducers for completeTodo
    (state=[]) => ([...state, {id: nextTodoId++, text, completed: false}])
  ]),
  toggleTodo: (id) => ([
    (state=[]) => state.map(t => {
        if (t.id !== id) {
          return t
        } else {
          return {...t, completed: !t.completed}
        }
      })
  ])
}

let store = new Store()
import invariant from 'invariant'

function connect(Comp) {
  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
  //    this.version = version
//      this.store = props.store || context.store
      this.store = store

      invariant(this.store,
        `Could not find "store" in either the context or ` +
        `props`
      )

      const storeState = this.store.getState()
      this.state = { storeState }
  //    this.clearCache()
    }

    componentWillMount() {
      console.log('subscribe');
      this.unsubscribe = store.subscribe(this.storeStateChanged)
    }

    componentWillUnmount() {
      console.log('unsubscribe');
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }

    storeStateChanged = () => {
      console.log('store changed', this.store.getState());
    }

    render() {
      console.log('connect props', this.props, Comp);
      return (
        <Comp />
      )
    }
  }

  return Connect
}

class _App extends Component {
  addTodo = () => {
    console.log('add todo');
    store.dispatch(actions.addTodo("Hello"))
  }

  render() {
    return (
      <div className="App">
        app
        <button onClick={this.addTodo}>Add</button>
      </div>
    )
  }
}

const App = connect(_App)

class MyApp extends Component {
  render() {
    return (
      <div>
        My App
        <App />
      </div>
    )
  }
}

export default MyApp;
