'use strict'

const apiFactory = require('./api')
const botFactory = require('./bot')
const express = require('express')

module.exports = (db, fbConfig, nlpApiUrl) => {
  const app = express()
  const apiRouter = apiFactory(db, express.Router())
  app.use('/api', apiRouter)

  const bot = botFactory(app, db, fbConfig, nlpApiUrl)

  return bot
}