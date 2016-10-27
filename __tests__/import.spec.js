test('Could import', () => {
  const tb = require('../lib');
  expect(tb.map).toBeDefined()
  expect(tb.form).toBeDefined()
  expect(tb.createStore).toBeDefined()
  expect(tb.APIAction).toBeDefined()
  expect(tb.ReducerSet).toBeDefined()
  expect(tb.connect2).toBeDefined()

  expect(tb.Button).toBeDefined()
  expect(tb.BackButton).toBeDefined()
  expect(tb.LinkButton).toBeDefined()
  expect(tb.ModalButton).toBeDefined()

  expect(tb.RemoteButton).toBeDefined()
  expect(tb.NavLink).toBeDefined()
  expect(tb.NavBar).toBeDefined()

  expect(tb.Switch).toBeDefined()
  expect(tb.APIActionSwitch).toBeDefined()

  expect(tb.abc).toBeUndefined()
});
