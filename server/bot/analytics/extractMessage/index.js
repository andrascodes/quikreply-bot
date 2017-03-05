'use strict'

const initMessage = require('./initMessage')
const extractParticipant = require('./extractParticipant')
const extractType = require('./extractType')
const extractText = require('./extractText')
const extractTimestamp = require('./extractTimestamp')
const extractError = require('./extractError')

module.exports = (msg, direction) => {
  
  const message = initMessage(msg, direction)
  .map(msg => extractParticipant(msg))
  .map(msg => extractType(msg))
  .map(msg => extractText(msg))
  .map(msg => extractTimestamp(msg))
  .map(msg => extractError(msg))
  .reduce((prev, msg) => msg)

  return message
}