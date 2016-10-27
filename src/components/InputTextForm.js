import React, {Component, PropTypes} from 'react'
import {APIActionButton} from '../api'

// A simple form with <input text> and Add button
export class InputTextForm extends Component {
  constructor(props) {
    super(props)
  }
  state = {
    value: '',
    error: false,
  }

  static propTypes = {
    action: PropTypes.array,
    actionFunc: PropTypes.func,
    onComplete: PropTypes.func
  }

  onSubmit = (e) => {
    e.preventDefault()

    this.button.submit()
  }

  formChange = ({target: {value}}) => {
    this.setState({value})
  }

  onComplete = () => {
    this.setState({error: false, value: ''})
    if (this.props.onComplete) {
      this.props.onComplete()
    }
  }

  onError = () => {
    this.setState({error: true})
  }

  render() {
    const {action, actionFunc} = this.props
    const {value, error} = this.state

    const errorClass = error ? 'has-error': ''
    const buttonAction = action ? [...action, value] : actionFunc(value)
    return (
      <form
        role="form"
        onSubmit={this.onSubmit}
        onChange={this.formChange}
      >
        <div className={`input-group input-group-sm ${errorClass}`}>
          <input
            type="text"
            className={`form-control`}
            autoComplete="off"
            value={value}
            // onKeyPress={this.handleKeyPress}
          />
          <span className="input-group-btn">
            <APIActionButton
              ref={(r) => this.button = r}
              action={buttonAction}
              name="Add"
              onError={this.onError}
              onComplete={this.onComplete}
            />
          </span>
        </div>
      </form>
    )
  }
}
