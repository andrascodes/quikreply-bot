import React, { Component } from 'react'

import { Incoming, Outgoing } from './Bubbles'
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

  loadMessages = createServiceApi(fetch, 'http://localhost:5000/api/conversations').loadMessages

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
          msg.direction === 'incoming' ?
            <Incoming key={msg.id} text={msg.text} /> :
            <Outgoing key={msg.id} text={msg.text} />
        )
      }
      else {
        return (
          ind % 2 === 0 ? 
            <Incoming key={msg.id} text={msg.text} /> :
            <Outgoing key={msg.id} text={msg.text} />
        )
      }
    })

    const { participant, startDate, endDate, label, errorLabel } = this.props.location.state
    const filterState = { participant, startDate, endDate, label, errorLabel }

    return (
      <div className="Messages">
        <MessageHeader 
          participant={this.state.participant}
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