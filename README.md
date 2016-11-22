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
