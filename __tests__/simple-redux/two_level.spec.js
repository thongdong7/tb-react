import {
  createStore, 
  ReducerSet,
} from '../../src/simple-redux'

test('State could be an single element', () => {
  const loadingActions = {
    setLoading: ReducerSet(),
    toggleLoading: () => state => !state
  }
  const actions = {
    homepage: {
      profile: [loadingActions, false]
    }
  }

  const store = createStore(actions)
  const initState = store.getState();
//  console.log('init state', store.getState());

  function getLoading() {
    return store.getState().homepage.profile
  }

  expect(initState).not.toBe(undefined)
  expect(getLoading()).toBe(false)

  store.dispatch(loadingActions.setLoading, true)
//  console.log('state', store.getState());
  expect(getLoading()).toBe(true)

  store.dispatch(loadingActions.setLoading, false)
  expect(getLoading()).toBe(false)

  store.dispatch(loadingActions.toggleLoading)
  expect(getLoading()).toBe(true)

  store.dispatch(loadingActions.toggleLoading)
  expect(getLoading()).toBe(false)
})
