import {AsyncAction, ReducerListAppend, ReducerListConcat, ReducerListMatchChange, ReducerSet} from '../../../../lib/simple-redux'

let nextTodoId = 0

export const loadingActions = {
  setLoading: loading => state => loading
}


export const todoActions = {
  addTodo: (text) => ReducerListAppend({id: nextTodoId++, text, completed: false}),
  addTodos: (texts) => {
    const items = texts.map((text, i) => ({id: nextTodoId + i, text, completed: false}))
    nextTodoId += items.length
    return ReducerListConcat(items)
  },
  toggleTodo: (id) => ReducerListMatchChange(
    t => t.id === id,
    t => ({...t, completed: !t.completed})
  ),
  load: AsyncAction(dispatch => () => {
    console.log('async load');
    dispatch(loadingActions.setLoading, true)
    fetch('https://api.github.com/users').then(
      response => response.json().then(data => {
        console.log('data', data);
        const texts = data.map(item => item.login)
//        data.forEach(item => dispatch(todoActions.addTodo, item.login))
        dispatch(todoActions.addTodos, texts)
        dispatch(loadingActions.setLoading, false)
      })
    )
  })
}

export const visibilityFilterActions = {
  // This action only has one reducer
  setVisibilityFilter: ReducerSet
}

export default {
  // Combine actions
  todos: todoActions,
  visibilityFilter: visibilityFilterActions,
  loading: loadingActions
}
