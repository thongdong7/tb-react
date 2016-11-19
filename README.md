# tb-react
> React library for building internal portal

## Form

```javascript
@tb.connect(
  {
    props: (state, ownProps, dispatch) => ({
      ...state,
      newProp: 123,
    })
  },
  tb.form(props => ({
    url: 'api/url',
    schema: myFormSchema,
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
    complete: (data) => {
      // console.log('response', data);
      // tb.success(`Form is submitted`)
    },
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
              inputClass: 'btn btn-success btn-block btn-lg'
            }
          })
        }

      </div>
    )
  }
}
```
