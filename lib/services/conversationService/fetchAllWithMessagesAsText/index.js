'use strict'

const createFetchAllWithMessagesAsText = (ConversationModel, MessageModel) => async () => {

  try {
    const conversationsWithMessages = await ConversationModel.findAll({
      include: [{ model: MessageModel }],
      order: [ [MessageModel, 'timestamp', 'ASC'] ]
    })

    const result = conversationsWithMessages
                   .map(convo => convo.toJSON())
                   .map(convo => {
                     const messageString = convo.messages.reduce( (accumulator, current) => 
                                             accumulator.concat(`${current.text} `), '')

                     return ({
                       id: convo.id,
                       messages: messageString
                     })
                   })

    return result
  }
  catch(error) {
    throw error
  }

}

module.exports = createFetchAllWithMessagesAsText