// @flow
import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'


export const Button = ({type="default", icon, name, hideName=false, spin=false, onClick}) => {
  return (
    <span
      className={`btn btn-xs btn-${type}`}
      onClick={onClick}
      title={name}
    >
      {
        icon &&
        <span
          className={`glyphicon glyphicon-${icon} ${spin ? 'glyphicon-spin' : ''}`}
          aria-hidden="true"
        ></span>
      }
      {icon && " "}
      {!hideName && name}
    </span>
  )
}

Button.propTypes = {
  icon: PropTypes.string,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func
}
