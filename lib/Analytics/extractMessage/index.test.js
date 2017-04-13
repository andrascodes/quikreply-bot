'use strict'

const test = require('tape')

const extract = require('./')

test(`ExtractMessage:`, assert => {
  
  const incomingMessage = extract({
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
  }, 'incoming')

  assert.ok(
    Object.keys(incomingMessage).every(key => {
      return ['participant', 'error', 'direction', 'type', 'timestamp', 'text', 'message', 'delivered', 'read']
      .includes(key)
    })
  )
  assert.equal(Object.keys(incomingMessage).length, 9)

  const error = extract({}, 'outgoing')
  assert.ok(error instanceof Error)

  const outgoingMessage = extract({
    message: {
      "recipient":{
        "id":"USER_ID"
      },
      "message":{
        "text":"hello, world!"
      }
    },
    response: {
      "error": {
        "message": "Invalid OAuth access token.",
        "type": "OAuthException",
        "code": 190,
        "error_subcode": 1234567,
        "fbtrace_id": "BLBz/WZt8dN"
      }
    }
  }, 'outgoing')
  assert.ok(
    Object.keys(outgoingMessage).every(key => {
      return ['participant', 'error', 'direction', 'type', 'timestamp', 'text', 'message', 'response']
      .includes(key)
    })
  )
  assert.equal(Object.keys(outgoingMessage).length, 8)

  
  assert.end()
})