import React from 'react'

import './Outgoing.css'

export const Outgoing = props => (
  <div className="row">
    <div className="col-lg-1 col-md-1"></div>
    <div className="col-lg-5 col-md-5"></div>
    <div className="col-lg-5 col-md-5">
      <div className="Outgoing Bubble">
        {props.text}
      </div>
    </div>
    <div className="col-lg-1 col-md-1"></div>
  </div>
)