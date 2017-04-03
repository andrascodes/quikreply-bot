'use strict';

const cryptojs = require('crypto-js')

// Login API endpoint, returning User, get the User instance from DB, return JWT
const jwtAuth = db => async (req, res, next) => {
  const UserModel = db.User
  const TokenModel = db.Token

  try {
    const tokenString = req.get('Authorization').includes('Bearer') ? req.get('Authorization').substring(7) : ''
    
    const [ token, user ] = await Promise.all([
      TokenModel.findOne({
        where: {
          tokenHash: cryptojs.MD5(tokenString).toString()
        }
      }),
      UserModel.findByToken(tokenString)
    ])

    if(!token || !user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    next()
  }
  catch(error) {
    res.status(401).json({ error: "HTTP 401: Unauthorized"})
  }
}

module.exports = jwtAuth;