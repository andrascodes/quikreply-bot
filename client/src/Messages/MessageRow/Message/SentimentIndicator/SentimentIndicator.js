import React from 'react'

import './SentimentIndicator.css'

export const SentimentIndicator = props => {
  if(!props.value) {
    return (<div></div>)
  }
  
  const valueMap = {
    positive: {
      className: 'Positive',
      text: 'positive',
      icon: 'fa-check',
      style: {
        
      }
    },
    neutral: {
      className: 'Neutral',
      text: 'neutral',
      icon: 'fa-check'
    },
    negative: {
      className: 'Negative',
      text: 'negative',
      icon: 'fa-times'
    }
  }

  const { text, icon, className } = valueMap[props.value]

  return (
    <div className="Sentiment">
      {`Sentiment: `}
      <span className={`${className}`}>{text}</span>
      <i className={`fa ${icon} ${className} Icon`}></i>
    </div>
  )
}