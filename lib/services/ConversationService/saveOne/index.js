'use strict'

const _ = require('lodash')

const createSaveOne = (ConversationModel) => async (convo) => {
  
  const params = _.pick(convo, ['participant', 'startTimestamp', 'endTimestamp', 'errors', 'clusterLabel', 'display'])

  const saved = await ConversationModel.create(params)

  return { 
    id: saved.get('id'),
    participant: saved.get('participant')    
  }
}

module.exports = createSaveOne