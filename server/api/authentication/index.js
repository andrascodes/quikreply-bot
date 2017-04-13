'use strict';

// Login API endpoint, returning User, get the User instance from DB, return JWT
const jwtAuth = authService => async (req, res, next) => {
 
  try {
    const tokenString = req.get('Authorization').includes('Bearer') ? req.get('Authorization').substring(7) : ''
    
    const { tokenFound, user } = await authService.authenticate(tokenString)

    if(!tokenFound || !user) {
      throw new Error('Unauthorized')
    }

    req.tokenString = tokenString
    req.user = user
    next()
  }
  catch(error) {
    res.status(401).json({ error: "HTTP 401: Unauthorized"})
  }
}

module.exports = jwtAuth;