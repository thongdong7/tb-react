// @flow
import React, {Component, PropTypes} from 'react'
import {Button} from './Button'

export class BackButton extends Component {
  static contextTypes = {
    router: PropTypes.object
  }

  render() {
    return (
      <Button
        name="Back"
        icon="arrow-left"
        type="info"
        onClick={() => this.context.router.goBack()}
      />
    )
  }
}
