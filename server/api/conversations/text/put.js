'use strict';

const _ = require('underscore')

const createPutConversationsTextHandler = conversationService => async (req, res) => {

  try {

    const updatedConvos = await conversationService.updateWithLabels(req.body.data)

    return res.status(200).json({ result: `${updatedConvos.length} conversations were updated` })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }

}

module.exports = createPutConversationsTextHandler;