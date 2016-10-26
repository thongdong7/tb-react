import React, {Component, PropTypes} from 'react'
import {Button} from '../button'
import {selectProps} from '../props'

import invariant from 'invariant'

export class APIActionButton extends Component {
  static propTypes = {
    action: PropTypes.array.isRequired,
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

  submit = async () => {
    this.setState({loading: true})
    const {action, dispatch, onComplete, onError} = this.props

    let success = true
    let error
    let data
    try {
      data = await this.store.dispatch(...action)
      console.log('APIActionButton response', data);
    } catch (err) {
      success = false

      // console.log('call error', err);
      if (err instanceof APIException) {
        error = err.data.message
      } else {
        error = 'Unknown error: ' + err
        console.error(err);
      }
      notify.error(error)
    }

    this.setState({loading: false})

    if (success) {
      if (onComplete) {
        onComplete(data, params)
      }
    } else if (onError) {
      onError(error)
    }
  }

  render() {
    const {icon} = this.props
    const buttonIcon = this.state.loading ? 'refresh': icon
    const props = {}
    if (this.state.loading) {
      props.spin = true
      props.icon = 'refresh'
    } else {
      props.icon = icon
    }

    return (
      <Button
        {...selectProps(this.props, ['name', 'type', 'hideName'])}
        {...props}
        onClick={this.submit}
      />
    )
  }
}
