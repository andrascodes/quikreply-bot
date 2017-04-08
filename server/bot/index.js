'use strict'

const BootBot = require('./bootbot/BootBot')
const modules = require('./modules')
const Analytics = require('../../lib/Analytics')

module.exports = (app, db, { pageId, accessToken, verifyToken, appSecret }, nlpApiUrl) => {

  let analytics = undefined
  if(db) {
    analytics = Analytics(db, nlpApiUrl)
  }

  const bot = new BootBot({
    pageId,
    accessToken,
    verifyToken,
    appSecret,
    app: app,
    analytics 
  })

  // Add the modules to the bot instance
  modules.map(module => bot.module(module))

  return bot
}