import {
  createStore,
  ReducerSet,
} from '../../src/simple-redux'

test('State could be an single element', () => {
  const loadingActions = {
    setLoading: ReducerSet(),
    toggleLoading: () => state => !state
  }
  const actions = [loadingActions, false]

  const store = createStore(actions)

  expect(store.getState()).toBe(false)

  store.dispatch(loadingActions.setLoading, true)
  expect(store.getState()).toBe(true)

  store.dispatch(loadingActions.setLoading, false)
  expect(store.getState()).toBe(false)

  store.dispatch(loadingActions.toggleLoading)
  expect(store.getState()).toBe(true)

  store.dispatch(loadingActions.toggleLoading)
  expect(store.getState()).toBe(false)
})
