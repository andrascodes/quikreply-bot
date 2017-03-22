import React, { Component } from 'react'

import { FilterForm } from './FilterForm'
import { ConversationTable } from './ConversationTable'

export class Conversations extends Component {
  
  render() {
    return (
      <div>
        <h1>Conversations</h1>
        <FilterForm 
          participantList={[]}
          handleParticipantInput={() => {}}
          minStartDate={`2017-03-22`}
          maxEndDate={`2017-03-31`}
          handleStartInput={() => {}}
          handleEndInput={() => {}}
          labelOptions={[]}
          handleLabelChange={() => {}}
          errorOptions={[]}
          handleErrorChange={() => {}}
        />
        <ConversationTable 
          conversations={[]}
          handleRowClick={() => {}}
        />
      </div>
    )
  }
}