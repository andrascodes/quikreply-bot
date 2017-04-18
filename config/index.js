'use strict'

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const config = {
  fbConfig: {
    pageId: process.env.FB_PAGE_ID,
    accessToken: process.env.FB_PAGE_TOKEN,
    verifyToken: process.env.FB_VERIFY_TOKEN,
    appSecret: process.env.FB_APP_SECRET,
  },
  conversationTimeout: process.env.CONV_TIMEOUT,
  // Secret key for JWT signing and encryption
  jwtPassword: process.env.JWTPASSWORD || 'qwerty098',
  cryptoPassword: process.env.CRYPTOPASSWORD || 'abc123!@#!'
}

const env = process.env.NODE_ENV || 'development'
// Set Database connection URL
if (env === 'production') {
  config.databaseUrl = process.env.DATABASE_URL
  config.serverUrl = `${process.env.HEROKU_SERVER_URL}`
  config.nlpApiUrl = process.env.NLPAPI_URL
  config.message = `Express app is listening at: ${process.env.HEROKU_SERVER_URL}\n` +
                    `Facebook Webhook is listening at: ${process.env.HEROKU_SERVER_URL}/webhook`
}
else if (env === 'test') {
  config.testDatabaseUrl = 'postgres://localhost:5432/testdb'
  config.nlpApiUrl = 'http://localhost:5555'
}
else {
  config.databaseUrl = process.env.DATABASE_URL
  process.env.PORT = process.env.SERVER_PORT
  config.serverUrl = `${process.env.LOCAL_SERVER_URL}:${process.env.PORT}`
  config.nlpApiUrl = process.env.NLPAPI_URL
  config.message = `Express app is listening at: ${process.env.LOCAL_SERVER_URL}:${process.env.PORT}\n` +
                    `Facebook Webhook is listening at: https://${process.env.TUNNEL_SUBDOMAIN}.localtunnel.me/webhook`
}

// Set if the DB should be Resynced on start
let resyncDb = process.env.FORCE_DB
resyncDb = (resyncDb === 'true' || resyncDb === 'TRUE')
if (resyncDb) {
  config.dbOptions = { force: true }
}
else {
  config.dbOptions = {}
}
config.resyncDb = resyncDb

// Exit if either of the config values are missing.
if ( (env  === 'production' || env === 'development') &&
    !(config.fbConfig.pageId &&
      config.fbConfig.accessToken &&
      config.fbConfig.verifyToken &&
      config.fbConfig.appSecret )) {
  throw new Error('Missing config values.');
}

module.exports = config;