import React, {Component} from 'react'
//import {loadData} from './data'
import {selectProps} from './props'
//import Form from './form'
import {Button} from './button'

import api from './api'

export class RemoteButton extends Component {
  submit = async () => {
//    console.log('submit to', url, params);
    const {url, params, onComplete} = this.props

    // TODO get api from props if any
    const data = await api.load(url, params)

    if (onComplete) {
      onComplete(data, params)
    }
  }

  render() {
    return (
      <Button {...selectProps(this.props, ['name', 'icon', 'type', 'hideName'])} onClick={this.submit} />
    )
  }
}
