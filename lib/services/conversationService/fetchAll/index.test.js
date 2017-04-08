'use strict'

const test = require('tape')
const createDB = require('../../../../db')
const { testDatabaseUrl } = require('../../../../config')
const createFetchAll = require('./')

const setup = () => {
  const db = createDB(testDatabaseUrl)
  const fetchAll = createFetchAll(db.Conversation)
  return { db, fetchAll }
}

test(`#fetchAll`, assert => {

  const { db, fetchAll } = setup()

  db.sequelize.sync({ force: true })
  .then(() => fetchAll())
  .then(result => {
    assert.ok(result instanceof Array, 'should return an array')
    assert.deepEqual(result, [], 'should return an empty array if there are no conversations')
  })
  .then(() => db.Conversation.create({ id: 1 }))
  .then(convo => convo.createMessage({ error: 'OAuthException' }))
  .then(() => db.Conversation.create({ id: 2 }))
  .then(() => fetchAll())
  .then(result => {
    assert.ok(result instanceof Array, 'should return an array')
    assert.equal(result.length, 2, 'should return all conversations')
    result.map(convo => {
      assert.ok([1,2].includes(convo.id), 'id field should be available')
      assert.equal(convo.participant, null, 'participant field should be available')
      assert.equal(convo.start, null, 'start field should be available')
      assert.equal(convo.end, null, 'end field should be available')
      assert.equal(convo.label, null, 'label field should be available')
      assert.ok(convo.errors === null || convo.errors === 'OAuthException ')
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