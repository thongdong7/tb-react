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

export class NavBar extends Component {
  static propTypes = {
    items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
  }

  render() {
    return (
      <ul className="nav nav-tabs">
        {this.props.items.map(({url, title}) => {
          return (
            <NavLink key={url} to={url}>{title}</NavLink>
          )
        })}
      </ul>
    )
  }
}

export {Link}
