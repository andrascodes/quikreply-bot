import React from 'react'

import './Main.css'

export const Main = props => (
  <div className="Main">
    <div className="container-fluid">
      {props.children}
    </div>
  </div>
)
