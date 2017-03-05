'use strict'

// Setup DB connection
const Sequelize = require('sequelize')
const ConversationArray = require('./lib/ConversationArray')
const createDB = require('./models')

module.exports = databaseUrl => {
  if(databaseUrl) {
    return createDB({
      sequelize: new Sequelize(databaseUrl),
      conversationArray: new ConversationArray()
    })
  }
  else {
    return undefined
  }
}