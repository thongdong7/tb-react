import createStore, {middlewareAsyncAction, AsyncAction} from '../../src/simple-redux'

//console.log('aynsc 1', AsyncAction);

jest.useFakeTimers();

let nextTodoId = 0
const todoActions = {
  addTodo: (text) => (state=[]) =>
    ([...state, {id: nextTodoId++, text, completed: false}]),
  asyncAdd: AsyncAction(dispatch => text => {
//      console.log('im async action');
      setTimeout(() => {
        // Yay! Can invoke sync or async actions with `dispatch`
//        console.log('now async return result');
        dispatch(todoActions.addTodo, text);
//        console.log('dispatch done');
      }, 1000)
    }
  )
}

const actions = {
  todos: todoActions,
}

test('Should run async actions', () => {
  let store = createStore(actions, middlewareAsyncAction)

  const unsubscribe = store.subscribe((state) => {
//    console.log('state', state);
  })

  store.dispatch(todoActions.asyncAdd, "Hello")

  expect(setTimeout.mock.calls.length).toBe(1);
  expect(setTimeout.mock.calls[0][1]).toBe(1000);

  // Run timer
  jest.runAllTimers();

//  console.log('done');
//  console.log(store.getState());

  expect(store.getState().todos.length).toBe(1)
  expect(store.getState().todos[0].text).toBe("Hello")

  unsubscribe()


//  expect(store.subscribers.length).toBe(0)
});
