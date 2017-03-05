'use strict'

const config = require('./config')
const bot = require('./server')
const db = require('./server/models')

async function main({ port, db, config }) {

  const syncDb = await db.sequelize.sync(config.dbOptions)

  bot.start(port, `Express app is listening at \n${config.serverUrl}`)
}

// process.env.PORT lets the port to be set by Heroku
main({ 
  port: process.env.PORT,
  db,
  config
})
