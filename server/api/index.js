'use strict'

const bodyParser = require('body-parser')
const createGetConversationsHandler = require('./conversations/get')
const createPutConversationsHandler = require('./conversations/put')

module.exports = (db, router) => {

  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())

  router.get('/healthcheck', (req, res) => {
    res.status(200).json({
      result: 'success'
    })
  })

  router.get('/conversations', createGetConversationsHandler(db))
  router.put('/conversations', createPutConversationsHandler(db))

  return router
}