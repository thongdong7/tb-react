import React, {PropTypes} from 'react';
import {Button} from '../button'

import EditableField from './editable'
import FormInput from './input'

export default class Form {
  constructor(data, onSubmit, {schema={}, complete, editable=false}={}) {
    this.data = {...data}
    this.oldData = data
    this.onSubmit = onSubmit
    this.schema = schema
    this.complete = complete
    this.editable = editable
  }

  submit = async () => {
//    console.log('form submit', this.data, this.onSubmit);
    if (this.onSubmit) {
      const ret = await this.onSubmit(this.data)

      // Change oldData so we know when thing is changed
      this.oldData = {...this.data}

      if (this.complete) {
        return this.complete(ret, this.data)
      }
    }
  }

  onFieldSubmit = () => {
    console.log('onFieldSubmit');
  }

  submitField = (field) => {
    if (this.data[field] !== this.oldData[field]) {
//      console.log('value changed', this.data[field], this.oldData[field]);
      this.submit()
    }
  }

  getFieldTitle = (field) => {
    return this.schema[field] ? this.schema[field] : field
  }

  getFieldValue = (field) => {
    return this.data[field]
  }

  renderForm = (fields) => {
    return (
      <div className="form-horizontal">
        {fields.map((field, i) => this.renderFieldRow(field, i))}
        <div className="form-group">
          <div className="col-sm-offset-4 col-sm-8">
            {this.renderSubmit()}
          </div>
        </div>
      </div>
    )
  }

  renderField = (field, props={}, index) => {
    if (this.editable) {
      return (
        <EditableField form={this} field={field} />
      )
    } else {
      return this.renderFieldInput(field, props, index)
    }
  }

  renderFieldInput = (field, props={}, index) => {
    console.log('index', field, index);
    return (
      <FormInput
        name={field}
        form={this.data}
        onSubmit={this.onFieldSubmit}
        focus={index === 0}
        {...props}
      />
    )
  }

  renderFieldRow = (field, index) => {
    return (
      <div key={field} className="form-group">
        <label htmlFor={`form_${field}`} className="col-sm-4 control-label">{this.getFieldTitle(field)}</label>
        <div className="col-sm-8">
          {this.renderField(field, {}, index)}
        </div>
      </div>
    )
  }

  renderSubmit = ({name="Save", type="info", icon="save", hideName}={}) => {
    return (
      <Button {...{name, type, icon, hideName}} onClick={() => this.submit()} />
    )
  }
}

export const PropTypeForm = PropTypes.shape({
  renderField: PropTypes.func.isRequired,
})
