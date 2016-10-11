import Store from '../src/store'

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
  ])
}

test('Should run reducers', () => {
  let store = new Store()

  const unsubscribe = store.subscribe((state) => {
//    console.log('state', state);
  })

  store.dispatch(todoActions.addTodo("Hello"))
  store.dispatch(todoActions.addTodo("World"))
  store.dispatch(todoActions.toggleTodo(1))

  const state = store.getState()
  expect(state.length).toBe(2)
  expect(state[0].completed).toBe(false)
  expect(state[1].completed).toBe(true)

  store.dispatch(todoActions.toggleTodo(1))
  expect(store.getState()[0].completed).toBe(false)
  expect(store.getState()[1].completed).toBe(false)

  unsubscribe()

  expect(store.subscribers.length).toBe(0)
});
