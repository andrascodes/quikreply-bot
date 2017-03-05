'use strict'

// MessageSchema
module.exports = function Message(sequelize, DataTypes) {
  const MessageModel = sequelize.define('message', {   
    // Columns

    participant: DataTypes.STRING,

    type: DataTypes.STRING,

    direction: DataTypes.STRING,

    timestamp: DataTypes.DATE,

    text: DataTypes.TEXT,

    error: DataTypes.STRING,

    delivered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    message: DataTypes.JSON,

    response: DataTypes.JSON,

    sentiment: DataTypes.STRING,
    
  }, {
    
    getterMethods: {

    },

    setterMethods: {

    },

    classMethods: {

    },

    instanceMethods: {

    },

    hooks: {

    },

    validate: {

    },



  })

  return MessageModel
}