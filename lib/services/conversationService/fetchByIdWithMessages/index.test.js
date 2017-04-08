'use strict'

const test = require('tape')
const createDB = require('../../../../db')
const { testDatabaseUrl } = require('../../../../config')
const createFetchByIdWithMessages = require('./')

const setup = () => {
  const db = createDB(testDatabaseUrl)
  const fetchByIdWithMessages = createFetchByIdWithMessages(db.Conversation, db.Message)
  return { db, fetchByIdWithMessages }
}

test(`#fetchByIdWithMessages`, nest => {

  const { db, fetchByIdWithMessages } = setup()
    
  nest.test(`#fetchByIdWithMessages: should return empty array if 'id' is not passed`, assert => {
    const id = undefined
    assert.deepEqual(fetchByIdWithMessages(id), [])
    assert.end()
  })

  nest.test(`#fetchByIdWithMessages: should return null if a Conversation with the passed id is not found `, assert => {
    const id = 44
    db.sequelize.sync({ force: true })
    .then(() => fetchByIdWithMessages(id))
    .then(result => {
      assert.equal(result, null)
    })
    .then(() => db.Conversation.create({ id: 1 }))
    .then(() => fetchByIdWithMessages(id))
    .then(result => {
      assert.equal(result, null)
      assert.end()
    })
    .catch(error => {
      db.sequelize.close()
      assert.fail(error)
    })
  })

  nest.test(`#fetchByIdWithMessages: should rethrow the Error from inside the method `, assert => {
    const id = 'asdasds'
    db.sequelize.sync({ force: true })
    .then(() => db.Conversation.create({ id: 1 }))
    .then(() => fetchByIdWithMessages(id))
    .catch(error => {
      assert.ok(error instanceof Error)
      assert.end()
    })
  })

  nest.test(`#fetchByIdWithMessages: should return the Conversation object with the passed id`, assert => {
    const id = 44
    db.sequelize.sync({ force: true })
    .then(() => db.Conversation.create({ id }))
    .then(() => fetchByIdWithMessages(id))
    .then(result => {
      assert.equal(result.id, id)
      assert.deepEqual(result.messages, [], 'result.messages should be an empty array')
    })
    .then(() => {
      assert.end()
    })
    .catch(error => {
      db.sequelize.close()
      assert.fail(error)
      assert.end()
    })
  })

  nest.test(`#fetchByIdWithMessages: should return the Messages belonging to the Conversation`, assert => {
    const id = 44
    const messageId = 1
    db.sequelize.sync({ force: true })
    .then(() => db.Conversation.create({ id }))
    .then(convo => convo.createMessage({ id: messageId }))
    .then(() => fetchByIdWithMessages(id))
    .then(result => {
      assert.ok(result.messages.find(msg => msg.id === messageId))
    })
    .then(() => {
      assert.end()
    })
    .catch(error => {
      db.sequelize.close()
      assert.fail(error)
      assert.end()
    })
  })

  nest.test(`#fetchByIdWithMessages: should return the necessary fields of the Conversation and the Messages`, assert => {
    const id = 44
    const messageId = 1
    db.sequelize.sync({ force: true })
    .then(() => db.Conversation.create({ id }))
    .then(convo => convo.createMessage({ id: messageId }))
    .then(() => fetchByIdWithMessages(id))
    .then(result => {

      assert.equal(result.id, id, 'result.id should be available')
      assert.equal(result.participant, null, 'result.participant should be available')
      assert.equal(result.start, null, 'result.start should be available')
      assert.equal(result.end, null, 'result.end should be available')
      assert.equal(result.label, null, 'result.label should be available')
      
      const messages = result.messages
      assert.ok(messages, 'result.messages should be available')
      assert.ok(messages.length, 'result.messages should not be empty')
      assert.equal(messages[0].id, messageId, 'message.id should be available')
      messages.map(msg => {
        assert.ok(msg.id, 'message.id should be available')
        assert.equal(msg.type, null, 'message.id should be available')
        assert.equal(msg.direction, null, 'message.direction should be available')
        assert.equal(msg.timestamp, null, 'message.timestamp should be available')
        assert.equal(msg.text, null, 'message.text should be available')
        assert.equal(msg.error, null, 'message.error should be available')
        assert.equal(msg.sentiment, null, 'message.sentiment should be available')
        assert.equal(msg.message, null, 'message.message should be available')
        assert.equal(msg.response, null, 'message.response should be available')
      })
      
    })
    .then(() => {
      db.sequelize.close()
      assert.end()
    })
    .catch(error => {
      db.sequelize.close()
      assert.fail(error)
      assert.end()
    })
  })
})