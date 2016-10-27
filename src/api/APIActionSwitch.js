import React, {Component, PropTypes} from 'react'
import {Switch} from '../components'
import {selectProps} from '../props'
import {APIException} from '../data'
import * as notify from '../notify'
import {defaultDispatchAction} from './defaultDispatchAction'

import invariant from 'invariant'

function PropTypeAPIAction(props, propName, componentName) {
  componentName = componentName || 'ANONYMOUS';

  if (props[propName]) {
    let value = props[propName];
    if (!_.isArray(value)) {
      return new Error(`${componentName} require '${propName}' is an 'array'. Receive '${typeof value}'`)
    }

    if (value.length === 0) {
      return new Error(`${componentName} require '${propName}' is an 'array' with at least 1 element. Empty array is provided`)
    }

    if (!value[0]) {
      return new Error(`${componentName} require '${propName}' is an 'array' with first element is action but it is empty. Maybe you not declared the action yet`)
    }
  }

  // assume all ok
  return null;
}

export class APIActionSwitch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    action: PropTypeAPIAction,
    onComplete: PropTypes.func,
  }

  static contextTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired
    })
  }

  state = {
    loading: false,
  }

  constructor(props, context) {
    super(props, context)
    this.store = props.store || context.store

    invariant(this.store,
      `Could not find "store" in either the context or ` +
      `props`
    )
  }

  submit = async (value) => {
    this.setState({loading: true})

    defaultDispatchAction(this.store.dispatch, value, this.props, {
      afterDispatch: () => this.setState({loading: false})
    })
    // const {action, onComplete, onError} = this.props
    //
    // let success = true
    // let error
    // let data
    // try {
    //   data = await this.store.dispatch(...action, value)
    //   // console.log('APIActionButton response', data);
    // } catch (err) {
    //   success = false
    //
    //   // console.log('call error', err);
    //   if (err instanceof APIException) {
    //     error = err.data.message
    //   } else {
    //     error = 'Unknown error: ' + err
    //     console.error(err);
    //   }
    //   notify.error(error)
    // }
    //
    // this.setState({loading: false})
    //
    // if (success) {
    //   if (onComplete) {
    //     onComplete(data)
    //   }
    // } else if (onError) {
    //   onError(error)
    // }
  }

  render() {
    return (
      <Switch
        {...selectProps(this.props, ['checked'])}
        onChange={this.submit}
      />
    )
  }
}
