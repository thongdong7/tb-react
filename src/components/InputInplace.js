import React, {PropTypes} from 'react'
import invariant from 'invariant'
// import {APIException} from '../data'
// import * as notify from '../notify'
import {defaultDispatchAction} from '../api'

// Display the value as text, click will show the <input text>
// Enter to save
export class InputInplace extends React.Component {
  static contextTypes = {
    store: PropTypes.shape({
      subscribe: PropTypes.func.isRequired,
      dispatch: PropTypes.func.isRequired,
      getState: PropTypes.func.isRequired
    })
  }

  constructor(props, context) {
    super(props, context)
    const store = props.store || context.store

    invariant(store,
      `Could not find "store" in either the context or ` +
      `props`
    )
    this.dispatch = store.dispatch

    this.state = {
      editing: false,
      value: props.value
    }
  }

  componentWillReceiveProps({value}) {
    if (value !== this.props.value) {
      this.setState({value})
    }
  }

  async toggle() {
    await this.setState({editing: !this.state.editing})
  }

  onControlChange(e) {
    let value = e.target.value
    this.setState({value: value})
  }

  updateValue = async (e) => {
    e.preventDefault()

    if (this.state.value !== this.props.value) {
      defaultDispatchAction(this.dispatch, this.state.value, this.props)
    }

    this.setState({editing: false})
  }

  render() {
    const {value: stateValue} = this.state
    const {value: defaultValue} = this.props
    const value = stateValue || 0
    return (
      <div>
        {
          !this.state.editing &&
          <div
            className="editable-value"
            onClick={this.toggle.bind(this)}
          >
            {value ? value : <i>N/A</i>}
          </div>
        }
        {
          this.state.editing &&
          <form onSubmit={this.updateValue}>
            <input
              type="number"
              className="form-control"
              autoFocus={this.state.editing}
              name={this.state.name}
              value={value}
              onChange={this.onControlChange.bind(this)}
              onBlur={this.updateValue}
            />
          </form>
        }
      </div>
    )
  }

}
