'use strict'

const _ = require('lodash')

const createConversationArray = ({ conversationService, timeout = 1800000 } = {}) => {

  const _conversations = {}

  const saveConversation = ({ id, participant } = {}) => {

    if(!id || !participant) {
      return undefined
    }
    
    _conversations[participant] = {
      id,
      scheduledDeletion: setTimeout(_endConversation(participant), timeout)
    }

    return { id }
  }

  const getConversation = participant => {

    const convo = _conversations[participant]
    if(convo) {
      clearTimeout(convo.scheduledDeletion)
      convo.scheduledDeletion = setTimeout(_endConversation(participant), timeout)
      return { id: convo.id }
    }
    else {
      return undefined
    }
  }

  const _endConversation = participant => async () => {
    const convo = _conversations[participant]
    delete _conversations[participant] 

    if(conversationService) {
      try {
        await conversationService.closeOne(convo.id)
        console.log(`Conversation with ${participant} has ended at ${new Date()}`)
      }
      catch(error) {
        console.error(error)
      }
    }

    if(convo) {
      return { id: convo.id }
    }
  }

  return({
    getConversation,
    saveConversation
  })

}

module.exports = createConversationArray