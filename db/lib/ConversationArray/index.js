'use strict'

const _ = require('underscore')

const createConversationArray = fetch => nlpApiUrl => {
  // const _thirtyMinutes = 1800000
  const _thirtyMinutes = 3000
  const _conversations = {}

  const _endConversation = participantId => async () => {
    
    try {
      const convo = _conversations[participantId].instance

      const endTimestamp = await convo.findEndtimestamp()
      
      const convoText = await convo.getText()
      let clusterLabel = await fetch(`${nlpApiUrl}/cluster`, {
        method: 'POST',
        body: JSON.stringify({ text: convoText }),
        headers: { 
          'Content-Type': 'application/json',
        }
      })
      clusterLabel = await clusterLabel.json()
      clusterLabel = clusterLabel.label.reduce((acc, curr) => (acc.concat(` ${curr}`, '')))
      // TODO
      // const errors = await convo.getErrors()

      await convo.update({ 
        endTimestamp,
        clusterLabel
      })

      delete _conversations[participantId]
      console.log(`Conversation with ${convo.participant} has ended` +
                    ` at ${convo.endTimestamp.getHours()}:${convo.endTimestamp.getMinutes()}`)
    }
    catch(error) {
      console.error(error)
    }
  }

  const toString = () => 
    _.keys(_conversations).map( userId => _.flatten([ userId, _.keys(_conversations[userId]) ]) )

  const saveConversation = (convo) => {
    const participantId = convo.get('participant')

    _conversations[participantId] = {
      instance: convo,
      scheduledDeletion: setTimeout(_endConversation(participantId), _thirtyMinutes)
    }

    return _conversations[participantId].instance
  }

  const getConversation = participantId => {

    const conversation = _conversations[participantId]

    if(conversation) {
      clearTimeout(conversation.scheduledDeletion)
      conversation.scheduledDeletion = setTimeout(_endConversation(participantId), _thirtyMinutes)

      return conversation.instance
    }
    else {
      return null
    }
  }

  return ({
    getConversation,
    saveConversation,
    toString
  })
}

module.exports = createConversationArray