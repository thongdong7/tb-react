import api from './api'
import {isSameParams} from './data'
import {Form} from './form'
import {selectProps} from './props'

import * as fs from './form'

export function _get(_api, url, {fields=[], params, defaultData=[]}={}) {
  let lastAPIParams = null
  return {
    init: (props) => {
      lastAPIParams = null
      return {...props, data: defaultData}
    },
    propsChange: async (nextProps, force) => {
      let compParams = {}
      for (const field of fields) {
        if (nextProps[field]) {
          compParams[field] = nextProps[field]
        } else if (nextProps.params && nextProps.params[field]) {
          // Load from react router params
          compParams[field] = nextProps.params[field]
        }
      }

      const apiParams = {...params, ...compParams}
//      console.log('api params', apiParams, fields);
      if (force || !isSameParams(apiParams, lastAPIParams)) {
//        console.log('load api');
        let data = await _api.load(url, apiParams)

        // console.log(data);
        lastAPIParams = apiParams

        return {
          ...nextProps,
          data
        }
      }

      return nextProps
    }
  }
}

export const get = _get.bind(undefined, api)

export function _get2(_api, action) {
  let lastAPIParams = null
  return {
//    init: (props) => {
//      lastAPIParams = null
//      return {...props, data: defaultData}
//    },
    propsChange: async (nextProps, {dispatch, force}) => {
      console.log('get2 props change', dispatch);
//      let compParams = {}
//      for (const field of fields) {
//        if (nextProps[field]) {
//          compParams[field] = nextProps[field]
//        } else if (nextProps.params && nextProps.params[field]) {
//          // Load from react router params
//          compParams[field] = nextProps.params[field]
//        }
//      }
//
//      const apiParams = {...params, ...compParams}
//      console.log('api params', apiParams, fields);
//      if (force || !isSameParams(apiParams, lastAPIParams)) {
////        console.log('load api');
//        let data = await _api.load(url, apiParams)
//
//        // console.log(data);
//        lastAPIParams = apiParams
//
//        return {
//          ...nextProps,
//          data
//        }
//      }
      let data = await dispatch(action)
      console.log('get2 data', data);
      return {
        ...nextProps,
        data
      }

      return nextProps
    }
  }
}

export const get2 = _get2.bind(undefined, api)

export function _buildFormSubmit(_api, url, {fields=[], params}={}) {
  return (props, schema) => async (formData={}) => {
//        console.log('call', props, form);
    let compParams = {}
    for (const field of fields) {
      if (props[field]) {
        compParams[field] = props[field]
      }
    }

    // console.log('form datra', formData, schema);
    const normalizedFormData = fs.normalizedFormData(formData, schema)
    // console.log('normalize data', normalizedFormData);

    const apiParams = {...params, ...compParams, ...normalizedFormData}
//        console.log('comp params', apiParams);

    const tmp = await _api.load(url, apiParams)

//        console.log('post', tmp);
    return tmp
  }
}

export const buildFormSubmit = _buildFormSubmit.bind(undefined, api)

export function _post(_api, url, {prop, fields=[], params}={}) {
  return {
    transfer: (props) => {
      return {
        ...props,
        [prop]: _buildFormSubmit(_api, url, {fields, params})(props)
      }
    }
  }
}

export const post= _post.bind(undefined, api)

export function _form(_api, formBuilder) {
  return {
    transfer: (props) => {
      const config = formBuilder(props)
      if (!config) {
        // No config
        return props
      }

      const {
        url,
        name="form",
        fields=[],
        data={},

        // Form options
        complete,
        schema,
        editable=false
      } = config

      const formSchema = fs.buildSchema(schema)

      const submit = _buildFormSubmit(_api, url)(props, formSchema)

      return {
        ...props,
        [name]: new Form(
          {...selectProps(props, fields), ...data},
          submit,
          {
            schema,
            complete,
            editable
          }
        )
      }
    }
  }
}

export const form = _form.bind(undefined, api)

export function _form2(_api, formBuilder) {
  return {
    transfer: (props) => {
      const config = formBuilder(props)
      if (!config) {
        // No config
        return props
      }

      const {
        url,
        name="form",
        fields=[],
        data={},

        // Form options
        complete,
        schema,
        editable=false
      } = config

      const submit = _buildFormSubmit(_api, url)(props)

      return {
        ...props,
        [name]: new Form(
          {...selectProps(props, fields), ...data},
          submit,
          {
            schema,
            complete,
            editable
          }
        )
      }
    }
  }
}

export const form2 = _form.bind(undefined, api)
