'use strict'

const BootBot = require('./bootbot/BootBot')
const modules = require('./modules')
const Analytics = require('./analytics')

module.exports = (app, db, { pageId, accessToken, verifyToken, appSecret }, nlpApiUrl) => {
  const bot = new BootBot({
    pageId,
    accessToken,
    verifyToken,
    appSecret,
    app: app,
    analytics: Analytics(db, nlpApiUrl)
  })

  // Add the modules to the bot instance
  modules.map(module => bot.module(module))

  return bot
}