'use strict'

const extract = require('./extractMessage')
const fetch = require('node-fetch')
const createSaveMessage = require('./saveMessage')(fetch)

const logIncoming = saveMessage => msg => {
  
  const message = extract(msg, 'incoming')
  if(message instanceof Error) {
    console.error(message)
  }
  else {
    return saveMessage(message)
  }
}

const logOutgoing = saveMessage => (msg, res) => {
  
  // add a timestamp to Outgoing messages
  msg.timestamp = Date.now().toString()
  
  const message = extract({ message: msg, response: res }, 'outgoing')
  if(message instanceof Error) {
    console.error(message)
  }
  else {
    return saveMessage(message)
  }
}

module.exports = (db, nlpApiUrl) => ({
  logIncoming: logIncoming(createSaveMessage(db, nlpApiUrl)),
  logOutgoing: logOutgoing(createSaveMessage(db, nlpApiUrl))
})