import createStore, {
  ReducerSet,
  IdDict
} from '../src/simple-redux'


test('ReducerSet should return different function', () => {
  const a = ReducerSet()
  const b = ReducerSet()
  expect(a).not.toBe(b)

  let tmp = new Set()
  expect(tmp.size).toBe(0)
  tmp.add(a)
  expect(tmp.size).toBe(1)
  tmp.add(b)
  expect(tmp.size).toBe(2)

  let tmp3 = new IdDict()
  tmp3.put(a, 'a')
  expect(tmp3.size).toBe(1)
  tmp3.put(b, 'b')
  expect(tmp3.size).toBe(2)
  expect(tmp3.get(a)).toBe('a')
  expect(tmp3.get(b)).toBe('b')

  expect(tmp3.keys().length).toBe(2)
})

test('ReducerSet should different for two action', () => {
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
  const store = createStore(actions)

  const initState = store.getState()
  expect(initState.loading).toBe(false)
  expect(initState.errorMessage).toBe(null)

  store.dispatch(errorMessageActions.setErrorMessage, "API error")
  store.dispatch(loadingActions.setLoading, true)
  store.dispatch(errorMessageActions.setErrorMessage, "API error")

//  console.log(store.getState());

  const state = store.getState()
  expect(state.loading).toBe(true)
  expect(state.errorMessage).toBe('API error')
})
