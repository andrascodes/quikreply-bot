'use strict';

const createGetConversationByIdHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation
  const MessageModel = db.Message

  try {
    const conversationMessages = await ConversationModel.findOne({
      where: {
        id: req.params.id,
      },
      attributes: [ 'id', 'participant', ['startTimestamp', 'start'], ['endTimestamp', 'end'], ['clusterLabel', 'label'] ],
      include: [{ 
        model: MessageModel,
        attributes: ['id', 'type', 'direction', 'timestamp', 'text', 'error', 'sentiment', 'message', 'response']
      }],
      order: [ [MessageModel, 'timestamp', 'ASC'] ]
    })

    return res.status(200).json({ data: conversationMessages })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }
}

module.exports = createGetConversationByIdHandler;