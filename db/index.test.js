'use strict'

const test = require('tape')
const createDB = require('./')
const { testDatabaseUrl } = require('../config/')

const { closeConnection } = require('../test.setup.js')

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
  
  nest.test(`db: should establish connection successfully or throw SequelizeConnectionError`, assert => {
    // T2: should be defined if databaseUrl is defined
    const db = createDB(testDatabaseUrl)
    db.sequelize.authenticate()
    .then(result => {
      assert.pass()
      closeConnection(db, assert.end)
    })
    .catch(error => {
      assert.equal(error.name, 'SequelizeConnectionError')
      closeConnection(db, assert.end)
    })
  })
})