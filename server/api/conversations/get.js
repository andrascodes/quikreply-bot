'use strict';

const createGetConversationsHandler = conversationService => async (req, res) => {

  try {
    const conversations = await conversationService.fetchAll()

    return res.status(200).json({ data: conversations })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }
}

module.exports = createGetConversationsHandler;