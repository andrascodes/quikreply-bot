'use strict'

const BootBot = require('./bootbot/BootBot')
const modules = require('./modules')

module.exports = (app, analytics, { pageId, accessToken, verifyToken, appSecret }) => {

  const bot = new BootBot({
    pageId,
    accessToken,
    verifyToken,
    appSecret,
    app,
    analytics 
  })

  // Add the modules to the bot instance
  modules.map(module => bot.module(module))

  return bot
}