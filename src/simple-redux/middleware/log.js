class MiddlewareLog {
  couldHandle(action) {
    return typeof action === 'function' || action._name
  }

  apply(dispatch, fn, ...args) {
    console.log(`Call ${fn.name} with arguments`, args);
  }
}

export const middlewareLog = new MiddlewareLog()
