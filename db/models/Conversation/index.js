'use strict'

// ConversationSchema
module.exports = function Conversation(sequelize, DataTypes) {
  const ConversationModel = sequelize.define('conversation', {
    
    // Columns
    participant: DataTypes.STRING,

    startTimestamp: DataTypes.DATE,
    
    endTimestamp: DataTypes.DATE,

    errors: DataTypes.JSON,

    clusterLabel: DataTypes.STRING,

    display: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

  }, {
    
    getterMethods: {

    },

    setterMethods: {

    },

    classMethods: {

    },

    instanceMethods: {

      findEndtimestamp: function() {
        return new Promise((resolve, reject) => {
          this.getMessages({
            attributes: [[sequelize.fn('MAX', sequelize.col('timestamp')), 'lastMessageAt']],
          })
          .then(([res]) => resolve(res.get('lastMessageAt')))
          .catch(error => reject(error))
        })
      },

      getText: function () {
        return new Promise((resolve, reject) => {
          this.getMessages({
            attributes: ['text'],
            order: [['timestamp', 'ASC']]
          })
          .then(msgs => msgs.map(msg => msg.get('text')))
          .then(texts => texts.reduce(
            (accumulator, current) => accumulator.concat(` ${current}`), 
            ''
          ))
          .then(res => resolve(res))
          .catch(error => reject(error))
        })
      },

      getErrors: function () {
        return new Promise((resolve, reject) => {
          this.getMessages({
            where: {
              error: {
                $ne: null
              }
            },
            attributes: ['error'],
            order: [['timestamp', 'ASC']]
          })
          .then(msgs => msgs.map(msg => msg.get('error')))
          .then(errors => errors.reduce(
            (accumulator, current) => accumulator.concat(`${current} `), 
            ''
          ))
          .then(errors => {
            if(errors === "") {
              return null
            }
            else {
              return errors
            }
          })
          .then(res => resolve(res))
          .catch(error => reject(error))
        })
      }

    },

    hooks: {

    },

    validate: {

    },



  })

  return ConversationModel
}