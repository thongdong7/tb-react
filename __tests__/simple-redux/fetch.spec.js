import createStore, {middlewareFetch, FetchAction} from '../../src/simple-redux'


test('Store dispatch() should return a promise ', async () => {
  window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json() {
      return Promise.resolve([{id: 1, text: 'Hello'}, {id: 2, text: 'World'}])
    }
  }));
  const loadActions = {
    load: FetchAction("http://localhost")
  }
  const actions = {
    items: []
  }
  let store = createStore(actions, middlewareFetch)

  const result = await store.dispatch(loadActions.load)
//  console.log('result', result);

  expect(result.length).toBe(2)
})
