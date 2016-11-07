import React, {Component, PropTypes} from 'react';
import {inputTypes} from './config'

function cleanValue(value) {
  return value ? value : ""
}


export default class FormInput extends Component {
  static propTypes = {
    schema: PropTypes.shape({
      type: PropTypes.string.isRequired
    }),
    form: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    const value = cleanValue(props.form[props.name] || props.schema.value)
    this.state = {
      value
    }
  }

  componentWillReceiveProps({form, name}) {
//  console.log('receive props', value, this.props.value, this.state.value);
    this.setState({value: form[name]})
  }

  get value() {
    return this.state.value
  }

  handleChange = ({target: {checked, value}}) => {
    const {schema: {type}, onChange} = this.props

    if (type == 'boolean') {
      value = checked
    }
    // console.log('value', value, checked);
    this.props.form[this.props.name] = value
    this.setState({value});

    if (onChange) {
      onChange(value)
    }
  }

  handleKeyPress = ({key}) => {
    if (key === 'Enter') {
      if (this.props.onSubmit) {
//        console.log('submit form');
        this.props.onSubmit()
      }
    }
  }

  render() {
    // console.log('props', this.props);
    const {schema: {type='string'}, placeholder, inputClass, title} = this.props
    // console.log('type', type);
    let inputProps = {
      type: inputTypes[type],
      className: '',
    }

    switch (type) {
      case 'boolean':
        inputProps['checked'] = this.state.value ? true : false
        break;
      case undefined:
      case 'string':
      case 'password':
        inputProps['value'] = cleanValue(this.state.value)
        inputProps['className'] = "form-control"
        break;
      default:
        console.error(`FormInput does not support field type '${type}' yet`);
        break
    }

    if (inputClass) {
      inputProps['className'] = inputClass
    }

    let control = (
      <input
        autoFocus={this.props.focus}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress}
        onBlur={this.props.onBlur}
        placeholder={placeholder}
        {...inputProps}
      />
    )

    if (type === 'boolean' && title) {
      return (
        <label>{control}{title}</label>
      )
    }

    return control
  }
}
