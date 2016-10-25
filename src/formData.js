import React, {Component, PropTypes} from 'react'
import {APIException} from './data'
import {selectProps} from './props'
//import Form from './form'
import {Button} from './button'
import * as notify from './notify'

import api from './api'

export class RemoteButton extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    params: PropTypes.object,
    onComplete: PropTypes.func,
  }

  state = {
    loading: false,
  }

  submit = async () => {
//    console.log('submit to', url, params);
    this.setState({loading: true})
    const {url, params, onComplete, onError} = this.props

    // TODO get api from props if any
    let success = true
    let error
    let data
    try {
      data = await api.load(url, params)
      // console.log('data');
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
