'use strict'

const test = require('tape')

const logMessage = require('./')

test(`Analytics#logIncoming`, async assert => {

  const messageToBeSaved = {
    "sender":{
      "id":"USER_ID"
    },
    "recipient":{
      "id":"PAGE_ID"
    },
    "timestamp":1458692752478,
    "message":{
      "mid":"mid.1457764197618:41d102a3e1ae206a38",
      "text":"hello, world!",
      "quick_reply": {
        "payload": "DEVELOPER_DEFINED_PAYLOAD"
      }
    }
  }
  const saveMessage = () => {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
  const logIncoming = logMessage(saveMessage, 'incoming')

  try {
    let result = await logIncoming({})
    assert.notOk(result, 'should not save invalid Message')

    result = await logIncoming(messageToBeSaved)
    assert.ok(result, 'should call saveMessage on a valid Message')

    assert.end()
  }
  catch(error) {
    assert.fail(error, 'should not throw error')
    assert.end()
  }
})

test(`Analytics#logOutgoing`, async assert => {
  
  const saveMessage = () => {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }
  const logOutgoing = logMessage(saveMessage, 'outgoing')

  try {
    const messageToBeSaved = {
      "recipient":{
        "id":"USER_ID"
      },
      "message":{
        "text":"hello, world!"
      }
    }

    const responseToBeSaved = {
      "error": {
        "message": "Invalid OAuth access token.",
        "type": "OAuthException",
        "code": 190,
        "error_subcode": 1234567,
        "fbtrace_id": "BLBz/WZt8dN"
      }
    }
    const msg = {}
    let result = await logOutgoing(msg, {})
    assert.ok(Object.keys(msg).includes('timestamp'), 'should add timestamp to passed message')

    result = await logOutgoing({}, {})
    assert.notOk(result, 'should not save invalid Message')

    result = await logOutgoing(messageToBeSaved, responseToBeSaved)
    assert.ok(result, 'should call saveMessage on a valid Message')

    assert.end()
  }
  catch(error) {
    assert.fail(error)
    assert.end()
  }
})