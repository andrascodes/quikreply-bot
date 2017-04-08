'use strict'

module.exports = function extractParticipant(msg) {

  const getParticipant = {
    'incoming': m => Object.assign({ participant: m.message.sender.id }, m),
    'outgoing': m => Object.assign({ participant: m.message.recipient.id }, m)
  }[msg.direction]

  try {
    if(msg instanceof Error) {
      return msg
    }
    return getParticipant(msg)
  } catch(error) {
    return error
  }
}