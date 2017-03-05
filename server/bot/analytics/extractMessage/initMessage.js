'use strict'

module.exports = function initMessage(event, direction) {
    const buildMessage = {
      'incoming': e => ([{
        direction: 'incoming',
        delivered: true,
        read: true,
        message: e,
      }]),
      'outgoing': e => ([{ 
        direction: 'outgoing',
        message: e.message, 
        response: e.response 
      }])
    }[direction]

    try {
      return buildMessage(event)
    } catch(error) {
      return [error]
    }
  }