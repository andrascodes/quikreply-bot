'use strict'

// DB model definition
module.exports = sequelize => {
  const db = {}

  db.Message = sequelize.import(`${__dirname}/Message/index.js`)
  db.Conversation = sequelize.import(`${__dirname}/Conversation/index.js`)
  db.User = sequelize.import(`${__dirname}/User/index.js`)
  db.Token = sequelize.import(`${__dirname}/Token/index.js`)

  db.sequelize = sequelize

  db.Message.belongsTo(db.Conversation)
  db.Conversation.hasMany(db.Message)

  return db

}