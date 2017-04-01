import React from 'react'

import { formatMessageTimestamp } from '../../../lib/dateManipulation'
import { SentimentIndicator as Sentiment } from './SentimentIndicator'
import { ErrorIndicator as Error } from './ErrorIndicator'
import { Bubble } from './Bubble'

import './Message.css'

export const Message = props => {

  return (
    <div>
      <div className="TimeIndicator text-center">
        {props.direction === 'incoming' ?
          `Arrived at ` : `Sent at `
        }
        {formatMessageTimestamp(props.timestamp)}
      </div>

      <Bubble type={props.type}
        text={props.text}
        direction={props.direction} 
        message={props.message} 
        response={props.response}
        error={props.error}
      />
      
      <div className="row Indicators">
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left">
          <Sentiment value={props.sentiment} />
        </div>
        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right">
          <Error value={props.error} response={props.response}/>
        </div>
      </div>
    </div>
  )
}