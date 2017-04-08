'use strict'

const test = require('tape')

const { testDatabaseUrl } = require('../../../../config')
const db = require('../../../../db')(testDatabaseUrl)
const saveOne = require('./')(db.Conversation)

test(`#saveOne`, async assert => {

  const participant = '123'
  try {
    await db.sequelize.sync({ force: true })
    const convo = await saveOne({ 
      participant, 
      trash: 'DOES NOT GET SAVED', 
      startTimestamp: new Date() 
    })

    const savedConvo = await db.Conversation.findOne({
      where: {
        id: convo.id
      }
    })

    assert.ok(savedConvo, `should save the Conversation into the DB`)
    assert.equal(savedConvo.get('participant'), convo.participant, `should return the participant field of the saved Conversation`)
    assert.equal(savedConvo.get('id'), convo.id, `should return the id field of the saved Conversation`)

    db.sequelize.close()
    assert.end()
  }
  catch(error) {
    assert.fail(error)
    db.sequelize.close()
    assert.end()
  }
})
