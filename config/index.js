'use strict'

const config = {
  pageId: process.env.FB_PAGE_ID,
  accessToken: process.env.FB_PAGE_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET,

  // Secret key for JWT signing and encryption
  jwtPassword: process.env.JWTPASSWORD || 'qwerty098',
  cryptoPassword: process.env.CRYPTOPASSWORD || 'abc123!@#!'
}

// Check the environment
const env = process.env.NODE_ENV || 'development'
// Set Database connection URL
if (env === 'production') {
  config.databaseUrl = process.env.DATABASE_URL
  config.serverUrl = `${process.env.HEROKU_SERVER_URL}`
  config.nlpApiUrl = process.env.NLPAPI_URL
}
else {
  config.databaseUrl = process.env.DATABASE_URL
  config.serverUrl = `${process.env.LOCAL_SERVER_URL}:${process.env.PORT}`
  config.nlpApiUrl = process.env.NLPAPI_URL,
  process.env.PORT = process.env.SERVER_PORT
}

// Set if the DB should be Resynced on start
// const resyncDb = process.env.FORCE_DB
const resyncDb = 'TRUE'
if (resyncDb && resyncDb.toUpperCase() === 'TRUE') {
  console.log('DB set to resync.')
  config.dbOptions = { force: true }
}
else {
  console.log('DB is not being resynced.')
  config.dbOptions = {}
}

// Exit if either of the config values are missing.
if (!(config.pageId &&
      config.accessToken &&
      config.verifyToken &&
      config.appSecret &&
      config.jwtPassword &&
      config.cryptoPassword &&
      config.databaseUrl &&
      config.serverUrl &&
      config.nlpApiUrl &&
      config.dbOptions)) {
  throw new Error('Missing config values.');
}

module.exports = config;