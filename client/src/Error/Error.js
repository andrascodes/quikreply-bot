import React from 'react'

export const Error = props => (
  <div className="container-fluid">
    <h2>Error. {props.text || `Try again later!`}</h2>
  </div>
)