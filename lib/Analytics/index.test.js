'use strict'

const test = require('tape')
const createAnalytics = require('./')

test(`Analytics`, nest => {

  nest.test(`Analytics: should have 'logIncoming' method`, assert => {
    const analytics = createAnalytics({}, {})
    assert.ok(Object.keys(analytics).includes('logIncoming'))
    assert.ok(analytics.logIncoming)
    assert.end()
  })

  nest.test(`Analytics: should have 'logOutgoing' method`, assert => {
    const analytics = createAnalytics({}, {})
    assert.ok(Object.keys(analytics).includes('logOutgoing'))
    assert.ok(analytics.logOutgoing)
    assert.end()
  })
  
  nest.test(`Analytics: should mock the log methods if any of the dependencies are undefined`, assert => {
    const analytics = createAnalytics(undefined, {})
    assert.equal(typeof analytics, 'object', 'should return an object')
    assert.ok(Object.keys(analytics).includes('logIncoming'), 'should have a logIncoming method')
    assert.equal(analytics.logIncoming(), undefined)
    assert.ok(Object.keys(analytics).includes('logOutgoing'), 'should have a logOutgoing method')
    assert.equal(analytics.logOutgoing(), undefined)
    assert.end()
  })
})