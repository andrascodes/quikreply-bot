'use strict'

const bodyParser = require('body-parser')
const createGetConversationsTextHandler = require('./conversations/text/get')
const createPutConversationsTextHandler = require('./conversations/text/put')
const createGetDashboardHandler = require('./dashboard/get')
const createGetConversationsHandler = require('./conversations/get')
const createGetConversationByIdHandler = require('./conversations/id/get')

module.exports = (db, router) => {

  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())

  router.get('/healthcheck', (req, res) => {
    res.status(200).json({
      result: 'success'
    })
  })

  router.get('/conversations', createGetConversationsHandler(db))

  router.get('/conversations/text', createGetConversationsTextHandler(db))
  router.put('/conversations/text', createPutConversationsTextHandler(db))
  
  router.get('/conversations/:id', createGetConversationByIdHandler(db))
  // router.put('/conversations/:id', createPutConversationByIdHandler(db))

  router.get('/dashboard', createGetDashboardHandler(db))

  return router
}