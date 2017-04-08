'use strict'

function extractErrorFromOutgoing(msg) {
  const response = msg.response

  if(response.error) {
    return response.error.type
  }
  else {
    return null
  }
}
// For outgoing messages the timestamp should already be there

module.exports = function extractError(msg) {
  const getTimestamp= {
    'incoming': msg => null,
    'outgoing': msg => extractErrorFromOutgoing(msg)
  }[msg.direction]

  try {
    if(msg instanceof Error) {
      return msg
    }

    return Object.assign({ error: getTimestamp(msg) }, msg)

  } catch(error) {
    return error
  }
}