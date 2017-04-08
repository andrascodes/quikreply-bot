'use strict'

const createConversationService = require('./conversationService')

module.exports = db => ({
  conversationService: createConversationService(db),
})