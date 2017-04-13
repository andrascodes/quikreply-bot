'use strict'

const extract = require('../extractMessage')

const logMessage = (saveMessage, direction) => (msg, res) => {
  
  let message = undefined
  if(direction === 'outgoing') {
    msg.timestamp = Date.now().toString()
    message = extract({ message: msg, response: res }, 'outgoing')
  }
  else {
    message = extract(msg, 'incoming')
  }

  if(message instanceof Error) {
    if(process.env.NODE_ENV !== 'test') {
      console.error(message)
    }
  }
  else {
    return saveMessage(message)
  }
}

module.exports = logMessage