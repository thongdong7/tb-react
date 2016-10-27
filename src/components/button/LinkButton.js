// @flow
import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'

export const LinkButton = ({type="info", icon="link", to, name}) => {
  return (
    <Link to={to} className={`btn btn-xs btn-${type}`}>
      {
        icon &&
        <span className={`glyphicon glyphicon-${icon}`} aria-hidden="true"></span>
      }
      {icon && " "}
      {name}
    </Link>
  )
}

LinkButton.propTypes = {
  name: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}
