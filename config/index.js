'use strict'

const config = {
  pageId: process.env.FB_PAGE_ID,
  accessToken: process.env.FB_PAGE_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET,

  // TODO: Secret key for JWT signing and encryption
  // jwtPassword: 'qwerty098',
  // cryptoPassword: 'abc123!@#!'
}

// Check the environment
const env = process.env.NODE_ENV || 'development'
// Set Database connection URL
if (env === 'production') {
  config.databaseUrl = process.env.DATABASE_URL
  config.serverUrl = `${process.env.HEROKU_SERVER_URL}/`
}
else {
  config.databaseUrl = process.env.LOCAL_DATABASE_URL
  config.serverUrl = `${process.env.LOCAL_SERVER_URL}:${process.env.PORT}/`
}

// Set if the DB should be Resynced on start
const resyncDb = process.env.FORCE_DB
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
      config.appSecret)) {
  throw new Error('Missing config values.');
}

module.exports = config;