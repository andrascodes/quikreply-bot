'use strict'

const test = require('tape')
const fetch = require('node-fetch')
const { nlpApiUrl, testDatabaseUrl } = require('../../../../config')

const db = require('../../../../db')(testDatabaseUrl)
const nlpApiService = require('../../nlpApiService')(fetch, nlpApiUrl)
const closeOne = require('./')(db.Conversation, nlpApiService)
const closeOneWithoutNlp = require('./')(db.Conversation)

test(`#closeOne`, async assert => {
  assert.equal(typeof closeOne, 'function', `should be a function`)
  
  const convo = { id: 1, participant: '123', startTimestamp: new Date('2017-04-01 19:01') }
  const lastMessageAt = new Date('2017-04-01 19:03')

  const runTest = async (close, { withOutNlp = false } = {}) => {
    await db.sequelize.sync({ force: true })
    const savedConvo = await db.Conversation.create(convo)
    await savedConvo.createMessage({
      id: 1,
      participant: convo.participant,
      timestamp: convo.startTimestamp,
      text: 'First Message'
    })
    await savedConvo.createMessage({
      id: 2,
      participant: convo.participant,
      timestamp: lastMessageAt,
      text: 'Last Message',
      error: 'OAuthException'
    })
    await close(convo.id)

    const updatedConvo = await db.Conversation.findOne({ where: { id: convo.id }})
    assert.ok(updatedConvo.get('endTimestamp'), `should add endTimestamp field`)
    assert.deepEqual(updatedConvo.get('endTimestamp'), lastMessageAt, 
      `should define endTimestamp as the timestamp of the last Message in the Conversation`
    )

    if(withOutNlp) {
      assert.notOk(updatedConvo.get('clusterLabel'), 'should not add clusterLabel if nlpApiService is not defined')
    }
    else {
      assert.ok(updatedConvo.get('clusterLabel'), 'should add clusterLabel field')
    }
    assert.ok(updatedConvo.get('errors'), 'should add errors field')
  }

  try {
    await runTest(closeOne)
    // await runTest(closeOneWithoutNlp, { withOutNlp: true })

    db.sequelize.close()
    assert.end()
  }
  catch(error) {
    assert.fail(error)
    db.sequelize.close()
    assert.end()
  }
})