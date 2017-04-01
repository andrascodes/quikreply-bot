import React from 'react'
import ReactToolTip from 'react-tooltip'

import { ListMessage } from './ListMessage'
import { GenericMessage } from './GenericMessage'
import { ButtonMessage } from './ButtonMessage'

import './Bubble.css'

export const Bubble = props => {
  const direction = (props.direction === 'incoming') ? 'Incoming' : 'Outgoing'
  const tooltipTag = (props.error) ? { 'data-tip': 'React tooltip' } : {}

  let error = ''
  let Tooltip = ''
  if(props.error) {
    error = 'ErrorBubble'
    Tooltip = (
      <div className="ErrorTooltip">
        <ReactToolTip place="top" type="dark" effect="solid">
          {props.response.error.message}
        </ReactToolTip>
      </div>
    )
  }

  const mapMessageTypeToComponent = (type, message, text) => {
    if(type === 'text') {
      return (<div className="TextMessage">{(message && message.message && message.message.text) || text}</div>)
    }
    else if(type === 'quick_reply') {
      return (<div className="QuickReplyMessage">
                {`${message.message.text} (Payload: ${message.message.quick_reply.payload})`}
              </div>)
    }
    else if(type === 'postback' || type === 'referral_existing' || type === 'referral_new') {
      return (<div className="PostbackMessage">
                {`POSTBACK (Payload: ${message.postback.payload})`}
              </div>)
    }
    else if(type === 'list') {
      return (<ListMessage {...message.message} />)
    }
    else if(type === 'generic') {
      return (<GenericMessage {...message.message} />)
    }
    else if(type === 'button') {
      return(
        <ButtonMessage {...message.message}/>
      )
    }
    else if(type === 'image' || type === 'sticker') {
      return (
        message.message.attachments.map((img, ind) => (
          <img src={img.payload.url} alt="" key={ind} className="ImageMessage img-responsive"/>
        ))
      )
    }
    else if(type === 'audio' || type === 'file' || type === 'video') {
      const typeToPropertiesMap = {
        audio: {
          className: 'AudioMessage',
          text: 'Audio message',
          icon: 'fa-volume-up'
        },
        file: {
          className: 'FileMessage',
          text: 'File message',
          icon: 'fa-file-o'
        },
        video: {
          className: 'VideoMessage',
          text: 'Video message',
          icon: 'fa-video-camera'
        }
      }
      const properties = typeToPropertiesMap[type]

      return (
        message.message.attachments.map((file, ind) => (
          <div key={ind} className={`MediaMessage ${properties.className}`}>
            <i className={`fa ${properties.icon}`} />
            {` ${properties.text} `}
            <a href={file.payload.url} target="_blank">
              <i className="fa fa-download" />
            </a>
          </div>
        ))
      )
    }
    else if(type === 'location') {
      return (
          message.message.attachments.map((loc, ind) => (
            <div className="LocationMessage" key={ind}>
              <a 
                className="LocationTitle" 
                href={`https://www.google.com/maps/?q=${loc.payload.coordinates.lat},${loc.payload.coordinates.long}`}
                target="_blank"
              >
                {`${loc.title}:`}
              </a>
              <div className="LocationCoordinates">
                {`Latitude: ${loc.payload.coordinates.lat}`}
                <br/>
                {`Longitude: ${loc.payload.coordinates.long}`}
              </div>
            </div>
          ))
      )
    }
    else {
      return(
        <div className="UnknownMessage">
          {props.text}
        </div>
      )
    }
  }

  const message = mapMessageTypeToComponent(props.type, props.message, props.text)
  
  return (
    <div>
      <div className={`${direction} Bubble ${error}`} {...tooltipTag} >
        {message}
      </div>
      {Tooltip}
    </div>
  )
}