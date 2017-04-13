'use strict'

const cryptojs = require('crypto-js')

// signup(username, password), User, Token
  // authenticate then generate and save token
const createSignup = (UserModel, TokenModel) => async (username, password) => {

  const user = await UserModel.create({ username, password })

  const token = await user.generateToken()
                      .then(jwt => TokenModel.create({ token: jwt }))
                      .then(token => token.get('token'))
  
  return {
    user: user.toPublicJSON(), 
    token
  }
}

// login(username, password), User, Token
  // authenticate then generate and save token
const createLogin = (UserModel, TokenModel) => async (username, password) => {
  
  const user = await UserModel.authenticate({ username, password })

  const token = await user.generateToken()
                      .then(jwt => TokenModel.create({ token: jwt }))
                      .then(token => token.get('token'))

  return {
    user: user.toPublicJSON(), 
    token
  }
}

// authenticate(tokenString), User, Token
  // find a token and a user that belongs to the token
const createAuthenticate = (UserModel, TokenModel) => async (tokenString) => {
  
  try {
    const [ token, user ] = await Promise.all([
      TokenModel.findOne({
        where: {
          tokenHash: cryptojs.MD5(tokenString).toString()
        }
      }),
      UserModel.findByToken(tokenString)
    ])

    const result = {}
    if(token) {
      result.tokenFound = true
    }
    else {
      result.tokenFound = false
    }

    if(user) {
      result.user = {
        id: user.get('id'),
        username: user.get('username'),
        email: user.get('email')
      }
    }
    else {
      result.user = undefined
    }

    return result
  }
  catch(error) {
    if(error.name === 'JsonWebTokenError') {
      return {
        tokenFound: false,
        user: undefined
      }
    }
    throw error
  }

}

// logout(token), Token
  // find the token with the id or hash, destroy it
const createLogout = (TokenModel) => async (tokenString) => {
  
  const result = {
    tokenFound: false,
    tokenDestroyed: false
  }

  try {
    const token = await TokenModel.findOne({
      where: {
        tokenHash: cryptojs.MD5(tokenString).toString()
      }
    })

    if(token) {
      result.tokenFound = true
      const destroy = await token.destroy()
      result.tokenDestroyed = true
    }

    return result
  }
  catch(error) {
    if(error.name === 'JsonWebTokenError') {
      return result
    }
    console.error(error)
    throw error
  }
}

// updateUser(id), User, Token -> need to destroy the token as well, the client will log the user in again
const createUpdateUser = (UserModel) => async (id, values) => {
  
  const user = await UserModel.findOne({ where: { id } })
  if(!user) {
    return undefined
  }

  const updatedUser = await user.update(values)
  return updatedUser.toPublicJSON()
}

module.exports = (db) => {
  if(!db) {
    return undefined
  }
  
  return {
    login: createLogin(db.User, db.Token),
    signup: createSignup(db.User, db.Token),
    authenticate: createAuthenticate(db.User, db.Token),
    logout: createLogout(db.Token),
    updateUser: createUpdateUser(db.User)
  }
}