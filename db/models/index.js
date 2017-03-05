'use strict'

// DB model definition
module.exports = ({ sequelize, conversationArray }) => {
  const db = {}

  db.Message = sequelize.import(`${__dirname}/Message/index.js`)
  db.Conversation = sequelize.import(`${__dirname}/Conversation/index.js`)

  db.sequelize = sequelize
  // db.Sequelize = Sequelize

  db.Message.belongsTo(db.Conversation)
  db.Conversation.hasMany(db.Message)

  db.activeConversations = conversationArray

  return db

}