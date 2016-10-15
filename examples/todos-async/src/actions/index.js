import {
//  AsyncAction,
  FetchAction,
  ReducerListAppend, ReducerListConcat, ReducerListMatchChange,
  ReducerSet,
} from '../../../../lib/simple-redux'

let nextTodoId = 0

export const loadingActions = {
  setLoading: ReducerSet()
}

//console.log(FetchAction);


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
//  load: AsyncAction(dispatch => () => {
//    console.log('async load');
//    dispatch(loadingActions.setLoading, true)
//    fetch('https://api.github.com/users').then(
//      response => response.json().then(data => {
//        console.log('data', data);
//        const texts = data.map(item => item.login)
////        data.forEach(item => dispatch(todoActions.addTodo, item.login))
//        dispatch(todoActions.addTodos, texts)
//        dispatch(loadingActions.setLoading, false)
//      })
//    )
//  }),
  load: FetchAction(() => ({
    url: "https://api.github.com/users",
    start: (dispatch) => dispatch(loadingActions.setLoading, true),
    success: (dispatch, data) => {
      const texts = data.map(item => item.login)
      dispatch(todoActions.addTodos, texts)
      dispatch(loadingActions.setLoading, false)
    },
    error: (dispatch) => {},
  }))
}

export const visibilityFilterActions = {
  // This action only has one reducer
  setVisibilityFilter: ReducerSet()
}

export const repositoryActions = {
//  load: FetchAction("https://api.github.com/users", {
//    start: (dispatch) => dispatch(loadingActions.setLoading, true),
//    success: (dispatch, data) => {
//      const texts = data.map(item => item.login)
//      dispatch(todoActions.addTodos, texts)
//      dispatch(loadingActions.setLoading, false)
//    },
//    error: (dispatch) => {},
//  })
}

export default {
  // Combine actions
  todos: [todoActions, []],
  visibilityFilter: [visibilityFilterActions, 'SHOW_ALL'],
  loading: [loadingActions, false],
  repositories: [repositoryActions, []],
}
