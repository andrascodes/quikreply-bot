'use strict'

const test = require('tape')

const TIMEOUT = 100
const createSaveMessage = require('./')


const fetch = require('node-fetch')
const { testDatabaseUrl, nlpApiUrl } = require('../../../config')
const db = require('../../../db')(testDatabaseUrl)
const nlpApiService = require('../../services/NlpApiService')(fetch, nlpApiUrl)
const conversationService = require('../../services/ConversationService')(db, nlpApiService)
const messageService = require('../../services/MessageService')(db, nlpApiService)
const activeConversations = require('../ConversationArray')({ conversationService, timeout: TIMEOUT })

test(`Analytics#saveMessage`, nest => {

  const wasCalled = {
    activeConversations: {
      getConversation: false,
      saveConversation: false,
    },
    conversationService: {
      saveOne: false,
    },
    messageService: {
      saveOne: false,
      setRead: false,
      setDelivered: false
    }
  }
  let conversations = {}
  const activeConversations = {
    getConversation: () => { 
      wasCalled.activeConversations.getConversation = true 
      return conversations['123']
    },
    saveConversation: () => { 
      conversations['123'] = 1
      wasCalled.activeConversations.saveConversation = true  
    }
  }

  const conversationService = {
    saveOne: () => { 
      wasCalled.conversationService.saveOne = true 
      return ({ id: 1 }) 
    }
  }

  const messageService = {
    saveOne: () => { wasCalled.messageService.saveOne = true },
    setRead: () => { wasCalled.messageService.setRead = true },
    setDelivered: () => { wasCalled.messageService.setDelivered = true }
  }

  const saveMessage = createSaveMessage(activeConversations, conversationService, messageService)

  nest.test(`Analytics#saveMessage: should not log echo Messages`, async assert => {
    const result = await saveMessage({ type: 'echo' })
    assert.ok(Object.keys(result).includes('error'), 'should return an object with an error prop')
    assert.end()
  })
  
  nest.test(`Analytics#saveMessage: should call messageService.setDelivered with delivery Messages`, async assert => {
    wasCalled.messageService.setDelivered = false
    const result = await saveMessage({ type: 'delivery' })
    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')
    assert.ok(wasCalled.messageService.setDelivered, 'should call messageService.setDelivered')
    assert.end()
  })

  nest.test(`Analytics#saveMessage: should call messageService.setRead with read Messages`, async assert => {
    wasCalled.messageService.setRead = false
    const result = await saveMessage({ type: 'read' })
    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')
    assert.ok(wasCalled.messageService.setRead, 'should call messageService.setRead')
    assert.end()
  })

  nest.test(`Analytics#saveMessage: should create a NEW Conversation and save it into the activeConversations`, async assert => {
    conversations = {}
    wasCalled.activeConversations.getConversation = false
    wasCalled.conversationService.saveOne = false
    wasCalled.activeConversations.saveConversation = false
    wasCalled.messageService.saveOne = false

    const result = await saveMessage({ type: 'text' })

    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')

    assert.ok(wasCalled.activeConversations.getConversation, 'should call activeConversations.getConversation')
    assert.ok(wasCalled.conversationService.saveOne, 'should call conversationService.saveOne')
    assert.ok(wasCalled.activeConversations.saveConversation, 'should call activeConversations.saveConversation')
    assert.ok(wasCalled.messageService.saveOne, 'should call messageService.saveOne ')
    assert.equal(conversations['123'], 1, 'should save the new Conversation')
    assert.end()
  })

  nest.test(`Analytics#saveMessage: should save a message into the existing conversation`, async assert => {
    conversations = {
      '123': 1
    }
    wasCalled.activeConversations.getConversation = false
    wasCalled.messageService.saveOne = false

    const result = await saveMessage({ type: 'text' })

    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')

    assert.ok(wasCalled.activeConversations.getConversation, 'should call activeConversations.getConversation')
    assert.ok(wasCalled.messageService.saveOne, 'should call messageService.saveOne ')
    assert.end()
  })
})

test(`Analytics#saveMessage - integration`, async assert => {
  const saveMessage = createSaveMessage(activeConversations, conversationService, messageService)

  const incomingMessage = {
    participant: '123',
    type: 'text',
    text: 'First Message'
  }

  try {
    await db.sequelize.sync({ force: true })
    const result = await saveMessage(incomingMessage)
    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')

    const [savedConversation, savedMessage] = await Promise.all([
      db.Conversation.findOne({ 
        where: { 
          participant: incomingMessage.participant 
        }
      }),
      db.Message.findOne({
        where: {
          text: incomingMessage.text
        }
      })
    ])

    assert.ok(savedConversation)
    assert.ok(savedMessage)

    db.sequelize.close()
    assert.end()
  }
  catch(error) {
    assert.fail(error)
    db.sequelize.close()
    assert.end()
  }
})