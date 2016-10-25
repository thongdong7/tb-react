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

export function success(message) {
  toastr.success(message)
}

export function error(message) {
  toastr.error(message)
}
