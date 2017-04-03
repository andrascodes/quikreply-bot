import React, { Component } from 'react'

import { FilterForm } from './FilterForm'
import { ConversationTable } from './ConversationTable'
import { Loading } from '../Loading'
import { Error } from '../Error'

import { createServiceApi } from '../lib/serviceApi'
import { isBetween, getDateRangeOfList } from '../lib/dateManipulation'

export class Conversations extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      conversations: undefined,
      participant: '',
      startDate: '',
      endDate: '',
      label: '',
      errorLabel: '',
      error: false
    }
  }

  loadConversations = createServiceApi(fetch).loadConversations

  componentDidMount() {

    this.loadConversations()
    .then(conversations => {
      if(this.props.location.state) {
        return this.setState(state => ({
          ...this.props.location.state,
          conversations
        }))
      }
      const dates = conversations.map(convo => convo.start)
      const { startDate, endDate } = getDateRangeOfList(dates)
      
      return this.setState(state => ({
        conversations,
        startDate,
        endDate,
      }))
    })
    .catch(error => {
      console.log(error)
      return this.setState(state => ({ error }))
    })
  }

  handleRowClick = id => e => {
    e.persist()
    e.preventDefault()
    this.props.history.push(`/conversations/${id}`, this.state)
  }

  handleParticipantInput = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      participant: e.target.value
    }))
  }

  handleStartInput = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      startDate: e.target.value
    }))
  }

  handleEndInput = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      endDate: e.target.value
    }))
  }

  handleLabelChange = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      label: e.target.value
    }))
  }

  handleErrorChange = e => {
    e.persist()
    e.preventDefault()
    this.setState(state => ({
      errorLabel: e.target.value
    }))
  }

  getParticipants = () => this.state.conversations
    .map(convo => convo.participant)
    .filter((person, ind, self) => self.indexOf(person) === ind)

  getDates = () => this.state.conversations.map(convo => convo.start)

  getLabels = () => this.state.conversations
    .map(convo => convo.label)
    .filter((label, ind, self) => self.indexOf(label) === ind)
    .map(label => ({
      value: String(label),
      text: String(label)
    }))
    .concat({
      value: '',
      text: '---'
    })
    .reverse()

  getErrors = () => this.state.conversations
    .map(convo => convo.errors)
    .filter((error, ind, self) => self.indexOf(error) === ind)
    .map(error => ({
      value: error,
      text: String(error)
    }))
    .concat({
      value: '',
      text: '---'
    })
    .reverse()

  // TODO: change label management 
  getFilteredConversationsList = () => this.state.conversations
    .filter(convo => {
      return convo.participant.includes(this.state.participant) &&
            isBetween(convo.start, this.state.startDate, this.state.endDate) &&
            (String(convo.label) === this.state.label || this.state.label === '') &&
            (String(convo.errors) === this.state.errorLabel || this.state.errorLabel === '')
    })

  render() {

    if(this.state.error) {
      return <Error />
    }
    else if(!this.state.conversations) {
      return <Loading />
    }
    else {
      const participantList = this.getParticipants()      
      const { startDate: minStartDate, endDate: maxEndDate } = getDateRangeOfList(this.getDates())
      const labelOptions = this.getLabels()
      const errorOptions = this.getErrors()

      const filteredConversationList = this.getFilteredConversationsList()

      return (
        <div className="Conversations">
          <div className="container-fluid">
            <h1>Conversations</h1>
            <FilterForm 
              participantList={participantList}
              handleParticipantInput={this.handleParticipantInput}
              defaultParticipantValue={this.state.participant}
              
              minStartDate={minStartDate}
              maxEndDate={maxEndDate}
              defaultStartValue={this.state.startDate}
              defaultEndValue={this.state.endDate}
              handleStartInput={this.handleStartInput}
              handleEndInput={this.handleEndInput}
              
              labelOptions={labelOptions}
              handleLabelChange={this.handleLabelChange}
              defaultLabelValue={this.state.label}
              
              errorOptions={errorOptions}
              handleErrorChange={this.handleErrorChange}
              defaultErrorValue={this.state.errorLabel}
            />
            <ConversationTable 
              conversations={filteredConversationList}
              handleRowClick={this.handleRowClick}
            />
            {(this.state.conversations.length <= 0) ?
              <div className="NoConversations text-center">
                <h2>No conversations to display.</h2>
              </div> : ''}
          </div>
        </div>
      )

    }
  }
}