import createStore, {middlewareAsyncAction, AsyncAction} from '../../src/simple-redux'
import {createStoreMap} from '../../src/simple-react-redux'

test("Props change when state changed", () => {
  let nextTodoId = 0
  const todoActions = {
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
    ]),
    load: AsyncAction(dispatch => () => dispatch(todoActions.addTodo, "Sample todo"))
  }

  const visibilityFilterActions = {
    setVisibilityFilter: (filter) => state => filter
  }

  const actions = {
    todos: [todoActions, []],
    visibilityFilter: [visibilityFilterActions, 'SHOW_ALL']
  }

  let store = createStore(actions, middlewareAsyncAction)
  let propsChangeCount = 0
  const storeMap = createStoreMap(store, {
    start: (dispatch) => dispatch(todoActions.load),
    stateToProps: (state, ownProps) => ({todos: state.todos.filter(t => !t.completed)}),
    propsChange: (props) => {
      // console.log('props change', props);
      propsChangeCount += 1
    }
  })

  // Current props is empty
  expect(storeMap.getProps()).toEqual({todos: []});
  expect(propsChangeCount).toBe(0)

  // Start
  storeMap.start()
  expect(propsChangeCount).toBe(1)

  store.dispatch(visibilityFilterActions.setVisibilityFilter, 'SHOW_ACTIVE')
  expect(propsChangeCount).toBe(1)

  function getTodos() {
    return storeMap.getProps().todos
  }

  // console.log('get todos', getTodos());

  expect(getTodos()[0].text).toBe("Sample todo")

  store.dispatch(todoActions.addTodo, "Test 1")
  expect(getTodos().length).toBe(2)
  store.dispatch(todoActions.toggleTodo, 1)

  expect(getTodos().length).toBe(1)
  expect(getTodos()[0].text).toBe("Sample todo")

  storeMap.stop()
})
