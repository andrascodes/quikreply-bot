'use strict'

const express = require('express')

const config = require('../config')
const { BootBot, modules } = require('./bot')
const db = require('./models')


const app = express()
// TODO: add the routes to the App
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const bot = new BootBot({
  pageId: config.pageId,
  accessToken: config.accessToken,
  verifyToken: config.verifyToken,
  appSecret: config.appSecret,
  app: app
})

// Add the modules to the bot instance
modules.map(module => bot.module)

module.exports = bot