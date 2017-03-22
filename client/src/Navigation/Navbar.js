import React from 'react'

import { Link } from 'react-router-dom'

export const Navbar = props => (
  <nav className="navbar navbar-inverse navbar-fixed-top">
    <div className="navbar-header">
      <Link to="/">
        <div className="navbar-brand">{props.brand}</div>
      </Link>
    </div>
  </nav>
)
