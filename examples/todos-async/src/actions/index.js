import {AsyncAction} from '../../../../lib/simple-redux'

let nextTodoId = 0

export const todoActions = {
  addTodo: (text) => ([
    // reducers for addTodo
    (state=[]) => ([...state, {id: nextTodoId++, text, completed: false}])
  ]),
  toggleTodo: (id) => ([
    // reducers for toggleTodo
    (state=[]) => state.map(t => {
        if (t.id !== id) {
          return t
        } else {
          return {...t, completed: !t.completed}
        }
      })
  ]),
  load: AsyncAction(dispatch => () => {
    console.log('async load');
    fetch('https://api.github.com/users').then(
      response => response.json().then(data => {
        console.log('data', data);
        data.forEach(item => dispatch(todoActions.addTodo, item.login))
      })
    )
  })
}

export const visibilityFilterActions = {
  // This action only has one reducer
  setVisibilityFilter: (filter) => state => filter
}

export default {
  // Combine actions
  todos: todoActions,
  visibilityFilter: visibilityFilterActions,

}
