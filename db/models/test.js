'use strict'

const Sequelize = require('sequelize')

const sequelize = new Sequelize('postgres://localhost:5432/qrbot')

const Conversation = sequelize.import(`${__dirname}/Conversation/index.js`)
const Message = sequelize.import(`${__dirname}/Message/index.js`)

Message.belongsTo(Conversation)
Conversation.hasMany(Message)

Conversation.sync().then(() => {
  Conversation.findOne({
    where: {
      id: 4
    }
  })
  .then(convo => convo.getText())
  .then(text => console.log(text))
  .catch(error => console.error(error))
})