'use strict'

// UserSchema

const bcrypt = require('bcryptjs')
const cryptojs = require('crypto-js')
const jwt = require('jsonwebtoken')

const config = require('../../../config')

module.exports = function User(sequelize, DataTypes) {
  const UserModel = sequelize.define('user', {
    
    // Columns
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      set: function setEmail(value) {
        this.setDataValue('email', value.toLowerCase())
      },
      validate: {
        isEmail: true,
      }
    },

    salt: {
      type: DataTypes.STRING,
    },

    password_hash: {
      type: DataTypes.STRING,
    },

    password: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [7, 100]
      },
      set: function passwordSetter(value) {
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(value, salt)

        this.setDataValue('password', value)
        this.setDataValue('salt', salt)
        this.setDataValue('password_hash', hashedPassword)
      }
    },

  }, {

    classMethods: {
      authenticate: function classAuthenticate({ username, password }) {
        return new Promise((resolve, reject) => {
          // find a user by the email
          UserModel.findOne({
            where: { username }
          })
          .then(user => {
            // if found: check if password matches
            if(!user || !bcrypt.compareSync(password, user.get('password_hash'))) {
              return reject({
                error: 'Username or password is incorrect.'
              })
            }
            resolve(user)
          }, error => reject(error))
        })
      },

      findByToken: function(value) {
        return new Promise((resolve, reject) => {
          // decode the JWT token and find the User based on the id inside it
          try {
            const decodedJWT = jwt.verify(value, config.jwtPassword)
            const bytes = cryptojs.AES.decrypt(decodedJWT.token, config.cryptoPassword)
            const token = JSON.parse(bytes.toString( cryptojs.enc.Utf8 ))

            UserModel.findById(token.id)
            .then( user => {
              // if user is not in DB
              if(!user) {
                return reject({
                  error: 'User was not found.'
                });
              }
              resolve(user);
            }, error => {
              reject(error);
            });
          }
          catch(error) {
            reject(error)
          }
        })
      },


    },

    instanceMethods: {

      generateToken: function() {
        return new Promise((resolve, reject) => {
          
          try {
            // create the Payload of the JWT out of the values of the User instance
            const jwtPayload = JSON.stringify({ 
              id: this.get('id')
            })
            
            // encrypt the JWT Payload
            const encryptedJwtPayload = cryptojs.AES.encrypt(jwtPayload, config.cryptoPassword).toString()

            // Create the JWT with the encryptedJwtPayload and the jwtPassword secret
            const token = jwt.sign({
							token: encryptedJwtPayload
						}, config.jwtPassword)

            resolve(token)
          }
          catch(error) {
            reject(error)
          }
          
        })
      },

      toPublicJSON: function() {
        const { username, email, createdAt, updatedAt } = this.toJSON();
        return { username, email, createdAt, updatedAt };
      },

    }

  })

  return UserModel
}