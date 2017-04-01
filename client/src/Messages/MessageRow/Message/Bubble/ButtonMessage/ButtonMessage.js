import React from 'react'

import './ButtonMessage.css'

export const ButtonMessage = props => (
  <div className="ButtonMessage">
    <div className="ButtonMessageText ButtonDataContainer">
      {props.attachment.payload.text}
    </div>
    {props.attachment.payload.buttons.map((btn, ind) => (
      <div className="ButtonMessageButton ButtonDataContainer text-center" key={ind}>
        {btn.title}
      </div>
    ))}
  </div>
)