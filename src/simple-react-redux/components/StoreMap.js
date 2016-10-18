import _ from 'lodash'

export function createStoreMap({dispatch, subscribe, getState}, options={}) {
  let optionsProps = options.props || {}
  let currentProps = _transferState(getState())
  let unsubscribe

  /**
   * Transfer state to props
   */
  function _transferState(state) {
    const nextStateProps = options.stateToProps ? options.stateToProps(state, options.props) : {}
    const nextDispatchProps = options.dispatchToProps ? options.dispatchToProps(dispatch) : {}

    return {
      ...nextStateProps,
      ...nextDispatchProps,
    }
  }

  /**
   * When state is changed:
   *  1. transfer state to props
   *  2. If props is changed, update currentProps and notify this change
   */
  function _onStateChange(state) {
    // console.log('state changed', state);

    const newProps = _transferState(state)
    if (!_.isEqual(currentProps, newProps)) {
      currentProps = newProps
      options.propsChange(currentProps)
    }
  }

  /**
   * Call when `componentWillMount()`
   */
  function start(props) {
    if (props !== undefined) {
      optionsProps = props
    }

    if (!unsubscribe) {
      unsubscribe = subscribe(_onStateChange)
    }

    if (typeof options.start === 'function') {
      options.start(dispatch, optionsProps)
    }
  }

  /**
   * Call when `componentWillUnMount()`
   */
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
