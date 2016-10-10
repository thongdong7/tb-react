/**
 * Select `fields` in props
 */
export function selectProps(props, fields) {
  let ret = {}
  for (const field of fields) {
    if (props[field] !== undefined) {
      ret[field] = props[field]
    }
  }

  return ret
}
