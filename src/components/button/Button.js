// @flow
import React, {Component, PropTypes} from 'react'
import { Link } from 'react-router'


export const Button = ({type="default", inputClass, icon, name, hideName=false, spin=false, onClick}) => {
  if (!inputClass) {
    inputClass = `btn btn-xs btn-${type}`
  }
  return (
    <span
      className={inputClass}
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
