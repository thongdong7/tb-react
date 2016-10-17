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
}

export const visibilityFilterActions = {
  // This action only has one reducer
  setVisibilityFilter: ReducerSet()
}

export const repositoryActions = {
  load: FetchAction(username => ({
    url: `https://api.github.com/users/${username}/repos`,
    start: (dispatch) => dispatch(loadingActions.setLoading, true),
    success: (dispatch, data) => {
      const names = data.map(item => item.name)
      dispatch(repositoryActions.adds, names)
      dispatch(loadingActions.setLoading, false)
    },
    error: (dispatch) => {},
  })),
  adds: (texts) => {
    const items = texts.map((text, i) => ({id: nextTodoId + i, text, completed: false}))
    nextTodoId += items.length
    return ReducerListConcat(items)
  },
}


export const siteActions = {
  add: (texts) => {
    return ReducerListConcat(texts)
  },
  load: FetchAction(username => ({
    url: `http://localhost:5000/api/Site/all`,
//    start: (dispatch) => dispatch(loadingActions.setLoading, true),
    success: (dispatch, data) => {
//      const names = data.map(item => item.name)
      console.log('api data', data);
      dispatch(siteActions.add, data)
//      dispatch(loadingActions.setLoading, false)
    },
    error: (dispatch) => {},
  })),
}

export default {
  // Combine actions
  todos: [todoActions, []],
  visibilityFilter: [visibilityFilterActions, 'SHOW_ALL'],
  loading: [loadingActions, false],
  repositories: [repositoryActions, []],
  sites: [siteActions, []],
}
