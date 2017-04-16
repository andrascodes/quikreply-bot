import React from 'react'

import './GenericElement.css'

// image_url, title, subtitle, default_action.url, buttons, btn.title
export const GenericElement = props => {
  return (
    <div className="GenericElement">
      <img className="GenericElementImage img-responsive" src={props.element.image_url} alt=""/>
      <div className="GenericElementTitleContainer GenericDataContainer text-left">
        <div className="GenericElementTitle">
          {props.element.title}
        </div>
        <div className="GenericElementSubtitle">
          {props.element.subtitle}
        </div>
        <div className="GenericElementDefaultAction GenericElementSubtitle">
          {props.element.default_action && new URL(props.element.default_action.url).hostname}
        </div>
      </div>
      {props.element.buttons.map((btn, ind) => (
        <div className="GenericElementButton GenericDataContainer text-center" key={ind}>
          {btn.title}
        </div>
      ))}
    </div>
  )
}