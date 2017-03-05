'use strict'

const bodyParser = require('body-parser')

module.exports = (db, router) => {

  router.use(bodyParser.urlencoded({ extended: false }))
  router.use(bodyParser.json())

  router.get('/healthcheck', (req, res) => {
    res.status(200).json({
      result: 'success'
    })
  })

  return router
}