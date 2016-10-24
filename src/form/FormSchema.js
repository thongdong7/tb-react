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
