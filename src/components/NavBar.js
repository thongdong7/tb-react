import React, {Component, PropTypes} from 'react'

import {NavLink} from './NavLink'

export class NavBar extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired
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
