# tb-react
> React library for building internal portal

## connect()

```
import * as tb from 'tb-react'

tb.connect(map, transformers)(MyComponent)
```

`map` is something like `redux` (`mapStateToProps(state, ownProps)` and `mapDispatchToProps(dispatch)`)

```javascript
{
  props: (state, ownProps, dispatch) => componentProps
}
```

## Form

```javascript
import * as tb from 'tb-react'

@tb.connect(
  {
    // Do something when componentWillMount, e.g. call API to load data
    start: (props, dispatch) => {},

    // Transform state, ownProps and dispatch to new props
    props: (state, ownProps, dispatch) => ({
      ...state,
      newProp: 123,
    })
  },
  tb.form(props => ({
    url: 'api/url',
    schema: myFormSchema,
    // To change the style of the rendered form
    rendererOptions: {
      getRowStyle(fieldSchema) {
        return  "class-name-for-row"
      },
      getControlStyle(fieldSchema) {
        return {
           inputClass: 'class-name-for-input-field'
        }
      }
    },
    // When form submitted
    complete: (data) => {
      // console.log('response', data);
      // tb.success(`Form is submitted`)
    },
    // When form submit error
    error: (err, data) => {
      //
      tb.error(err.data.message)
    }
  })),
)
class MyComponent extends Component {
  render() {
    const {form, newProp} = this.props

    return (
      <div>
        {
          form.renderForm(null, {
            submit: {
              name: 'Submit',
              icon: '',
              inputClass: 'default-class-name-for-input-field'
            }
          })
        }

      </div>
    )
  }
}
```

## actions

```javascript
import {
  APIAction,
  ReducerSet,
  createSchema,
} from 'tb-react'

export const accountFieldSchema = [
  {
    field: 'username',
    title: 'Username',
    type: 'string',
  },
  {
    field: 'password',
    title: 'Password',
    type: 'string',
  },
  {
    field: 'UpFrom',
    title: 'Up từ',
    type: 'number',
  },
  {
    field: 'UpTo',
    title: 'Đến',
    type: 'number',
  },
  {
    field: 'SleepTime',
    title: 'Thời gian chờ (giây)',
    type: 'number',
  },
  {
    field: 'IsVIP',
    title: 'VIP',
    type: 'boolean',
  },
]

export const accountSchema = createSchema(accountFieldSchema)

export const accountFields = accountSchema.fields;
export const accountFieldTitles = accountSchema.titles;

export const accountActions = {
  update: (site, data) => state => ({...state, [site]: data}),
  load: APIAction(site => ({
    url: 'Account/all_by_site',
    params: {site, fields: accountFields.join(',')},
    success: (dispatch, data) => {
//       console.log('data', data);
      dispatch(accountActions.update, site, data)
    },
    error: (dispatch) => {},
  })),
  // Clean all accounts data
  clean: () => state => ({}),
}

export const accountFilterActions = {
  add: (field, value) => state => {
    const ret = {}
    if (state.fields.indexOf(field) < 0) {
      ret.fields = [...state.fields, field]
    } else {
      ret.fields = state.fields
    }

    ret.data = {...state.data, [field]: value}
    // console.log(ret);

    return ret
  },
  change: ReducerSet(),
}

export default {
  accounts: [accountActions, {}],
  accountFilter: [accountFilterActions, {fields: [], data: {}}],
}
```
