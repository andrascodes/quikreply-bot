'use strict'

const bodyParser = require('body-parser')
const createGetConversationsTextHandler = require('./conversations/text/get')
const createPutConversationsTextHandler = require('./conversations/text/put')
const createGetDashboardHandler = require('./dashboard/get')
const createGetConversationsHandler = require('./conversations/get')
const createGetConversationByIdHandler = require('./conversations/id/get')
const createGetLoginHandler = require('./login/get')
const createPostLoginHandler = require('./login/post')
const createPostLogoutHandler = require('./logout/post')
const createPutProfileHandler = require('./profile/put')

const createAuthenticationHandler = require('./authentication')

module.exports = ({ services, apiRouter }) => {

  const { authService, conversationService, dashboardService } = services
  const authenticate = createAuthenticationHandler(authService)

  if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    apiRouter.use(require('cors')({
      exposedHeaders: ['Auth', 'Cache-Control', 'Content-Type'],
    }))
  }

  apiRouter.use(bodyParser.urlencoded({ extended: false }))
  apiRouter.use(bodyParser.json())

  apiRouter.get('/healthcheck', (req, res) => {
    res.status(200).json({
      result: 'success'
    })
  })

  apiRouter.get('/login', createGetLoginHandler(authService))
  apiRouter.post('/login', createPostLoginHandler(authService))

  apiRouter.post('/logout', authenticate, createPostLogoutHandler(authService))
  
  apiRouter.put('/profile', authenticate, createPutProfileHandler(authService))

  apiRouter.get('/conversations', authenticate, createGetConversationsHandler(conversationService))

  apiRouter.get('/conversations/text', authenticate, createGetConversationsTextHandler(conversationService))
  apiRouter.put('/conversations/text', authenticate, createPutConversationsTextHandler(conversationService))
  
  apiRouter.get('/conversations/:id', authenticate, createGetConversationByIdHandler(conversationService))

  apiRouter.get('/dashboard', authenticate, createGetDashboardHandler(dashboardService))

  return apiRouter
}