'use strict'

const test = require('tape')
const createDB = require('../../../../db')
const { testDatabaseUrl } = require('../../../../config')
const createUpdateWithLabels = require('./')

const setup = () => {
  const db = createDB(testDatabaseUrl)
  const updateWithLabels = createUpdateWithLabels(db.Conversation)
  return { db, updateWithLabels }
}

test(`ConversationService#updateWithLabels`, assert => {

  const { db, updateWithLabels } = setup()
  
  const firstConvoId = 1
  const secondConvoId = 2

  const firstMessage = 'First Message'
  const secondMessage = 'Second Message'
  const thirdMessage = ''

  const label1 = 'label1'
  const label2 = 'label2'
  const label3 = 'label3'
  
  db.sequelize.sync({ force: true })
  .then(() => db.Conversation.create({ id: firstConvoId }))
  .then(convo => {
    convo.createMessage({ text: firstMessage })
    return convo
  })
  .then(convo => convo.createMessage({ text: secondMessage }))
  .then(() => db.Conversation.create({ id: secondConvoId }))
  .then(convo => convo.createMessage({ text: thirdMessage }))
  .then(() => updateWithLabels())
  .then(result => {
    assert.ok(result instanceof Array, 'should return an array')
    assert.deepEqual(result, [], 'should return an empty array if there are no conversations')
  })
  .then(() => updateWithLabels([
    { id: firstConvoId, clusterLabel: [label1, label2] },
    { id: secondConvoId, clusterLabel: [label3] }
  ]))
  .then(result => {
    const firstConvo = result.find(convo => convo.id === firstConvoId)
    const secondConvo = result.find(convo => convo.id === secondConvoId)

    assert.equal(firstConvo.clusterLabel, `${label1} ${label2}`, 'should concatenate labels into a string')
    assert.equal(secondConvo.clusterLabel, `${label3}`, 'should add one label as a standalone string')
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