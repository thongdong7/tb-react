import _ from 'lodash'

export function createStoreMap({dispatch, subscribe, getState}, options={}) {
  let currentProps = _transferState(getState())
  let unsubscribe

  function _transferState(state) {
    const nextStateProps = options.stateToProps ? options.stateToProps(state, options.props) : {}
    const nextDispatchProps = options.dispatchToProps ? options.dispatchToProps(dispatch) : {}
    
    return {
      ...nextStateProps,
      ...nextDispatchProps,
    }
  }

  function _isPropsDifferent(props1, props2) {
    // console.log('isDifferent', !shallowEqual(props1, props2), props1, props2);
    return !_.isEqual(props1, props2)
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
