'use strict'

const saveMessage = db => async message => {

  const MessageModel = db.Message
  const ConversationModel = db.Conversation
  const activeConversations = db.activeConversations

  if(message.type === 'echo') {
    return ({
      error: `Echo messages are not logged`
    })
  }
  else if(message.type === 'delivery') {
    // Get outgoing messages that
    // have a timestamp < this message's timestamp
    // have not been delivered
    // exchanged between the authenticated user and the partipant
    
    try {
      await MessageModel.update({
        delivered: true
      }, {
        where: {
          timestamp: {
            $lte: message.timestamp
          },
          participant: message.participant,
          error: null,
          delivered: false,
          direction: 'outgoing'
        }
      })

      console.log(`delivery message logged`)
      return ({
        result: `delivery message logged`
      })

    }
    catch(error) {
      console.error(error)
    }
  }
  else if(message.type === 'read') {
    // Get outgoing messages that
    // have a timestamp < this message's timestamp
    // have not been read
    // exchanged between the authenticated user and the partipant

    try {
      await MessageModel.update({
        read: true
      }, {
        where: {
          timestamp: {
            $lte: message.timestamp
          },
          participant: message.participant,
          error: null,
          read: false,
          direction: 'outgoing'
        }
      })

      console.log(`read message logged`)
      return ({
        result: `read message logged`
      })
    }
    catch(error) {
      console.error(error)
    }
  }
  else {
    
    const conversation = activeConversations.getConversation(message.participant)
    if(conversation) {

      try {
        const msg = await conversation.createMessage(message)

        console.log(`Message '${message.id}' with type '${message.type}' has been logged`)
        return ({
          result: `Message '${message.id}' with type '${message.type}' has been logged` 
        })
      }
      catch(error) {
        console.error(error)
      }

    }
    else {

      try {
        const convo = await ConversationModel.create({
          participant: message.participant,
          startTimestamp: message.timestamp
        })
        activeConversations.saveConversation(convo)
        
        const msg = await convo.createMessage(message)

        console.log(`Message '${message.id}' with type '${message.type}' has been logged`)
        return ({ 
          result: `Message '${message.id}' with type '${message.type}' has been logged` 
        })
      }
      catch(error) {
        console.error(error)
      }

    }
  }
}

module.exports = saveMessage