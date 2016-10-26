import React, {Component} from 'react';
import {Button} from '../components'
import {inputTypes} from './config'

export class SchemaFilter extends Component {
  constructor(props) {
    super(props)

    this.state = this.buildState(props)
  }

  buildState = ({schema}) => {
    // console.log('selectField', selectField)
    return {
      fields: [],
      data: {},
      ...this.buildSelectField({fields: []})
    }
  }

  buildSelectField = ({fields}) => {
    const {schema} = this.props
    // console.log('fields', fields)

    const availableItems = schema.items.filter(({field}) => fields.indexOf(field) < 0)
    const selectField = availableItems.length > 0 ? availableItems[0].field : null
    const value = schema.getDefaultValue(selectField)
    // console.log('field', selectField, 'value', value)

    return {
      selectField, value
    }
  }

  availableItems = () => {
    return this.props.schema.items.filter(({field}) => this.state.fields.indexOf(field) < 0)
  }

  changeValue = ({target: {value}}) => {
    this.setState({value: this.props.schema.formatValue(this.state.selectField, value)})
  }

  renderFieldValue = () => {
    const {schema} = this.props
    const fieldConfig = schema.getByField(this.state.selectField)
    if (fieldConfig.type === 'boolean') {
      // const value =
      return (
        <select
          className="form-control"
          defaultValue={schema.getDefaultValue(fieldConfig.field)}
          onChange={this.changeValue}
        >
          <option value={true}>true</option>
          <option value={false}>false</option>
        </select>
      )
    } else {
      return (
        <input
          type={inputTypes[fieldConfig.type]}
          className="form-control"
          value={this.state.value}
          onChange={this.changeValue}
          onKeyPress={({key}) => {
            if (key === 'Enter') {
              // Add
              this.add()
            }
          }}
        />
      )
    }
  }

  add = () => {
    const {selectField, value, fields, data} = this.state
    const {schema} = this.props
    if (schema.isEmptyValue(selectField, value)) {
      this.setState({error: true})
      return
    }

    const nextState = {
      error: false
    }
    if (fields.indexOf(selectField) < 0) {
      nextState.fields = [...fields, selectField]
    } else {
      nextState.fields = fields
    }

    nextState.data = {...data, [selectField]: value}
    // console.log('nextState', nextState)

    this.filterChange({
      ...nextState,
      ...this.buildSelectField(nextState)
    })
    // this.props.onAdd(selectField, value)
  }

  filterChange = (nextState) => {
    const {onChange} = this.props
    if (onChange) {
      onChange({
        fields: nextState.fields,
        data: nextState.data,
      })
    }

    this.setState(nextState)
  }

  remove = (field) => {
    const {selectField, value, fields, data} = this.state

    function removeFields(obj, field) {
      const ret = {}
      for (const f of Object.keys(obj)) {
        if (f !== field) {
          ret[f] = obj[f]
        }
      }

      return ret
    }

    const nextState = {
      fields: fields.filter(f => f !== field),
      data: removeFields(data, field)
    }

    if (selectField) {
      nextState.selectField = selectField
      nextState.value = value
    } else {
      const tmp = this.buildSelectField(nextState)
      nextState.selectField = tmp.selectField
      nextState.value = tmp.value
    }

    this.filterChange(nextState)
  }

  changeField = ({target: {value: selectField}}) => {
    this.setState({
      selectField,
      value: this.props.schema.getDefaultValue(selectField),
    })
  }

  renderForm = () => {
    const {selectField, value} = this.state
    const availableItems = this.availableItems()
    if (availableItems.length > 0) {
      return (
        <div className="form-inline">
          <div className="form-group">
            <select
              onChange={this.changeField}
              className="form-control"
            >
              {availableItems.map(({field, title}) => {
                return (
                  <option key={field} value={field}>{title}</option>
                )
              })}
            </select>
          </div>

          <div className={`form-group ${this.state.error ? 'has-error' : ''}`}>
            {this.renderFieldValue()}
          </div>
          <div className="form-group">
            <Button
              name="Add"
              type="success"
              icon="plus"
              hideName
              onClick={this.add}
            />
          </div>
        </div>
      )
    }
  }

  render() {
    const {schema} = this.props
    const {availableItems, selectField, value, fields, data} = this.state
    // console.log('fields', fields)
    return (
      <div>
        {this.renderForm()}

        <table className="table table-striped table-condensed">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field) => {
              const fieldConfig = schema.getByField(field)
              let fieldValue
              switch (fieldConfig.type) {
                case 'boolean':
                  fieldValue = data[field] ? 'Yes' : 'No'
                  break
                default:
                  if (data[field] === '') {
                    fieldValue = <i>Empty</i>
                  } else {
                    fieldValue = data[field]
                  }
                  break
              }
              return (
                <tr key={field}>
                  <td>{schema.getByField(field).title}</td>
                  <td>
                    {fieldValue}
                  </td>
                  <td>
                    <Button
                      name="Remove"
                      icon="remove"
                      type="danger"
                      hideName
                      onClick={() => this.remove(field)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}
