import {createStore} from '../../src/simple-redux'

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
}

const visibilityFilterActions = {
  setVisibilityFilter: (filter) => state => filter
}

const actions = {
  todos: [todoActions, []],
  visibilityFilter: [visibilityFilterActions, 'SHOW_ALL']
}


test('Should run reducers', () => {
  let store = createStore(actions)

  const initState = store.getState()

//  console.log('init state', initState);
  expect(initState.todos.length).toBe(0)
  expect(initState.visibilityFilter).toBe('SHOW_ALL')

  const unsubscribe = store.subscribe((state) => {
//    console.log('state', state);
  })

  store.dispatch(todoActions.addTodo, "Hello")
//  console.log('first state', store.getState());
  expect(store.getState().todos.length).toBe(1)
  store.dispatch(todoActions.addTodo, "World")
  store.dispatch(todoActions.toggleTodo, 1)

  let {todos} = store.getState()
  expect(todos.length).toBe(2)
  expect(todos[0].completed).toBe(false)
  expect(todos[1].completed).toBe(true)

  store.dispatch(todoActions.toggleTodo, 1)
  todos = store.getState().todos
  expect(todos[0].completed).toBe(false)
  expect(todos[1].completed).toBe(false)

  store.dispatch(visibilityFilterActions.setVisibilityFilter, 'SHOW_ALL')

//  console.log(store.getState());

  expect(store.getState().visibilityFilter).toBe('SHOW_ALL')
  expect(store.getState().todos.length).toBe(2)

  unsubscribe()


//  expect(store.subscribers.length).toBe(0)
});
