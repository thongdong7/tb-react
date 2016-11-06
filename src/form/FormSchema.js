export function buildSchema(schema) {
  if (_.isArray(schema)) {
    let ret = {}
    for (const item of schema) {
      ret[item.field] = item
      ret[item.field].isStringControl = item.type === 'string' || item.type === 'password'
    }

    return ret
  }

  return schema
}

export function createSchema(schema) {
  const schemaMap = buildSchema(schema)
  return {
    items: schema,
    fields: schema.map(i => i.field),
    titles: schema.map(i => i.title),
    getByField: (field) => {
      // console.log(field, schema)
      return schemaMap[field]
    },
    getDefaultValue: (field) => {
      // console.log(field)
      const fieldConfig = schemaMap[field]
      if (!fieldConfig) {
        return ''
      }

      switch (fieldConfig.type) {
        case 'boolean':
          return true;
        default:
          return ''
      }
    },
    isEmptyValue: (field, value) => {
      const fieldConfig = schemaMap[field]
      switch (fieldConfig.type) {
        case 'string':
          return !value || value.trim() == ""
        default:
          return value === undefined || value === null || value === ""
      }
    },
    formatValue: (field, value) => {
      const fieldConfig = schemaMap[field]
      switch (fieldConfig.type) {
        case 'number':
          return Number(value)
        case 'boolean':
          return (value === 'true' || value === true) ? true : false
        default:
          return value
      }
    }
  }
}

export function normalizedFormData(data, schema) {
  if (!schema) {
    return data
  }

  let ret = {}
  for (const field of Object.keys(data)) {
    let value = data[field]
    if (schema[field]) {
      switch (schema[field].type) {
        case 'boolean':
          value = value ? 'true': 'false'
          break;
        default:
          break
      }
    }

    ret[field] = value
  }

  return ret
}
