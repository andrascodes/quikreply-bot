'use strict'

const createApiRouter = require('./api')
const createBot = require('./bot')
const express = require('express')
const path = require('path')
const url = require('url')

module.exports = ({ services, serverUrl, analytics, fbConfig }) => {
  
  const app = express()
  const apiRouter = express.Router()
  const handleApiRequests = createApiRouter({ services, apiRouter })
  app.use('/api', handleApiRequests)
  
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '/views'))

  app.use(express.static(path.join(__dirname, '/views')))

  app.get('*', (req, res, next) => {
    if(url.parse(req.url).pathname === '/webhook') {
      return next()
    }

    res.render('index', {
      baseUrl: `${serverUrl}/api`
    })
  })

  const bot = createBot(app, analytics, fbConfig)

  return bot
}