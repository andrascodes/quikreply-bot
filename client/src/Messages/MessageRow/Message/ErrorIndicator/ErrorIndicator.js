import React from 'react'

import './ErrorIndicator.css'

export const ErrorIndicator = props => {
  if(!props.value) {
    return (<div></div>)
  }

  return (
    <div className="ErrorIndicator">
      {`Error: `}
      <span className="ErrorStyle">{`${props.value} #${props.response.error.code}`}</span>
      <i className="fa fa-times ErrorStyle Icon"></i>
    </div>
  )
}