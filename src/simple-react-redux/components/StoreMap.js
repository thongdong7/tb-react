import _ from 'lodash'

export function createStoreMap({dispatch, subscribe, getState}, options={}) {
  const {transformers=[]} = options
  let optionsProps = options.ownProps || {}
  let currentProps = _transferState(getState())
  let unsubscribe

  /**
   * Transfer state to props
   */
  function _transferState(state) {
    const nextStateProps = options.props ? options.props(state, optionsProps) : optionsProps
    const nextDispatchProps = options.event ? options.event(dispatch, state, optionsProps) : {}

    let ret = {
      ...nextStateProps,
      ...nextDispatchProps,
    }

    for (const transformer of transformers) {
      ret = transformer.transfer(ret)
    }

    return ret
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
    // console.log('start');
    if (props !== undefined) {
      optionsProps = props
    }

    if (!unsubscribe) {
      unsubscribe = subscribe(_onStateChange)
    }

    if (typeof options.start === 'function') {
      options.start(dispatch, optionsProps, getState())
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

  /**
   * Trigger event state change to check if
   * the currentProps is changed.
   *
   * In case currentProps is changed, `options.propChange`
   * will be called
   */
  function checkPropsChange() {
    _onStateChange(getState())
  }

  return {
    start,
    stop,
    getProps: () => currentProps,
    checkPropsChange
  }
}
