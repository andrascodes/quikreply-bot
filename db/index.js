'use strict'

const Sequelize = require('sequelize')
const createModels = require('./models')

// Setup DB connection
module.exports = dbUrl => {
  if(dbUrl) {
    return createModels(new Sequelize(dbUrl))
  }
  else {
    return undefined
  }
}