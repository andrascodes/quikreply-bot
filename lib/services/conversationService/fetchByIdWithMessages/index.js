'use strict'

const createFetchByIdWithMessages = (ConversationModel, MessageModel) => async id => {

  if(!id) {
    return []
  }

  try {
    const conversationWithMessages = await ConversationModel.findOne({
      where: {
        id,
      },
      attributes: [ 'id', 'participant', ['startTimestamp', 'start'], ['endTimestamp', 'end'], ['clusterLabel', 'label'] ],
      include: [{ 
        model: MessageModel,
        attributes: ['id', 'type', 'direction', 'timestamp', 'text', 'error', 'sentiment', 'message', 'response']
      }],
      order: [ [MessageModel, 'timestamp', 'ASC'] ]
    })

    return conversationWithMessages ? conversationWithMessages.toJSON() : conversationWithMessages
  }
  catch(error) {
    throw error
  }
}

module.exports = createFetchByIdWithMessages