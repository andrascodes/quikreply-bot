import React from 'react'

import { ConversationRow } from './ConversationRow'

export const ConversationTable = props => {

  const rows = props.conversations.map(convo => (
    <ConversationRow 
      key={convo.id}
      handleRowClick={props.handleRowClick(convo.id)}
      {...convo}   
    />
  ))

  return (
    <table className="table table-hover">
      <thead>
        <tr>
          <th>participant</th>
          <th>date</th>
          <th>duration</th>
          <th>label</th>
          <th>errors</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

ConversationTable.propTypes = {
  conversations: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.number,
    participant: React.PropTypes.string,
    start: React.PropTypes.string,
    end: React.PropTypes.string,
    errors: React.PropTypes.string,
    label: React.PropTypes.string
  })).isRequired,
  handleRowClick: React.PropTypes.func.isRequired
}