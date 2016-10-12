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
  ])
}

export const visibilityFilterActions = {
  // This action only has one reducer
  setVisibilityFilter: (filter) => state => filter
}

export default {
  // Combine actions
  todos: todoActions,
  visibilityFilter: visibilityFilterActions
}
