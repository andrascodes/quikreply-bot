'use strict'

const config = require('./config')
const serverFactory = require('./server')
const dbFactory = require('./db')

const fbConfig = {
  pageId: config.pageId,
  accessToken: config.accessToken,
  verifyToken: config.verifyToken,
  appSecret: config.appSecret,
}

// Setup DB connection
const db = dbFactory(config.databaseUrl, config.nlpApiUrl)

const botServer = serverFactory(db, fbConfig, {
  nlpApiUrl: config.nlpApiUrl,
  serverUrl: config.serverUrl
})

// process.env.PORT lets the port to be set by Heroku
main({ 
  port: process.env.PORT,
  db,
  dbOptions: config.dbOptions,
  botServer,
  serverUrl: config.serverUrl
})

async function main({ port, db, dbOptions, botServer, serverUrl }) {
  
  if(db) {
    // Sync DB
    const resyncDb = process.env.FORCE_DB
    if (dbOptions) {
      console.log('DB set to resync.')
    }
    else {
      console.log('DB is not being resynced.')
    }
    await db.sequelize.sync(dbOptions)

    // Add admin User to DB
    const adminUser = await db.User.findOne({
      where: { id: 1 }
    })

    if(!adminUser) {
      await db.User.create({ username: 'admin', password: 'password' })
    }
  }

  botServer.start(port, `Express app is listening at \n${serverUrl}`)
}