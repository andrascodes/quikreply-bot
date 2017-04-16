'use strict'

// SaveOne
const createSaveOne = (ConversationModel, nlpApiService) => async (convoId, message) => {

  const convo = await ConversationModel.findOne({ where: { id: convoId }})
  if(!convo) {
    return undefined
  }

  let sentiment = null
  if(nlpApiService) {
    sentiment = await nlpApiService.getSentiment(message.text)
  }
  
  const messageWithSentiment = Object.assign({}, message, { sentiment })
  const savedMessage = await convo.createMessage(messageWithSentiment)

  return ({
    id: savedMessage.get('id'),
    conversationId: savedMessage.get('conversationId')
  })
}

// setRead
const createSetRead = (MessageModel) => async (timestamp, participant) => {
  if(!timestamp || !participant) {
    return undefined
  }

  const [updatedMessage] = await MessageModel.update({
    read: true
  }, {
    where: {
      timestamp: {
        $lte: timestamp
      },
      participant: participant,
      error: null,
      read: false,
      direction: 'outgoing'
    }
  })

  return updatedMessage
}

// setDelivered
const createSetDelivered = (MessageModel) => async (timestamp, participant) => {
  if(!timestamp || !participant) {
    return undefined
  }

  const [updatedMessage] = await MessageModel.update({
    delivered: true
  }, {
    where: {
      timestamp: {
        $lte: timestamp
      },
      participant: participant,
      error: null,
      delivered: false,
      direction: 'outgoing'
    }
  })

  return updatedMessage
}

module.exports = (db, nlpApiService) => {
  if(!db) {
    return undefined
  }
  
  return ({
    saveOne: createSaveOne(db.Conversation, nlpApiService),
    setRead: createSetRead(db.Message),
    setDelivered: createSetDelivered(db.Message)
  })
}