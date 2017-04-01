import React, { Component } from 'react'

import { MessageRow } from './MessageRow'
import { MessageHeader } from './MessageHeader'
import { createServiceApi } from '../lib/serviceApi'

export class Messages extends Component {
  
  constructor(props) {
    super(props)
    // console.log(props)

    this.state = {
      id: props.match.params.id,
      messages: [],
      error: false
    }
  }

  loadMessages = createServiceApi(fetch).loadMessages

  componentDidMount() {
    this.loadMessages(this.state.id)
    .then(convo => this.setState(state => ({ 
      messages: convo.messages,
      participant: convo.participant,
      startDate: convo.start,
      endDate: convo.end,
      label: convo.label 
    })))
    .catch(error => {
      console.log(error)
      return this.setState(state => ({ error }))
    })
  }

  render() {

    const thread = this.state.messages.map((msg, ind) => {
      if(msg.direction) {
        return (
          <MessageRow key={msg.id} {...msg}/>
        )
      }
      else {
        return (
          ind % 2 === 0 ? 
            <MessageRow key={msg.id} {...msg} direction="incoming"/> :
            <MessageRow key={msg.id} {...msg} direction="outgoing"/>
        )
      }
    })

    let filterState = {}
    if(this.props.location.state) {
      const { participant, startDate, endDate, label, errorLabel } = this.props.location.state
      filterState = { participant, startDate, endDate, label, errorLabel }
    }

    return (
      <div className="Messages">
        <MessageHeader 
          participant={this.state.participant}
          label={this.state.label}
          startDate={this.state.startDate}
          filterState={filterState}
        />
        <div className="container">
          {thread}
        </div>
      </div>
    )
  }
  
} 