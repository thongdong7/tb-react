import Store, {executeReducersArray} from '../src/store'

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

//function combineActions(reducerMap) {
//
//}
//
//const actions = combineActions({
//  todos: todoActions
//})

const actions = {
  todos: todoActions
}

let state = {
  todos: [{text: "aaa", completed: false}]
}

let fnMap = {}

function buildFnNameMap() {
  for (const field in actions) {
    for (const field2 in actions[field]) {
      console.log('field2', field2);

      fnMap[field2] = [field]
    }
  }
}

buildFnNameMap()
//console.log(fnMap);

function findChildState(state, name) {
  const paths = fnMap[name]
  for (const field of paths) {
    state = state[field]
  }
  return state
}

function updateChildState(state, name, newChildState) {

  const paths = fnMap[name]

  return updateChildState2(state, paths, newChildState)
}

function updateChildState2(state, paths, newChildState) {
  if (paths.length == 0) {
    return newChildState
  }

  const head = paths[0]
  const tail = paths.slice(1)
  console.log('tail', tail);

  return {
    ...state,
    [head]: updateChildState2(state[head], tail, newChildState)
  }

//  let oldState = state
//  console.log('update child state for state', state);
//  for (const field of paths) {
//    state = state[field]
//  }
//
//  state = newChildState
//
//  console.log('state', state);
//  console.log('old state', oldState);
}


function doReduce(fn, args) {
  const fnName = fn.name
  console.log('name', fnName);

  // Find reducers
//  console.log('fn', fn);
  const reducers = fn(...args)
//  console.log('reducers', reducers);

  // Find path

  // Find `state child` by fn name
  let childState = findChildState(state, fnName)
  console.log('child state', childState);

  // Reduce `state child`
  childState = executeReducersArray(reducers, childState)
  console.log('new child state', childState);

  // Update `state child`
  state = updateChildState(state, fnName, childState)
  console.log('new state', state);
}

doReduce(todoActions.addTodo, "Hello")

test('Should run reducers', () => {
  let store = new Store(todoActions)

  const unsubscribe = store.subscribe((state) => {
//    console.log('state', state);
  })

//  store.dispatch(todoActions.addTodo, "Hello")
//  expect(state.length).toBe(1)
//  store.dispatch(todoActions.addTodo, "World")
//  store.dispatch(todoActions.toggleTodo(1))
//
//  const state = store.getState()
//  expect(state.length).toBe(2)
//  expect(state[0].completed).toBe(false)
//  expect(state[1].completed).toBe(true)
//
//  store.dispatch(todoActions.toggleTodo(1))
//  expect(store.getState()[0].completed).toBe(false)
//  expect(store.getState()[1].completed).toBe(false)

  unsubscribe()

  expect(store.subscribers.length).toBe(0)
});
