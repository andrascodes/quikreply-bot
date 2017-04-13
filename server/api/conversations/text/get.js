'use strict';

const createGetConversationsTextHandler = conversationService => async (req, res) => {

  try {
    const conversationsWithMessages = await conversationService.fetchAllWithMessagesAsText()

    return res.status(200).json({ data: conversationsWithMessages })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }


}

module.exports = createGetConversationsTextHandler;