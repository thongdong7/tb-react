

export function ReducerListAppend(item) {
  return (state=[]) => ([...state, item])
}

export function ReducerListConcat(items) {
  return (state=[]) => ([...state, ...items])
}
