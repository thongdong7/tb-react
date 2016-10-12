import React, {Component} from 'react';
//import logo from './logo.svg';

//styles
//import './App.less';
//import './App.scss';
//import './App.styl';
//import styles from './Modules.css';

import connect from '../../../lib/components/connect'
import {todoActions, visibilityFilterActions} from './actions'

class _App extends Component {
  addTodo = () => {
    console.log('add todo');
    this.props.dispatch(todoActions.addTodo, "Hello")
  }

  changeVisibility(filter) {
    this.props.dispatch(visibilityFilterActions.setVisibilityFilter, filter)
  }

  toggleTodo(id) {
    this.props.dispatch(todoActions.toggleTodo, id)
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

const mapStateToProps = ({todos, visibilityFilter}) => {
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
}

const App = connect(mapStateToProps)(_App)

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

export default App;
