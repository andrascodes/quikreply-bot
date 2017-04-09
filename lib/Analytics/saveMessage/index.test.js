'use strict'

const test = require('tape')

const TIMEOUT = 100
const createSaveMessage = require('./')

test.only(`Analytics#saveMessage`, nest => {

  const activeConversations = {
    getConversation: () => {},
    saveConversation: () => {}
  }

  const conversationService = {
    saveOne: () => { return ({ id: 1 }) }
  }

  const messageService = {
    saveOne: () => {},
    setRead: () => {},
    setDelivered: () => {}
  }

  const saveMessage = createSaveMessage(activeConversations, conversationService, messageService)

  nest.test(`Analytics#saveMessage: should not log echo Messages`, async assert => {
    const result = await saveMessage({ type: 'echo' })
    assert.ok(Object.keys(result).includes('error'), 'should return an object with an error prop')
    assert.end()
  })
  
  nest.test(`Analytics#saveMessage: should call messageService.setDelivered with delivery Messages`, async assert => {
    const result = await saveMessage({ type: 'delivery' })
    assert.ok(Object.keys(result).includes('result'), 'should return an object with a result prop')
    assert.end()
  })

})