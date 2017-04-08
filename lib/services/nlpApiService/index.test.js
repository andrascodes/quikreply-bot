'use strict'

const test = require('tape')
const fetch = require('node-fetch')
const { nlpApiUrl } = require('../../../config')
const createNlpApiService = require('./')

test(`nlpApiService`, nest => {
  
  const nlpApiService = createNlpApiService(fetch, nlpApiUrl)

  nest.test(`nlpApiService: should have 'getSentiment' method`, assert => {
    
    assert.ok(nlpApiService.getSentiment)
    
    assert.end()
  })

  nest.test(`nlpApiService: should have 'getCluster' method`, assert => {
    
    assert.ok(nlpApiService.getCluster)
    
    assert.end()
  })

})

test(`#getSentiment`, async assert => {
  const nlpApiService = createNlpApiService(fetch, nlpApiUrl)
  const undefinedNlpApiService = createNlpApiService(fetch, undefined)

  try {
    assert.equal(undefinedNlpApiService, undefined, 'should be undefined if either fetch or nlpApiUrl is undefined')  

    assert.equal(await nlpApiService.getSentiment(), undefined, `should return undefined if undefined argument is passed`)

    const actual = await nlpApiService.getSentiment('message')
    assert.equal(typeof actual, 'string', `should return a string`)
    assert.ok(['negative', 'positive', 'neutral'].includes(actual), `should return "positive", "negative" or "neutral"`)
  }
  catch(error) {
    assert.fail(error)
  }

  try{
    const errorNlpApiService = createNlpApiService(fetch, 'https://qranalytics-nlp.herokuapp.com/api/')
    const errorActual = await errorNlpApiService.getSentiment('message')
  }
  catch(error) {
    assert.equal(error.message, 'Wrong URL for the NLP API.', 'should throw error is ')
  }

  assert.end()
  
})

test(`#getCluster`, async assert => {
  const nlpApiService = createNlpApiService(fetch, nlpApiUrl)
  const undefinedNlpApiService = createNlpApiService(fetch, undefined)

  try {
    assert.equal(undefinedNlpApiService, undefined, 'should be undefined if either fetch or nlpApiUrl is undefined')  

    assert.equal(await nlpApiService.getCluster(), undefined, `should return undefined if undefined argument is passed`)

    const actual = await nlpApiService.getCluster('message')
    assert.equal(typeof actual, 'string', `should return a string`)
  }
  catch(error) {
    assert.fail(error)
  }

  try{
    const errorNlpApiService = createNlpApiService(fetch, 'https://qranalytics-nlp.herokuapp.com/api/')
    const errorActual = await errorNlpApiService.getCluster('message')
  }
  catch(error) {
    assert.equal(error.message, 'Wrong URL for the NLP API.', 'should throw error is ')
  }

  assert.end()
  
})