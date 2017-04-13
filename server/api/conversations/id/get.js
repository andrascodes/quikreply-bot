'use strict';

const createGetConversationByIdHandler = conversationService => async (req, res) => {

  try {
    const conversationMessages = await conversationService.fetchByIdWithMessages(req.params.id)

    return res.status(200).json({ data: conversationMessages })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }
}

module.exports = createGetConversationByIdHandler;