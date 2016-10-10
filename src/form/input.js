import React, {Component} from 'react';

function cleanValue(value) {
  return value ? value : ""
}

export default class FormInput extends Component {
  constructor(props) {
    super(props)

    const value = cleanValue(props.form[props.name])
    this.state = {
      value
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentWillReceiveProps({form, name}) {
//  console.log('receive props', value, this.props.value, this.state.value);
    this.setState({value: form[name]})
  }

  get value() {
    return this.state.value
  }

  handleChange({target: {value}}) {
//    console.log('value', value);
    this.props.form[this.props.name] = value
    this.setState({value});
  }

  handleKeyPress({key}) {
    if (key === 'Enter') {
      if (this.props.onSubmit) {
//        console.log('submit form');
        this.props.onSubmit()
      }
    }
  }

  render() {
    return (
      <input
        type="text"
        className="form-control"
        value={cleanValue(this.state.value)}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        onBlur={this.props.onBlur}
      />
    )
  }
}
