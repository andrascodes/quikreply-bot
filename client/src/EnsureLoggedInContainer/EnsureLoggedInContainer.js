import React from 'react'
import { withRouter, Redirect } from 'react-router-dom'

export const EnsureLoggedInContainer = withRouter(props => {
  localStorage.qrToken = 'token'
  // localStorage.clear()

  if(!localStorage.qrToken) {
    return (
      <Redirect to={{
        pathname: '/login',
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