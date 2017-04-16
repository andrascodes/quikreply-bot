'use strict'

const test = require('tape')
const fetch = require('node-fetch')

const { testDatabaseUrl, nlpApiUrl } = require('../../../config')
const db = require('../../../db')(testDatabaseUrl)
const nlpApiService = require('../NlpApiService')(fetch, nlpApiUrl)
const createMessageService = require('./')

test(`MessageService`, nest => {

  const messageService = createMessageService(db, nlpApiService)
  const messageServiceWithoutNlpApi = createMessageService(db, undefined)

  nest.test(`MessageService: should return 'undefined' if 'db' is not passed`, assert => {
    const undefinedMessageService = createMessageService(undefined)
    assert.notOk(undefinedMessageService)
    assert.end()
  })

  nest.test(`MessageService: should create object if 'db' is passed`, assert => {
    assert.equal(typeof messageService, 'object')
    assert.equal(typeof messageServiceWithoutNlpApi, 'object', `should create object even without nlpApiService`)

    assert.end()
  })

  nest.test(`MessageService: should have a saveOne method`, assert => {
    assert.ok(Object.keys(messageService).includes('saveOne'))
    assert.ok(messageService.saveOne)

    const messageServiceWithoutNlpApi = createMessageService(db, undefined)
    assert.ok(Object.keys(messageServiceWithoutNlpApi).includes('saveOne'), `should have a saveOne method even without nlpApiService`)
    assert.ok(messageServiceWithoutNlpApi.saveOne, `should have a saveOne method even without nlpApiService`)
    assert.end()
  })
  
  nest.test(`MessageService: should have a setRead method`, assert => {
    assert.ok(Object.keys(messageService).includes('setRead'))
    assert.ok(messageService.setRead)

    assert.end()
  })

  nest.test(`MessageService: should have a setDelivered method`, assert => {
    assert.ok(Object.keys(messageService).includes('setDelivered'))
    assert.ok(messageService.setDelivered)

    assert.end()
  })

  nest.test(`MessageService#saveOne: should call nlpApiService.getSentiment if its defined`, async assert => {
    
    let getSentimentWasCalled = false
    const mockedNlpApiService = {
      getSentiment: () => { getSentimentWasCalled = true }
    }
    
    const mockedDb = {
      Conversation: {
        findOne: () => ({
          createMessage: () => ({
            get: () => 2,
          })
        })
      }
    }

    const messageServiceWithMockedNlpApi = createMessageService(mockedDb, mockedNlpApiService)
    await messageServiceWithMockedNlpApi.saveOne(2, {
      text: 'Test Message'
    })
    assert.ok(getSentimentWasCalled)

    assert.end()
  })

  nest.test(`MessageService#saveOne`, async assert => {

    try {
      await db.sequelize.sync({force: true})
      const convo = await db.Conversation.create({
        participant: '123',
      })

      const messageNotSaved = await messageService.saveOne(2, {
        text: 'A Message'
      })
      assert.equal(messageNotSaved, undefined, `should return undefined if conversation is not found`)

      const savedMessage = await messageService.saveOne(convo.get('id'), {
        text: 'A Message'
      })
      
      assert.ok(Object.keys(savedMessage).includes('id'), 'should return the id of the message')
      assert.equal(savedMessage.conversationId, convo.get('id'), 'should return the id of the conversation')

      const messageInDb = await db.Message.findOne({ where: { id: savedMessage.id }})
      assert.ok(messageInDb, 'should save the Message into DB')

      assert.ok(['positive', 'neutral', 'negative'].includes(messageInDb.get('sentiment')), 
        'should get sentiment from nlpApiService if the service is defined'
      )

      const savedMessageWithoutNlpApi = await messageServiceWithoutNlpApi.saveOne(convo.get('id'), {
        text: 'Another Message'
      })
      const messageInDbWithoutSentiment = await db.Message.findOne({ where: { id: savedMessageWithoutNlpApi.id }})
      assert.notOk(messageInDbWithoutSentiment.get('sentiment'), 
        'should not get sentiment from nlpApiService if the service is undefined'
      )

      // db.sequelize.close()
      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  const runReadOrDeliveredTests = async (msg, setFunction, assert) => {
    const participant = '123'
    await db.sequelize.sync({force: true})
    const firstMessage = await db.Message.create({
      participant,
      text: 'First Message',
      direction: 'outgoing',
      timestamp: new Date('2017-04-01 12:00').getTime(),
      read: false,
      delivered: false
    }) 
    const secondMessage = await db.Message.create({
      participant,
      text: 'Second Message',
      direction: 'outgoing',
      timestamp: new Date('2017-04-01 12:00:15').getTime(),
      read: false,
      delivered: false
    })
    const thirdMessage = await db.Message.create({
      participant,
      text: 'Third Message',
      direction: 'outgoing',
      timestamp: new Date('2017-04-01 12:01').getTime(),
      read: false,
      delivered: false
    })

    const errorMessage = await db.Message.create({
      participant,
      text: 'Error Message',
      direction: 'outgoing',
      timestamp: new Date('2017-04-01 11:00').getTime(),
      read: false,
      error: 'OAuthException',
      delivered: false
    })

    const incomingMessage = await db.Message.create({
      participant,
      text: 'Incoming Message',
      direction: 'incoming',
      timestamp: new Date('2017-04-01 11:01').getTime(),
    })

    const otherParticipantMessage = await db.Message.create({
      participant: '234',
      text: 'Others Message',
      direction: 'outgoing',
      timestamp: new Date('2017-04-01 11:02').getTime(),
      read: false,
      delivered: false
    })

    const read = await setFunction(new Date('2017-04-01 12:00:30'), participant)
    assert.ok(read > 0, `should set ${msg} for some message`)

    await Promise.all([
      firstMessage.reload(), 
      secondMessage.reload(), 
      thirdMessage.reload(), 
      errorMessage.reload(),
      incomingMessage.reload(),
      otherParticipantMessage.reload()
    ])
    assert.ok(firstMessage.get(`${msg}`) && secondMessage.get(`${msg}`), 
      `should set ${msg} for every message with timestamp less than or equal to the passed timestamp`
    )
    assert.notOk(thirdMessage.get(`${msg}`), 
      `should not set ${msg} for every message that has a bigger timestamp than the value passed`
    )

    assert.notOk(errorMessage.get(`${msg}`), 'should not set message that have errors')
    assert.notOk(incomingMessage.get(`${msg}`), 'should not set incoming messages')
    assert.notOk(otherParticipantMessage.get(`${msg}`), 'should not set messages that belong to an other participant')
  }

  nest.test(`MessageService#setRead`, async assert => {
    
    try {

      const noTimestamp = await messageService.setRead()
      assert.equal(noTimestamp, undefined, `should return undefined if timestamp or participant is not passed`)

      await runReadOrDeliveredTests('read', messageService.setRead, assert)
      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })

  nest.test(`MessageService#setDelivered`, async assert => {
    
    try {

      const noTimestamp = await messageService.setDelivered()
      assert.equal(noTimestamp, undefined, `should return undefined if timestamp or participant is not passed`)

      await runReadOrDeliveredTests('delivered', messageService.setDelivered, assert)

      db.sequelize.close()
      assert.end()
    }
    catch(error) {
      assert.fail(error)
      db.sequelize.close()
      assert.end()
    }
  })



})