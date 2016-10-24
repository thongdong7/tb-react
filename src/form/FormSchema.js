export function buildSchema(schema) {
  if (_.isArray(schema)) {
    let ret = {}
    for (const i of schema) {
      ret[i.field] = i
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
    }
  }
}

export function normalizedFormData(data, schema) {
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
