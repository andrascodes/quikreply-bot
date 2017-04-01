import React from 'react'

import { Message } from './Message'

export const MessageRow = props => {
  let IncomingMessage = ''
  let OutgoingMessage = ''
  if(props.direction === 'incoming') {
    IncomingMessage = (
      <Message {...props}/>
    )
  }
  else {
    OutgoingMessage = (
      <Message {...props}/>
    )
  }

  return (
    <div className="row">
      <div className="col-lg-1 col-md-1"></div>
      <div className="col-lg-5 col-md-5">
        {IncomingMessage}
      </div>
      <div className="col-lg-5 col-md-5">
        {OutgoingMessage}
      </div>
      <div className="col-lg-1 col-md-1"></div>
    </div>
  )
}