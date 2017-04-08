'use strict'

function extractTimestampFromIncoming(msg) {
  if(msg.message.timestamp && msg.type != 'read') {
    return new Date(Number(msg.message.timestamp))
  }
  else if(msg.type === 'read'){
    // return new Date(Number(msg.message.read.watermark))
    return new Date(Number(msg.message.timestamp))
  }
  else if(msg.type === 'delivery'){
    return new Date(Number(msg.message.delivery.watermark))
  }
}

function extractTimestampFromOutgoing(msg) {
  return new Date(Number(msg.message.timestamp))
}

// For outgoing messages the timestamp should already be there

module.exports = function extractTimestamp(msg) {
  const getTimestamp= {
    'incoming': msg => extractTimestampFromIncoming(msg),
    'outgoing': msg => extractTimestampFromOutgoing(msg)
  }[msg.direction]

  try {
    if(msg instanceof Error) {
      return msg
    }

    return Object.assign({ timestamp: getTimestamp(msg) }, msg)

  } catch(error) {
    return error
  }
}