'use strict'

if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

const config = {
  pageId: process.env.FB_PAGE_ID,
  accessToken: process.env.FB_PAGE_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET,

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
}
else if (env === 'test') {
  config.testDatabaseUrl = 'postgres://localhost:5432/testdb'
  config.nlpApiUrl = 'https://qranalytics-nlp.herokuapp.com'
}
else {
  config.databaseUrl = process.env.DATABASE_URL
  process.env.PORT = process.env.SERVER_PORT
  config.serverUrl = `${process.env.LOCAL_SERVER_URL}:${process.env.PORT}`
  config.nlpApiUrl = process.env.NLPAPI_URL
}

// Set if the DB should be Resynced on start
const resyncDb = process.env.FORCE_DB
if (resyncDb && resyncDb.toUpperCase() === 'TRUE') {
  config.dbOptions = { force: true }
}
else {
  config.dbOptions = {}
}

// Exit if either of the config values are missing.
if ( (env  === 'production' || env === 'development') &&
    !(config.pageId &&
      config.accessToken &&
      config.verifyToken &&
      config.appSecret )) {
  throw new Error('Missing config values.');
}

module.exports = config;