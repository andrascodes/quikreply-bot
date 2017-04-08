'use strict'

const createFetchAll = ConversationModel => async () => {

  try {
    const conversations = await ConversationModel.findAll({
      where: {
        display: true
      },
      attributes: [ 'id', 'participant', ['startTimestamp', 'start'], ['endTimestamp', 'end'], ['clusterLabel', 'label'] ],
      order: [[ 'startTimestamp', 'DESC' ]]
    })

    const errors = await Promise.all(conversations.map(convo => convo.getErrors()))

    const result = conversations
                   .map(convo => convo.toJSON())
                   .map((convo, ind) => {
                     convo.errors = errors[ind]
                     return convo
                   })

    return result
  }
  catch(error) {
    throw error
  }
}

module.exports = createFetchAll