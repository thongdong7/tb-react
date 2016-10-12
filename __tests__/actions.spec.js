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

const actions = {
  todos: todoActions
}

let state = {
  todos: [{text: "aaa", completed: false}]
}

function buildFnMap(actions) {
  let ret = {}
  for (const field in actions) {
    const action = actions[field]
    if (typeof action === 'function') {
      ret[action] = []
    } else {
      const tmpMap = buildFnMap(action)
      for (const fn in tmpMap) {
        ret[fn] = [field, ...tmpMap[fn]]
      }
    }
  }

  return ret
}

let fnMap2 = buildFnMap(actions)
//console.log(fnMap2);
//console.log(fnMap2);

function findChildState(state, fn) {
  const paths = fnMap2[fn]
  for (const field of paths) {
    state = state[field]
  }
  return state
}


function updateChildState(state, paths, newChildState) {
  if (paths.length == 0) {
    return newChildState
  }

  const head = paths[0]
  const tail = paths.slice(1)
//  console.log('tail', tail);

  return {
    ...state,
    [head]: updateChildState(state[head], tail, newChildState)
  }
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
  let childState = findChildState(state, fn)
  console.log('child state', childState);

  // Reduce `state child`
  childState = executeReducersArray(reducers, childState)
  console.log('new child state', childState);

  // Update `state child`
  state = updateChildState(state, fnMap2[fn], childState)
  console.log('new state', state);

  return state
}



test('Should run reducers', () => {
  const newState = doReduce(todoActions.addTodo, "Hello")
  expect(newState.todos.length).toBe(2)

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
