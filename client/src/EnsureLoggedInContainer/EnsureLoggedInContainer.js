import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'

export const EnsureLoggedInContainer = withRouter(props => {

  if(!localStorage.apiToken) {
    return (
      <Redirect to={{
        pathname: '/login',
        state: {
          from: props.location
        }
      }}/>
    )
  }
  else if(props.location.pathname === '/login' || props.location.pathname === '/login/') {
    return (
      <Redirect to={{
        pathname: '/',
        state: {
          from: props.location
        }
      }}/>
    )
  }
  else {
    return props.children
  }
})