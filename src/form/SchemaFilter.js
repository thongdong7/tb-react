import React, {Component} from 'react';
import {Button} from '../button'

export class SchemaFilter extends Component {
  constructor(props) {
    super(props)

    this.state = this.buildState(props)
  }

  buildState = ({schema, fields}) => {
    const availableItems = schema.items.filter(({field}) => fields.indexOf(field) < 0)
    const selectField = availableItems.length > 0 ? availableItems[0].field : null
    return {
      availableItems,
      selectField,
      value: schema.getDefaultValue(selectField),
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextState = this.buildState(nextProps)
    // console.log('props change', nextProps.fields, this.state.selectField, nextState)
    if (nextProps.fields.indexOf(this.state.selectField) >= 0) {
      // selectField now in ignore fields. We need to refresh selectField
      this.setState(nextState)
    }
  }

  changeValue = ({target: {value}}) => {
    this.setState({value})
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
          <option value>true</option>
          <option value={false}>false</option>
        </select>
      )
    } else {
      return (
        <input
          type="text"
          className="form-control"
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
    const {selectField, value} = this.state

    this.props.onAdd(selectField, value)
  }

  changeField = ({target: {value: selectField}}) => {
    this.setState({
      selectField,
      value: this.props.schema.getDefaultValue(selectField),
    })
  }

  renderForm = () => {
    const {availableItems, selectField, value} = this.state
    if (availableItems.length > 0) {
      return (
        <div className="form-inline">
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

          {this.renderFieldValue()}
          <Button
            name="Add"
            onClick={this.add}
          />
        </div>
      )
    }
  }

  render() {
    const {schema, fields, data, onAdd} = this.props
    const {availableItems, selectField, value} = this.state
    // console.log('fields', fields)
    return (
      <div>
        {this.renderForm()}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
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
                  <td>{field}</td>
                  <td>
                    {fieldValue}
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
