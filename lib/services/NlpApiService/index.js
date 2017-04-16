'use strict'

// GetSentiment
const createGetSentiment = (fetch, nlpApiUrl) => async text => {
  
  if(!text) {
    return undefined
  }

  try {
    let sentiment = await fetch(`${nlpApiUrl}/sentiment`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 
        'Content-Type': 'application/json',
      }
    })

    if(sentiment.status === 404) {
      throw new Error('Wrong URL for the NLP API.')
    }

    sentiment = await sentiment.json()

    return sentiment.sentiment
  }
  catch(error) {
    throw error
  }
}
// GetClusterLabel
const createGetCluster = (fetch, nlpApiUrl) => async text => {
  
  if(!text) {
    return undefined
  }

  try {
   let clusterLabel = await fetch(`${nlpApiUrl}/cluster`, {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: { 
        'Content-Type': 'application/json',
      }
    })
    if(clusterLabel.status === 404) {
      throw new Error('Wrong URL for the NLP API.')
    }

    clusterLabel = await clusterLabel.json()
    clusterLabel = clusterLabel.label.reduce((acc, curr) => (acc.concat(` ${curr}`, '')))
    return clusterLabel
  }
  catch(error) {
    throw error
  }
}

module.exports = (fetch, nlpApiUrl) => {
  if(!nlpApiUrl || !fetch) {
    return undefined
  }

  return {
    getSentiment: createGetSentiment(fetch, nlpApiUrl),
    getCluster: createGetCluster(fetch, nlpApiUrl)
  }
}