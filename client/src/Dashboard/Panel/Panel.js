import React from 'react'

export const Panel = props => {
  const { previous, number } = props
  
  let panelTheme = `panel-info`
  if(number > previous) {
    panelTheme = `panel-success`
  }
  else if(number === previous) {
    panelTheme = `panel-warning`
  }
  else if(number < previous) {
    panelTheme = `panel-danger`
  }

  return (
    <div className={`panel ${panelTheme}`}>
      <div className="panel-heading">
        <div className="row">
          <div className="col-xs-3">
            <i className={`fa ${props.icon} fa-5x`}></i>
          </div>
          <div className="col-xs-9 text-right">
            <div className="huge" style={{ fontSize: `${40}px` }}>{props.number}</div>
            <div>{props.label}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

Panel.PropTypes = {
  icon: React.PropTypes.string,
  number: React.PropTypes.number.isRequired,
  previous: React.PropTypes.number,
  label: React.PropTypes.string.isRequired
}