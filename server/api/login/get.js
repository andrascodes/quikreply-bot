'use strict';

const auth = require('basic-auth')

// Login API endpoint, returning User, get the User instance from DB, return JWT
const getLoginHandler = authService => async(req, res) => {

  try {
    const { name: username, pass: password } = auth(req)
    const { token, user } = await authService.login(username, password)
    
    return res.header('Auth', token).json(user)
  }
  catch(error) {
    res.status(401).json(error)
  }
}

module.exports = getLoginHandler;