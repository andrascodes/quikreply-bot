'use strict'

const cors = require('cors')

const bodyParser = require('body-parser')
const createGetConversationsTextHandler = require('./conversations/text/get')
const createPutConversationsTextHandler = require('./conversations/text/put')
const createGetDashboardHandler = require('./dashboard/get')
const createGetConversationsHandler = require('./conversations/get')
const createGetConversationByIdHandler = require('./conversations/id/get')
const createGetLoginHandler = require('./login/get')
const createPostLoginHandler = require('./login/post')

const createAuthenticationHandler = require('./authentication')

module.exports = (db, router) => {

  const authenticate = createAuthenticationHandler(db)

  if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    router.use(cors({
      exposedHeaders: ['Auth', 'Cache-Control', 'Content-Type'],
    }))
  }

  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())

  router.get('/healthcheck', (req, res) => {
    res.status(200).json({
      result: 'success'
    })
  })

  router.get('/login', createGetLoginHandler(db))
  router.post('/login', createPostLoginHandler(db))
  
  // router.post('/logout', createPostLogoutHandler(db))

  router.get('/conversations', authenticate, createGetConversationsHandler(db))

  router.get('/conversations/text', authenticate, createGetConversationsTextHandler(db))
  router.put('/conversations/text', authenticate, createPutConversationsTextHandler(db))
  
  router.get('/conversations/:id', authenticate, createGetConversationByIdHandler(db))
  // router.put('/conversations/:id', createPutConversationByIdHandler(db))

  router.get('/dashboard', authenticate, createGetDashboardHandler(db))

  return router
}