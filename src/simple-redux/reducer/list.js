// Append to list
export function ReducerListAppend(item) {
  return (state=[]) => ([...state, item])
}

// Concat two list
export function ReducerListConcat(items) {
  return (state=[]) => ([...state, ...items])
}

// Change items in list satisfy `match()` using `change()`
export function ReducerListMatchChange(match, change) {
  return (state=[]) => state.map(t => {
    if (match(t)) {
      return change(t)
    } else {
      return t
    }
  })
}
