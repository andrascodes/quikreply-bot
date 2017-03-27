import React from 'react'

import './Incoming.css'

export const Incoming = props => (
  <div className="row">
    <div className="col-lg-1 col-md-1"></div>
    <div className="col-lg-5 col-md-5">
      <div className="Incoming Bubble">
        <div>
          {props.sentiment}
        </div>
        {props.text}
        <div>
          {props.error}
        </div>
      </div>
    </div>
    <div className="col-lg-5 col-md-5"></div>
    <div className="col-lg-1 col-md-1"></div>
  </div>
)