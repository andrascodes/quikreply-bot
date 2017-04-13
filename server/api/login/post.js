'use strict'

const auth = require('basic-auth')

// Singup API endpoint, save new User, return JWT
const postLoginHandler = authService => async(req, res) => {

  // Create User instance with email and password
  try {
    const { name: username, pass: password } = auth(req)

    const { user, token } = await authService.signup(username, password)

    return res.header('Auth', token).json(user)
  }
  catch(error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        error: "Username already exists in the database."
      })
    }
    return res.status(500).json({ error: error.message })
  }

}

module.exports = postLoginHandler;