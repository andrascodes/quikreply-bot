'use strict'

const _ = require('lodash')

const updateWithLabels = ConversationModel => async (conversations) => {

  if(!conversations) {
    return []
  }

  try {

    const convoClusterLabels = conversations.map(convo => 
      convo.clusterLabel.reduce((acc, curr) => (acc.concat(` ${curr}`, '')))
    )
    const convoIds = conversations.map(convo => convo.id)

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

    const result = updatedConvos.map(convo => convo.toJSON())
    return result
  }
  catch(error) {
    throw error
  }
}

module.exports = updateWithLabels