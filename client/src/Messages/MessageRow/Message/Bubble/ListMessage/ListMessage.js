import React from 'react'

// import url from 'url';

import './ListMessage.css'

export const ListMessage = props => (
  <div className="ListMessage">
    {props.attachment.payload.elements.map((elem, ind) => (
      <div className="ListElementContainer" key={ind}>
        <div className="ListElement row">
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-left">
            <div className="ListElementTitle">{elem.title}</div>
            <div className="ListElementSubtitle">{elem.subtitle}</div>
            <div className="ListElementDefaultAction ListElementSubtitle">
              {elem.default_action && new URL(elem.default_action.url).hostname}
            </div>
            {elem.buttons && elem.buttons.map((btn, ind) => (
              <div className="ListElementButton" key={ind}>
                {btn.title}
              </div>
            ))}            
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 text-right">
            <img className="ListElementImage" src={elem.image_url} alt=""/>
          </div>
        </div>
      </div>
    ))}

    {props.attachment.payload.buttons.map((btn, ind) => (
      <div key={ind} className="ListButton text-center">
        {btn.title}
      </div>
    ))}
  </div>
)