export * from './data'
export * from './formData'
export * from './link'
export * from './button'
export * from './mapUtils'
export * from './apiMiddleWare'
import api from './api'
export * from './form'
import {selectProps} from './props'
import store from './simple-redux'

import toastr from 'toastr'

/**
 * Notify
 */
export function notify(ok, message) {
  const method = ok ? toastr.success : toastr.error
  method(message)
}

export function apiNotify({ok=true, message}) {
  notify(ok, message)
}

function success(message) {
  toastr.success(message)
}

export {
  api,
  selectProps,

  success,
  store
}
