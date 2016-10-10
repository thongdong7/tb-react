import React, {Component} from 'react';

import ReactDOM from 'react-dom'

export default class EditableField extends Component {
  constructor(props) {
    super(props)

    this.state = {
      edit: false
    }

    this.toggleEdit = this.toggleEdit.bind(this)
  }

  toggleEdit() {
//    console.log('to edit mode');
    this.setState({edit: !this.state.edit})
  }

  render() {
    const {form, field} = this.props

    if (this.state.edit) {
//      console.log('render field', field);
      return form.renderFieldInput(field, {
        onBlur: () => {this.toggleEdit(); form.submitField(field)},
        ref: (c) => c && ReactDOM.findDOMNode(c).focus()
      })
    } else {
      return (
        <span onClick={this.toggleEdit} className="editable">{form.getFieldValue(field)}</span>
      )
    }
  }
}
