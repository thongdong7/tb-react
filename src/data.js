// @flow
import React, {Component} from 'react'
import invariant from 'invariant'
import storeShape from './simple-react-redux/utils/storeShape'

export function APIException(data) {
  this.name = "APIException"
  this.data = data
}

/**
 * Load data from url
 * @param url
 * @param params
 * @returns {*}
 */
export async function loadData(url, params: Object) {
  // console.log(url, params);
  const requestUrl = buildUrl(url, params)
//  const response = await fetch(requestUrl, params)
//   console.log(requestUrl);
  const response = await fetch(requestUrl, params)
  // console.log('response', response);
  if (response.status == 200) {
    return response.json()
  } else {
    let data
    if (response.status == 404) {
      data = await response.json()
    } else {
      data = {
        ok: false,
        message: `Error ${response.status} (${response.statusText}): ${response.body}`
      }
    }

    throw new APIException(data)
  }
}


export function buildUrl(url, params) {
  const queryString = objectToQuerystring(params)
  return url + (queryString ? "?" + queryString : "")
}
/**
 * Convert object to query string
 *
 * @param obj
 * @returns {string}
 */
function objectToQuerystring (obj) {
  let tmp = []
  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      tmp.push(`${k}=${obj[k]}`)
    }
  }

  return tmp.join('&')
}

function getPath(loc) {
  const path = loc.pathname
  return path.startsWith("/") ? path.substring(1) : path
}

/**
 * Check is API parameters are the same. This will help to avoid call multiple times.
 */
export function isSameParams(params, lastParams) {
  if (lastParams == null) {
    return false
  }

  for (const f1 in params) {
    // Ignore parameters of react-router
    if (["children", "history", "params", "route", "routeParams", "routes"].indexOf(f1) >= 0) {
      continue
    }

    if (f1 === "location") {
      const pathname = getPath(params[f1])
      const pathnameLast = getPath(lastParams[f1])
//      console.log('location', pathname, pathnameLast);

      if (pathname !== pathnameLast) {
      //  console.log('location change', pathname, pathnameLast);
        return false
      }
    } else if (params[f1] !== lastParams[f1]) {
//      console.log('change field', f1);
      return false
    }
  }

  return true
}



export function routeParams(...fields) {
  return {
    transfer: (props) => {
      if (!props.params) {
        return props
      }

      let params = {}
      for (const field of fields) {
        if (props.params[field]) {
          params[field] = props.params[field]
        }
      }

      return {
        ...props,
        ...params
      }
    }
  }
}

export function map(...mappers) {
  return (Comp) => {
    // console.log('comp', url, params);
    class LoadComp extends Component {
      constructor(props, context) {
        super(props, context)

        this.store = props.store || context.store

        invariant(this.store,
          `Could not find "store" in either the context or ` +
          `props`
        )

        // Call mappers to build init state
//        console.log('Call mappers to build init state')
        let state = props
        for (const mapper of mappers) {
          if (mapper.init) {
            state = mapper.init(state)
          }
        }

        for (const mapper of mappers) {
          if (mapper.transfer) {
            state = mapper.transfer(state)
          }
        }

        this.state = state
        this.loadData = this.loadData.bind(this)
        this.refresh = this.refresh.bind(this)
      }

      componentWillMount() {
//        console.log('will mount', this.props);
        this.loadData(this.props)
      }

      async componentWillReceiveProps(nextProps) {
        if (!isSameParams(nextProps, this.props)) {
          // Only load data if props changed
//          console.log('will receive props', nextProps);
          this.loadData(nextProps)
        }
      }

      async loadData(nextProps, force=false) {
//        console.log('load data', force);
        let data = {...nextProps}
        for (const mapper of mappers) {
          if (mapper.propsChange) {
            data = await mapper.propsChange(data, {force, dispatch: this.store.dispatch})
          }
        }

        for (const mapper of mappers) {
//          console.log('mapper', mapper);
          if (mapper.transfer) {
            data = mapper.transfer(data)
          }
        }
//        console.log('data after call props change', data);

        this.setState(data)
      }

      refresh() {
        this.loadData(this.props, true)
      }

      render() {
        return (
          <Comp {...this.props} {...this.state} refresh={this.refresh} />
        )
      }
    }

    LoadComp.contextTypes = {
      store: storeShape
    }
    LoadComp.propTypes = {
      store: storeShape
    }

    return LoadComp
  }
}
