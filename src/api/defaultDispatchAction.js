
import {APIException} from '../data'
import * as notify from '../notify'

export async function defaultDispatchAction(dispatch, value, {action, actionFunc, onComplete, onError}, {afterDispatch}={}) {
  let success = true
  let error
  let data
  const args = action ? [...action, value] : actionFunc(value)
  try {
    data = await dispatch(...args)
    // console.log('APIActionButton response', data);
  } catch (err) {
    success = false

    // console.log('call error', err);
    if (err instanceof APIException) {
      error = err.data.message
    } else {
      error = 'Unknown error: ' + err
      console.error(err);
    }
    notify.error(error)
  }

  if (afterDispatch) {
    afterDispatch()
  }

  if (success) {
    if (onComplete) {
      onComplete(data)
    }
  } else if (onError) {
    onError(error)
  }
}
