import React, {Component} from 'react';
//import logo from './logo.svg';

//styles
//import './App.less';
//import './App.scss';
//import './App.styl';
//import styles from './Modules.css';

import Store from '../../../lib/store'

let nextTodoId = 0
const actions = {
  todos: {
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
  },
  visibilityFilter: {
    setVisibilityFilter: (filter) => state => filter
  }
}

let store = new Store(actions)
import invariant from 'invariant'

const emptyProps = (state) => ({})

const connect = (stateToProps=emptyProps) => (Comp) => {
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
//      console.log('store state', this.state);
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
      const storeState = stateToProps(this.store.getState())
//      console.log('props', storeState, typeof storeState);
      this.setState({storeState})
    }

    render() {
//      console.log('connect props', this.props);
      return (
        <Comp {...this.state.storeState} />
      )
    }
  }

  return Connect
}

class _App extends Component {
  addTodo = () => {
    console.log('add todo');
    store.dispatch(actions.todos.addTodo, "Hello")
  }

  changeVisibility(filter) {
    store.dispatch(actions.visibilityFilter.setVisibilityFilter, filter)
  }

  toggleTodo(id) {
    store.dispatch(actions.todos.toggleTodo, id)
  }

  render() {
    const {todos=[]} = this.props
    console.log('todos', this.props);
    return (
      <div className="App">
        app
        <button onClick={this.addTodo}>Add</button>
        <button onClick={() => this.changeVisibility('SHOW_ALL')}>Show All</button>
        <button onClick={() => this.changeVisibility('SHOW_ACTIVE')}>Active</button>
        <button onClick={() => this.changeVisibility('SHOW_COMPLETED')}>Completed</button>
        <ul>
          {todos.map((t, idx) => {
            return (
              <li
                key={idx}
                style={{
                  textDecoration: t.completed ? 'line-through' : 'none'
                }}
                onClick={() => this.toggleTodo(t.id)}
              >{t.id} {t.text}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}

const App = connect(({todos, visibilityFilter}) => {
  let retTodos
  if (visibilityFilter === 'SHOW_COMPLETED') {
    retTodos = todos.filter(t => t.completed)
  } else if (visibilityFilter === 'SHOW_ACTIVE') {
    retTodos = todos.filter(t => !t.completed)
  } else {
    retTodos = todos
  }

  return {
    todos: retTodos,
    visibilityFilter
  }
})(_App)

class MyApp extends Component {
  render() {
    return (
      <div>
        My App1
        <App />
      </div>
    )
  }
}

export default MyApp;
