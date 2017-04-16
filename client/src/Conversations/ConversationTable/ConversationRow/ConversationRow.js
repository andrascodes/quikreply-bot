import React from 'react'

import { formatDate, calculateDuration } from '../../../lib/dateManipulation'

export const ConversationRow = props => (
  <tr id={props.id} onClick={props.handleRowClick}>
    <td>{props.participant}</td>
    <td>{formatDate(props.start)}</td>
    <td>{calculateDuration(props.start, props.end)}</td>
    <td>{props.label}</td>
    <td>{props.errors}</td>
  </tr>
)

ConversationRow.PropTypes = {
  id: React.PropTypes.number,
  handleRowClick: React.PropTypes.func.isRequired,
  participant: React.PropTypes.string.isRequired,
  start: React.PropTypes.string.isRequired,
  end: React.PropTypes.string.isRequired,
  errors: React.PropTypes.string,
  label: React.PropTypes.string
}