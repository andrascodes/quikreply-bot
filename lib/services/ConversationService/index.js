'use strict'

const createFetchByIdWithMessages = require('./fetchByIdWithMessages')

const createFetchAll = require('./fetchAll')

const createFetchAllWithMessagesAsText = require('./fetchAllWithMessagesAsText')

const createUpdateWithLabels = require('./updateWithLabels')

const createSaveOne = require('./saveOne')

const createCloseOne = require('./closeOne')

const createConversationService = (db, nlpApiService) => {
  if(!db) {
    return undefined
  }

  return ({
    fetchByIdWithMessages: createFetchByIdWithMessages(db.Conversation, db.Message),
    fetchAll: createFetchAll(db.Conversation),
    fetchAllWithMessagesAsText: createFetchAllWithMessagesAsText(db.Conversation, db.Message),
    updateWithLabels: createUpdateWithLabels(db.Conversation),
    saveOne: createSaveOne(db.Conversation),
    closeOne: createCloseOne(db.Conversation, nlpApiService)
  })
}

module.exports = createConversationService