import createStore, {middlewareAsyncAction, AsyncAction} from '../../src/simple-redux'

// function

function createStoreMap({dispatch, subscribe, getState}, options={}) {
  let currentProps = _transferState(getState())
  let unsubscribe

  function _transferState(state) {
    const stateProps = options.stateToProps ? options.stateToProps(state, options.props) : {}
    const dispatchProps = options.dispatchToProps ? options.dispatchToProps(dispatch) : {}
    return {
      ...stateProps,
      ...dispatchProps,
    }
  }

  function _isPropsDifferent(props1, props2) {
    return true
  }

  function _onStateChange(state) {
    // console.log('store changed', state);

    const newProps = _transferState(state)
    if (_isPropsDifferent(currentProps, newProps)) {
      currentProps = newProps
      options.propsChange(currentProps)
    }
  }

  /**
   * Call when `componentWillMount()`
   */
  function start() {
    unsubscribe = subscribe(_onStateChange)
    if (typeof options.start === 'function') {
      options.start(dispatch)
    }
  }

  // Call when `componentWillUnMount()`
  function stop() {
    if (unsubscribe) {
      // console.log('unsubcribe');
      unsubscribe()
    }
  }

  return {
    start,
    stop,
    getProps: () => currentProps
  }
}

test("Props change when store changed", () => {
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
    ]),
    load: AsyncAction(dispatch => () => dispatch(todoActions.addTodo, "Sample todo"))
  }

  const visibilityFilterActions = {
    setVisibilityFilter: (filter) => state => filter
  }

  const actions = {
    todos: [todoActions, []],
    visibilityFilter: [visibilityFilterActions, 'SHOW_ALL']
  }

  let store = createStore(actions, middlewareAsyncAction)
  let propsChangeCount = 0
  const storeMap = createStoreMap(store, {
    start: (dispatch) => dispatch(todoActions.load),
    stateToProps: (state, ownProps) => ({todos: state.todos.filter(t => !t.completed)}),
    propsChange: (props) => {
      // console.log('props change', props);
      propsChangeCount++
    }
  })

  // Current props is empty
  expect(storeMap.getProps()).toEqual({todos: []});

  function getTodos() {
    return storeMap.getProps().todos
  }

  expect(getTodos()).toEqual([])

  storeMap.start()

  // console.log('get todos', getTodos());

  expect(getTodos()[0].text).toBe("Sample todo")

  store.dispatch(todoActions.addTodo, "Test 1")
  expect(getTodos().length).toBe(2)
  store.dispatch(todoActions.toggleTodo, 1)

  expect(getTodos().length).toBe(1)
  expect(getTodos()[0].text).toBe("Sample todo")

  storeMap.stop()
})
