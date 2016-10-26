import {
  createStore, 
  ReducerSet,
  IdDict
} from '../../src/simple-redux'

class MockPersistor {
  updateState = (state) => {
    this.state = state
  }

  getState = () => {
    return this.state
  }

  isEmpty = () => {
    return this.state == undefined
  }
}

function persist({dispatch, subscribe, getState}, persistor) {
  let unsubscribe = subscribe(_onStateChange)

  if (persistor.isEmpty()) {
    persistor.updateState(getState())
  } else {
    // Change store state to state in persistor
    dispatch(() => (state) => persistor.getState())
  }

  function _onStateChange(state) {
    persistor.updateState(state)
  }

  return persistor
}

test("Could Persistent store", () => {
  const loadingActions = {
    setLoading: ReducerSet()
  }
  const errorMessageActions = {
    setErrorMessage: ReducerSet()
  }

  const actions = {
    loading: [loadingActions, false],
    errorMessage: [errorMessageActions, null]
  }


  // Create store
  const store = createStore(actions)

  // Register Persistent
  const persistor = new MockPersistor()
  const storage = persist(store, persistor)

  // Expect: Storage contain initState
  expect(store.getState()).toEqual({loading: false, errorMessage: null})
  expect(storage.getState()).toEqual({loading: false, errorMessage: null})

  // Change state
  store.dispatch(loadingActions.setLoading, true)

  // Expect: Storage contain new state
  expect(storage.getState()).toEqual({loading: true, errorMessage: null})

  // Create new store
  const store2 = createStore(actions)
  const storage2 = persist(store2, persistor)

  // Expect: initState = oldState
  expect(store2.getState()).toEqual({loading: true, errorMessage: null})
  expect(storage2.getState()).toEqual({loading: true, errorMessage: null})
})
