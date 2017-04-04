'use strict';

const createGetConversationsHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation

  try {
    const conversations = await ConversationModel.findAll({
      where: {
        display: true
      },
      attributes: [ 'id', 'participant', ['startTimestamp', 'start'], ['endTimestamp', 'end'], ['clusterLabel', 'label'] ],
      order: [[ 'startTimestamp', 'DESC' ]]
    })

    const errors = await Promise.all(conversations.map(convo => convo.getErrors()))

    const response = conversations.map((convo, ind) => {
      convo.errors = errors[ind]
      return convo
    })

    return res.status(200).json({ data: response })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }
}

module.exports = createGetConversationsHandler;