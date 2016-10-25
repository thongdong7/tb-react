import React, {Component, PropTypes} from 'react'
//import {loadData} from './data'
import {selectProps} from './props'
//import Form from './form'
import {Button} from './button'

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
    const {url, params, onComplete} = this.props

    // TODO get api from props if any
    const data = await api.load(url, params)

    this.setState({loading: false})
    if (onComplete) {
      onComplete(data, params)
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
