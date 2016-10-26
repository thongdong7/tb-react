import React, {PropTypes} from 'react';
import {Button} from '../components'

import EditableField from './editable'
import FormInput from './input'
import _ from 'lodash'

import * as fs from './FormSchema'

export class Form {
  constructor(data, onSubmit, {schema={}, complete, editable=false}={}) {
    this.data = {...data}
    this.oldData = data
    this.onSubmit = onSubmit
    this.schema = fs.buildSchema(schema)
    // console.log('init data', data);
    this.complete = complete
    this.editable = editable
  }

  submit = async () => {
//    console.log('form submit', this.data, this.onSubmit);
    if (this.onSubmit) {
      // console.log('submit', this.data);
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
      // console.log('value changed', this.data[field], this.oldData[field]);
      this.submit()
    }
  }

  getFieldTitle = (field) => {
    return this.schema[field].title ? this.schema[field].title : field
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
        <EditableField
          form={this}
          field={field}
          schema={this.schema[field]}
        />
      )
    } else {
      return this.renderFieldInput(field, props, index)
    }
  }

  renderFieldInput = (field, props={}, index) => {
    // console.log('render input', field, this.schema[field]);
    return (
      <FormInput
        name={field}
        form={this.data}
        onSubmit={this.onFieldSubmit}
        focus={index === 0}
        schema={this.schema[field]}
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
