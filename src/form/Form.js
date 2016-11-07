import React, {PropTypes} from 'react';
import {Button} from '../components'

import EditableField from './editable'
import FormInput from './input'
import _ from 'lodash'

import * as fs from './FormSchema'

class FormRendererBase {
  constructor(form, options={}) {
    this.form = form
    this.options = options
  }
}


class FormRendererHorizontal extends FormRendererBase {
  renderForm = (fields, options={}) => {
    const submitControl = this.form.renderSubmit(options.submit)
    let submitContent
    if (this.options.showLabel) {
      submitContent = (
        <div className="form-group">
          <div className="col-sm-offset-4 col-sm-8">
            {submitControl}
          </div>
        </div>
      )
    } else {
      submitContent = submitControl
    }
    return (
      <div className="form-horizontal">
        {fields.map((field, i) => this.renderFieldRow(field, i))}
        {submitContent}
      </div>
    )
  }

  renderFieldRow = (field, index) => {
    const size = this.options.showLabel ? 8 : 12
    const fieldSchema = this.form.schema.getByField(field)
    const renderProps = this._getControlStyle(fieldSchema)

    let control;
    if (fieldSchema.type === 'boolean') {
      control = this.form.renderField(field, renderProps, index)
    } else {
      control = (
        <div className={`col-sm-${size}`}>
          {this.form.renderField(field, renderProps, index)}
        </div>
      )
    }
    return (
      <div key={field} {...this._getRowStyle(fieldSchema)}>
        {
          this.options.showLabel &&
          <label
            htmlFor={`form_${field}`}
            className="col-sm-4 control-label"
          >{this.form.getFieldTitle(field)}</label>
        }
        {control}
      </div>
    )
  }

  _getRowStyle = (fieldSchema) => {
    const defaultRowStyle = {
      className: fieldSchema.type === 'boolean' ? 'checkbox' : "form-group"
    }

    if (this.options.getRowStyle) {
      const rowStyle = this.options.getRowStyle(fieldSchema)
      if (rowStyle) {
        return {...defaultRowStyle, ...rowStyle}
      }
    }

    return defaultRowStyle
  }

  _getControlStyle = (fieldSchema) => {
    const renderProps = {
      title: fieldSchema.title,
    }
    if (!this.options.showLabel && fieldSchema.isStringControl) {
      renderProps.placeholder = fieldSchema.title
    }

    if (this.options.getControlStyle) {
      return {...renderProps, ...this.options.getControlStyle(fieldSchema)}
    }

    return renderProps
  }
}

export class Form {
  constructor(data, onSubmit, {schema=[], complete, editable=false, renderer, rendererOptions}={}) {
    this.data = {...data}
    this.oldData = data

    this.onSubmit = onSubmit
    this.schema = fs.createSchema(schema)

    // Use default value if not provided
    for (const field of this.schema.fields) {
      if (!this.data[field]) {
        this.data[field] = this.schema.getByField(field).value
      }
    }
    // console.log('init data', data);
    this.complete = complete
    this.editable = editable
    if (!renderer) {
      renderer = FormRendererHorizontal
    }

    const {renderForm, renderFieldRow} = new renderer(this, rendererOptions)

    this._renderForm = renderForm
    this.renderFieldRow = renderFieldRow
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
    const fieldConfig = this.schema.getByField(field)
    if (!fieldConfig) {
      return field
    }

    return fieldConfig.title ? fieldConfig.title : field
  }

  getFieldValue = (field) => {
    return this.data[field]
  }

  renderForm = (fields, options) => {
    if (!fields) {
      // console.log('fields', fields, this.schema.fields);
      fields = this.schema.fields
    }

    return this._renderForm(fields, options)
  }

  // renderForm = (fields) => {
  //   return (
  //     <div className="form-horizontal">
  //       {fields.map((field, i) => this.renderFieldRow(field, i))}
  //       <div className="form-group">
  //         <div className="col-sm-offset-4 col-sm-8">
  //           {this.renderSubmit()}
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  renderField = (field, props={}, index) => {
    if (this.editable) {
      return (
        <EditableField
          form={this}
          field={field}
          schema={this.schema.getByField(field)}
        />
      )
    } else {
      return this.renderFieldInput(field, props, index)
    }
  }

  renderFieldInput = (field, props={}, index) => {
    return (
      <FormInput
        name={field}
        form={this.data}
        onSubmit={this.onFieldSubmit}
        focus={index === 0}
        schema={this.schema.getByField(field) || {field, type: 'string'}}
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

  renderSubmit = ({name="Save", type="info", icon="save", hideName, inputClass}={}) => {
    return (
      <Button {...{name, type, icon, hideName, inputClass}} onClick={() => this.submit()} />
    )
  }
}

export const PropTypeForm = PropTypes.shape({
  renderField: PropTypes.func.isRequired,
})
