import api from './api'
import {isSameParams} from './data'
import {Form} from './form'
import {selectProps} from './props'

import * as fs from './form'

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
