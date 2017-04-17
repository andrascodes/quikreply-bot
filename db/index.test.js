'use strict'

const test = require('tape')
const createDB = require('./')
const { testDatabaseUrl } = require('../config/')

test('db', nest => {
  
  nest.test(`db: should be 'undefined' if databaseUrl is not passed`, assert => {
    // T1: should be 'undefined' if databaseUrl is 'undefined'
    const undefinedDb = createDB(undefined)
    assert.equal(undefinedDb, undefined)
    assert.end()
  })
  
  nest.test(`db: should be defined if databaseUrl is passed`, assert => {
    // T2: should be defined if databaseUrl is defined
    const db = createDB(testDatabaseUrl)
    assert.ok(db, 'should be defined if databaseUrl is defined')
    assert.end()
  })
  
  nest.test(`db: should establish connection successfully or throw SequelizeConnectionError`, async assert => {
    // T2: should be defined if databaseUrl is defined
    const db = createDB(testDatabaseUrl)
    
    try {
      await db.sequelize.authenticate()
      assert.pass()
      db.sequelize.close()
      assert.end()
    }
    catch(error) {
      assert.equal(error.name, 'SequelizeConnectionError')
      db.sequelize.close()
      assert.end()
    }
  })
})