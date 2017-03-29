'use strict'

const apiFactory = require('./api')
const botFactory = require('./bot')
const express = require('express')
const path = require('path')

module.exports = (db, fbConfig, { nlpApiUrl, serverUrl }) => {
  const app = express()
  const apiRouter = apiFactory(db, express.Router())
  app.use('/api', apiRouter)
  
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, '/views'))

  app.use(express.static(path.join(__dirname, '/views')))

  app.get('/', (req, res) => {
    res.render('index', {
      baseUrl: `${serverUrl}/api`
    })
  })

  const bot = botFactory(app, db, fbConfig, nlpApiUrl)

  return bot
}