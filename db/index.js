'use strict'

// Setup DB connection
const Sequelize = require('sequelize')
const fetch = require('node-fetch')
const ConversationArray = require('./lib/ConversationArray')(fetch)
const createDB = require('./models')

module.exports = (databaseUrl, nlpApiUrl) => {
  if(databaseUrl) {
    return createDB({
      sequelize: new Sequelize(databaseUrl),
      conversationArray: ConversationArray(nlpApiUrl)
    })
  }
  else {
    return undefined
  }
}