import React, {Component} from 'react'
//import {loadData} from './data'
import {selectProps} from './props'
//import Form from './form'
import {Button} from './button'

import api from './api'

export class RemoteButton extends Component {
  submit = async () => {
//    console.log('submit to', this.props.url, this.props.params);
    // TODO get api from props if any
    const data = await api.load(this.props.url, this.props.params)

    if (this.props.onComplete) {
      this.props.onComplete(data)
    }
  }
  render() {
    return (
      <Button {...selectProps(this.props, ['name', 'icon', 'type', 'hideName'])} onClick={this.submit} />
    )
  }
}
