'use strict'

const createSaveMessage = (activeConversations, conversationService, messageService) => async message => {

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

      await messageService.setDelivered(message.timestamp, message.participant)

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
      
      await messageService.setRead(message.timestamp, message.participant)

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
        await messageService.saveOne(convo.id, message)

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
        const convo = await conversationService.saveOne({
          participant: message.participant,
          startTimestamp: message.timestamp
        })
        activeConversations.saveConversation(convo)
        
        await messageService.saveOne(convo.id, message)

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

module.exports = createSaveMessage