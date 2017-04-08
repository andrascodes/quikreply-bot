'use strict'

const test = require('tape')
const fetch = require('node-fetch')
const { nlpApiUrl, testDatabaseUrl } = require('../../config')

const nlpApiService = require('../services/nlpApiService')(fetch, nlpApiUrl)
const conversationService = require('../services/conversationService')()
const createConversationArray = require('./')

const delay = (time) => new Promise(resolve => setTimeout(resolve, time))

test('ConversationArray', nest => {

  const timeout = 100
  const activeConversations = createConversationArray({ conversationService, nlpApiService, timeout })
  const convArrayWithoutNLP = createConversationArray({ conversationService, timeout })
  
  nest.test(`ConversationArray: should return an object`, assert => {
    
    assert.ok(typeof activeConversations, 'object')
    assert.ok(typeof convArrayWithoutNLP, 'object')

    try {
      const convArrayWithoutConvService = createConversationArray({ timeout })
    }
    catch(error) {
      assert.equal(error.message, 'ConversationService is undefined', 
        'should throw error if ConversationService is not passed'
      )
    }
    
    assert.end()
  })

  nest.test(`ConversationArray: should have 'getConversation' method`, assert => {
    
    assert.ok(activeConversations.getConversation)
    assert.ok(convArrayWithoutNLP.getConversation)
    
    assert.end()
  })

  nest.test(`ConversationArray: should have 'saveConversation' method`, assert => {
    
    assert.ok(activeConversations.saveConversation)
    assert.ok(convArrayWithoutNLP.saveConversation)
    
    assert.end()
  })

  nest.test('ConversationArray: #getConversation', async assert => {

    const conversation = { id: 1, participant: '123' }

    const runTest = async (convArray, assert) => {
      assert.equal(convArray.getConversation(), undefined, `should return undefined if undefined participant is passed`)
      assert.equal(convArray.getConversation('123'), undefined, `should return undefined if ConversationArray is empty`)
      
      convArray.saveConversation(conversation)

      await delay(timeout - 10)
      assert.deepEqual(convArray.getConversation('123'), { id: conversation.id }, 
        `should return the Conversation if we wait less than timeOut`
      )
      await delay(timeout - 10)
      assert.deepEqual(convArray.getConversation('123'), { id: conversation.id }, 
        `should still return the Conversation because getConversation resets the timeOut`
      )
      await delay(timeout + 10)
      assert.deepEqual(convArray.getConversation('123'), undefined, 
        `should return undefined if we get the Conversation after timeOut`
      )
      
    }

    try {
      // With NLPApiService
      await runTest(activeConversations, assert)

      // WithOUT NLPApiService
      await runTest(convArrayWithoutNLP, assert)
    }
    catch(error) {
      assert.fail(error)
    }

    assert.end()
    
  })

  nest.test('ConversationArray: #saveConversation', async assert => {

    const conversation = { id: 1, participant: '123' }

    const runTest = async (convArray, assert) => {
      assert.equal(convArray.saveConversation(), undefined, 
        'should return undefined if undefined conversation is passed'
      )
      assert.deepEqual(convArray.saveConversation(conversation), { id: conversation.id }, 
        'should return the conversation that is passed'
      )

      await delay(timeout - 10)
      assert.deepEqual(convArray.getConversation(conversation.participant), { id: conversation.id }, 
        'should return the conversation if we wait less than timeout'
      )
      await delay(timeout + 10)
      assert.deepEqual(convArray.getConversation(conversation.participant), undefined, 
        'should return undefined if we wait more than timeout'
      )
    }

    try {
      // With NLPApiService
      await runTest(activeConversations, assert)
      // WithOUT NLPApiService
      await runTest(convArrayWithoutNLP, assert)
    }
    catch(error) {
      assert.fail(error)
    }
    assert.end()
  })

  nest.test('ConversationArray - integration:', async assert => {

    let endConversationWasCalled = false
    let conversationService = {
      closeOne: async () => { 
        endConversationWasCalled = true 
        return true
      }
    }
    const convArray = createConversationArray({ conversationService, timeout })
    const convo = { id: 1, participant: '123' }

    convArray.saveConversation(convo)

    try {
      await delay(timeout - 10)
      assert.notOk(endConversationWasCalled)
      await delay(timeout + 10)
      assert.ok(endConversationWasCalled)

      assert.end()
    }
    catch(error) {
      assert.fail(error)
      assert.end()
    }
  })

})



