'use strict';

const auth = require('basic-auth')

// Login API endpoint, returning User, get the User instance from DB, return JWT
const getLoginHandler = db => async(req, res) => {
  const UserModel = db.User
  const TokenModel = db.Token

  const { name: username, pass: password } = auth(req)

  try {
    const user = await UserModel.authenticate({ username, password })

    const token = await user.generateToken()
                        .then(jwt => TokenModel.create({ token: jwt }))
                        .then(token => token.get('token'))
    
    return res.header('Auth', token).json(user.toPublicJSON())

  }
  catch(error) {
    res.status(401).json(error)
  }
}

module.exports = getLoginHandler;