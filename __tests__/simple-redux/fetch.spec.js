import {createStore, middlewareFetch, FetchAction} from '../../src/simple-redux'


test('FetchAction support parameter in url', async () => {
  let loadedUrl = null
  window.fetch = jest.fn().mockImplementation((url) => Promise.resolve({
    json() {
      expect(url).toBe('http://localhost/1')
      return Promise.resolve([1, 2])
    }
  }));
  const loadActions = {
    load: FetchAction(id => ({
      url: `http://localhost/${id}`,
    }))
  }
  const actions = {
    items: []
  }
  let store = createStore(actions, middlewareFetch)

  const result = await store.dispatch(loadActions.load, 1)
//  console.log('result', result);

  expect(result).toEqual([1, 2])
})
