import React, {Component} from 'react';
//import logo from './logo.svg';

//styles

import {connect} from '../../../lib/simple-react-redux'
import {todoActions, visibilityFilterActions} from './actions'

const App = ({todos=[], loading, loadData, addTodo, changeVisibility, toggleTodo}) => {
  return (
    <div className="App">
      app {loading && "loading..."}
      <button onClick={loadData}>loadData</button>
      <button onClick={addTodo}>Add</button>
      <button onClick={() => changeVisibility('SHOW_ALL')}>Show All</button>
      <button onClick={() => changeVisibility('SHOW_ACTIVE')}>Active</button>
      <button onClick={() => changeVisibility('SHOW_COMPLETED')}>Completed</button>
      <ul>
        {todos.map((t, idx) => {
          return (
            <li
              key={idx}
              style={{
                textDecoration: t.completed ? 'line-through' : 'none'
              }}
              onClick={() => toggleTodo(t.id)}
            >{t.id} {t.text}</li>
          )
        })}
      </ul>
    </div>
  )
}

const mapStateToProps = ({todos=[], visibilityFilter, loading}) => {
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
    visibilityFilter,
    loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addTodo: () => dispatch(todoActions.addTodo, "Hello"),
    toggleTodo: (id) => dispatch(todoActions.toggleTodo, id),
    changeVisibility: (filter) => dispatch(visibilityFilterActions.setVisibilityFilter, filter),
    loadData: () => dispatch(todoActions.load)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
