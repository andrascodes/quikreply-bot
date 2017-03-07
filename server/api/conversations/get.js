'use strict';

const createGetConversationsHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation
  const MessageModel = db.Message

  try {
    const conversationsWithMessages = await ConversationModel.findAll({
      include: [{ model: MessageModel }],
      order: [ [MessageModel, 'timestamp', 'ASC'] ]
    })

    const response = conversationsWithMessages.map(convo => {
      
      const messageString = convo.messages.reduce( (accumulator, current) => 
        accumulator.concat(`${current.text} `), '')

      return ({
        id: convo.id,
        messages: messageString
      })
    })

    return res.status(200).json({ data: response })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }


}

module.exports = createGetConversationsHandler;