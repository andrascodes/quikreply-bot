'use strict'

const auth = require('basic-auth')

// Singup API endpoint, save new User, return JWT
const postLoginHandler = db => async(req, res) => {

  const UserModel = db.User
  const TokenModel = db.Token

  const { name: username, pass: password } = auth(req)

  // Create User instance with email and password
  try {
    const user = await UserModel.create({ username, password })

    const token = await user.generateToken()
                        .then(jwt => TokenModel.create({ token: jwt }))
                        .then(token => token.get('token'))

    return res.header('Auth', token).json(user.toPublicJSON())
  }
  catch(error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "Username already exists in the database."
      })
    }
    return res.status(500).json(error)
  }

}

module.exports = postLoginHandler;