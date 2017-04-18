'use strict'

const fetch = require('node-fetch')

const { databaseUrl, nlpApiUrl, serverUrl, fbConfig, dbOptions, resyncDb, conversationTimeout, message } = require('./config')
const db = require('./db')(databaseUrl)
const nlpApiService = require('./lib/services/NlpApiService')(fetch, nlpApiUrl)
const messageService = require('./lib/services/MessageService')(db, nlpApiService)
const authService = require('./lib/services/AuthService')(db)
const dashboardService = require('./lib/services/DashboardService')(db)
const conversationService = require('./lib/services/ConversationService')(db, nlpApiService)
const analytics = require('./lib/Analytics')(conversationService, messageService, conversationTimeout)

const createServer = require('./server')

const botServer = createServer({ 
  services: {
    authService, 
    conversationService, 
    dashboardService, 
  },
  analytics, 
  fbConfig, 
  serverUrl 
})

// process.env.PORT lets the port to be set by Heroku
main({ 
  port: process.env.PORT,
  db,
  dbOptions,
  botServer,
  serverUrl,
})

async function main({ port, db, dbOptions, botServer, serverUrl }) {
  
  if(db) {
    // Sync DB
    if (resyncDb) {
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

  botServer.start(port, message)
}