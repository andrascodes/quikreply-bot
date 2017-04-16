'use strict'

const createCloseOne = (ConversationModel, nlpApiService) => async convoId => {
  
  const convo = await ConversationModel.findOne({
    where: {
      id: convoId
    }
  })

  let endTimestamp = await convo.findEndtimestamp()
  if(!endTimestamp) {
    endTimestamp = convo.get('startTimestamp')
  }

  let clusterLabel = null
  if(nlpApiService) {
    const convoText = await convo.getText()
    clusterLabel = await nlpApiService.getCluster(convoText)
  }
  const errors = await convo.getErrors()
  
  await convo.update({ 
    endTimestamp,
    clusterLabel,
    errors
  })
}

module.exports = createCloseOne
