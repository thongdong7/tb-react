import createStore, {
  ReducerSet,
} from '../../src/simple-redux'

test("Could persistent state", () => {
  const loadingActions = {
    setLoading: ReducerSet(),
    toggleLoading: () => state => !state
  }
  const actions = [loadingActions, false]

  const store = createStore(actions)
  console.log('state', store.getState());
})
