import React from 'react'

import { Link, withRouter } from 'react-router-dom'
import { NavDropdown, MenuItem } from 'react-bootstrap'

import { createAuthApi } from '../lib/authApi'

import './Navbar.css'

export const Navbar = withRouter(props => {

  const logOut = createAuthApi(fetch).logout

  const handleSignOutClick = () => {
    logOut()
    .then(res => {
      localStorage.clear()
      props.history.push('/login')
    })
    .catch(error => {
      console.log(error)
      localStorage.clear()
      props.history.push('/login')
    })
  }

  const handleProfileClick = () => {
    props.history.push('/profile')
  }

  return (
    <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link to="/">
            <div className="navbar-brand">{props.brand}</div>
          </Link>
        </div>

        <ul className="nav navbar-nav navbar-right">
          <NavDropdown 
            title={<i className="fa fa-user NavDropdownIcon" />}
            id="NavDropdownMenu"
          >
            <MenuItem header >
              <div className="NavDropdownUsername">
                Signed in as {`'${localStorage.username}'`}
              </div>
            </MenuItem>
            <MenuItem divider/>
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleSignOutClick}>Sign out</MenuItem>
          </NavDropdown>
        </ul>
      </div>
    </nav>
  )
})
