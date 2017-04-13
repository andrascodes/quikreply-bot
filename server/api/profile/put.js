'use strict';

const auth = require('basic-auth')

const putProfileHandler = authService => async(req, res) => {

  try {

    const user = req.user
    const { name: username, pass: password } = auth.parse(req.get('Auth-Basic'))
    const { email } = req.body

    let newUserValues = {}
    if(username) {
      newUserValues.username = username
    }
    if(password) {
      newUserValues.password = password
    }
    newUserValues.email = (email && email !== '') ? email : null

    const updatedUser = await authService.updateUser(user.id, newUserValues)
    
    return res.status(200).json(updatedUser)
  }
  catch(error) {
    console.error(error.message)
    if(error.message === 'Validation error: Validation isEmail failed') {
      return res.status(400).json({ error: 'Email validation failed' })
    }
    return res.status(500).json(error)
  }
}

module.exports = putProfileHandler;