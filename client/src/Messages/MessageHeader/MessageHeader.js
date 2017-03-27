import React from 'react'
import { Link } from 'react-router-dom'

import { formatDate } from '../../lib/dateManipulation'

import './MessageHeader.css'

export const MessageHeader = props => (
  <div className="MessageHeader">
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-4 col-md-4 col-sm-4 text-left">
          <Link to={{
            pathname: '/conversations',
            state: props.filterState
          }}>Back</Link>
        </div>
        <div className="col-lg-4 col-md-4 col-sm-4 text-center">{props.participant}</div>
        <div className="col-lg-4 col-md-4 col-sm-4 text-right">{formatDate(props.startDate)}</div>
      </div>
    </div>
  </div>
)