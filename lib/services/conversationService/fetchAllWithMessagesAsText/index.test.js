'use strict'

const test = require('tape')
const createDB = require('../../../../db')
const { testDatabaseUrl } = require('../../../../config')
const createFetchAllWithMessagesAsText = require('./')

const setup = () => {
  const db = createDB(testDatabaseUrl)
  const fetchAllWithMessagesAsText = createFetchAllWithMessagesAsText(db.Conversation, db.Message)
  return { db, fetchAllWithMessagesAsText }
}

test(`ConversationService#fetchAllWithMessagesAsText`, assert => {

  const { db, fetchAllWithMessagesAsText } = setup()

  const firstConvoId = 1
  const secondConvoId = 2

  const firstMessage = 'First Message'
  const secondMessage = 'Second Message'
  const thirdMessage = ''

  db.sequelize.sync({ force: true })
  .then(() => fetchAllWithMessagesAsText())
  .then(result => {
    assert.ok(result instanceof Array, 'should return an array')
    assert.deepEqual(result, [], 'should return an empty array if there are no conversations')
  })
  .then(() => db.Conversation.create({ id: firstConvoId }))
  .then(convo => {
    convo.createMessage({ text: firstMessage })
    return convo
  })
  .then(convo => convo.createMessage({ text: secondMessage }))
  .then(() => db.Conversation.create({ id: secondConvoId }))
  .then(convo => convo.createMessage({ text: thirdMessage }))
  .then(() => fetchAllWithMessagesAsText())
  .then(result => {
    assert.ok(result instanceof Array, 'should return an array')
    assert.equal(result.length, 2, 'should return all conversations')
    assert.ok(result[0].messages.includes(firstMessage))
    assert.ok(result[0].messages.includes(secondMessage))
    result.map(convo => {
      assert.ok([firstConvoId, secondConvoId].includes(convo.id), 'should return only conversations that were in the database')
      assert.deepEqual(Object.keys(convo), ['id', 'messages'], 'id and messages field should be the only ones available')
      assert.equal(typeof convo.messages, 'string')
    })
  })
  .then(() => {
    db.sequelize.close()
    assert.end()
  })
  .catch(error => {
    assert.fail(error)
    db.sequelize.close()
    assert.end()
  })

})