'use strict';

const postLogoutHandler = authService => async(req, res) => {

  try {
    const { tokenFound, tokenDestroyed } = await authService.logout(req.tokenString)
    if(tokenFound && tokenDestroyed) {
      return res.status(204).send()
    }
    else {
      res.status(400).send()
    }
  }
  catch(error) {
    return res.status(500).send()
  }
}

module.exports = postLogoutHandler;
