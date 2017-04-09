'use strict'

const test = require('tape')
const createDB = require('../../../db')
const { testDatabaseUrl } = require('../../../config')
const createConversationService = require('./')

const setup = () => {
  const db = createDB(testDatabaseUrl)
  const conversationService = createConversationService(db)
  return { db, conversationService }
}

test('ConversationService: ', nest => {
  
  const { db, conversationService } = setup()

  nest.test(`ConversationService: should return 'undefined' if 'db' is not passed`, assert => {
    const undefinedConversationService = createConversationService(undefined)
    assert.notOk(undefinedConversationService)
    assert.end()
  })

  nest.test(`ConversationService: should create object if 'db' is passed`, assert => {
    assert.equal(typeof conversationService, 'object')
    assert.end()
  })

  nest.test(`ConversationService: should have 'fetchByIdWithMessages' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('fetchByIdWithMessages'))
    assert.ok(conversationService.fetchByIdWithMessages)
    assert.end()
  })

  nest.test(`ConversationService: should have 'fetchAll' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('fetchAll'))
    assert.ok(conversationService.fetchAll)
    assert.end()
  })
  
  nest.test(`ConversationService: should have 'fetchAllWithMessagesAsText' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('fetchAllWithMessagesAsText'))
    assert.ok(conversationService.fetchAllWithMessagesAsText)
    assert.end()
  })
  
  nest.test(`ConversationService: should have 'updateWithLabels' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('updateWithLabels'))
    assert.ok(conversationService.updateWithLabels)
    assert.end()
  })

  nest.test(`ConversationService: should have 'saveOne' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('saveOne'))
    assert.ok(conversationService.saveOne)
    assert.end()
  })
  
  nest.test(`ConversationService: should have 'closeOne' method`, assert => {
    assert.ok(Object.keys(conversationService).includes('closeOne'))
    assert.ok(conversationService.closeOne)
    assert.end()
  })

})