import React, {Component} from 'react'
import { Link } from 'react-router'

export class NavLink extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    const active = this.context.router.isActive(this.props.to)
    return (
      <li className={active ? "active" : ""}>
        <Link {...this.props} />
      </li>
    )
  }
}
