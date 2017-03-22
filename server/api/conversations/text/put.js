'use strict';

const _ = require('underscore')

const createPutConversationsTextHandler = db => async (req, res) => {
  const ConversationModel = db.Conversation

  try {

    const convoClusterLabels = req.body.data.map(convo => 
      convo.clusterLabel.reduce((acc, curr) => (acc.concat(` ${curr}`, '')))
    )
    const convoIds = req.body.data.map(convo => convo.id)

    const convos = await ConversationModel.findAll({
      where: { id: { $in: convoIds } }
    })

    const convosAndNewLabels = _.zip(convos, convoClusterLabels)

    const updatedConvos = await Promise.all(
      convosAndNewLabels.map(([convo, clusterLabel]) => {
        return convo.update({
          clusterLabel
        })
      })
    )

    return res.status(200).json({ result: `${updatedConvos.length} conversations were updated` })
  }
  catch(error) {
    res.status(500).json({ error: error.toString() })
  }

}

module.exports = createPutConversationsTextHandler;