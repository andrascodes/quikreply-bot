'use strict';

const postLogoutHandler = db => async(req, res) => {

  const TokenModel = db.TokenModel

  req.token.destroy()
  .then(() => res.status(204).send())
  .catch(() => res.status(500).send())
}

module.exports = postLogoutHandler;
