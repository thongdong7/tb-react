import React from 'react'

let switchId = 0

export class Switch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      id: switchId,
      checked: props.checked ? true : false
    }

    switchId++
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.checked !== this.state.checked) {
      this.setState({checked: nextProps.checked})
    }
  }

  onChange= ({target: {checked}}) => {
    if (this.props.onChange) {
      // console.log(e.target.checked);
      this.props.onChange(checked)
    }
    this.setState({checked})
  }

  render() {
    // console.log('switch', this.state.checked);
    return (
      <span>
        <input
          id={"cmn-toggle-"+this.state.id}
          className="cmn-toggle cmn-toggle-round"
          type="checkbox"
          onChange={this.onChange}
          checked={this.state.checked}
        />
        <label htmlFor={"cmn-toggle-"+this.state.id}></label>
      </span>
    )
  }
}
