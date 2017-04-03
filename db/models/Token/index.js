'use strict'

const cryptojs = require('crypto-js')

// TokenSchema
module.exports = function Token(sequelize, DataTypes) {
  const TokenModel = sequelize.define('token', {
    // Columns
    token: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
          len: [1]
      },
      set: function tokenSetter(value) {
          const hash = cryptojs.MD5(value).toString();
          this.setDataValue('token', value);
          this.setDataValue('tokenHash', hash);
      }
    },

    tokenHash: DataTypes.STRING

  }, {
    
    classMethods: {

    },

    instanceMethods: {

    }
  })

  return TokenModel
}