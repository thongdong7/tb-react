import {map, routeParams} from './data'
import api from './api'
import Form, {FormInput} from './form'
import {RemoteButton} from './formData'
import {Link, NavLink, NavBar} from './link'
import {Button, LinkButton, ModalButton} from './button'
import {selectProps} from './props'

import {get, post, form} from './mapUtils'
import toastr from 'toastr'

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
  map,
  api, RemoteButton,
  get, post, form,
  selectProps,

  routeParams,
  Form, FormInput,
  success,
  Link, NavLink, NavBar,
  Button, LinkButton, ModalButton,
}
