'use strict'

const moment = require('moment')

const createGetConversationsHandler = dashboardService => async (req, res) => {

  try {
    const queryResults = await dashboardService.getAll()

    return res.status(200).json({ data: queryResults })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }

}

module.exports = createGetConversationsHandler;