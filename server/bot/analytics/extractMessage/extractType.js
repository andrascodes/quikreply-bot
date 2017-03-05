'use strict'

function extractTypeFromIncoming(msg) {
    
    let type;
    let message = msg.message

    if(message.message) {
      // text, attach, quick_reply, echo
      message = message.message
      if(message.is_echo) {
        type = 'echo'
      }
      else if(message.quick_reply) {
        type = 'quick_reply'
      }
      else if(message.text) {
        type = 'text'
      }
      else if(message.attachments && message.sticker_id) {
        type = 'sticker'
      }
      else if(message.attachments) {
        const attachment = message.attachments[0]
        type = attachment.type
      }
      else {
        console.log('Incoming Message Error', msg)
        throw new Error('The type of the Incoming Message could not be determined.')
      }
    }
    else {
      // delivery, read, postback, optin, referral_new, referral_existing, account_linking
      if(message.delivery) {
        type = 'delivery'
      }
      else if(message.read) {
        type = 'read'
      }
      else if(message.optin) {
        type = 'optin'
      }
      else if(message.referral) {
        type = 'referral_existing'
      }
      else if(message.postback && message.postback.referral) {
        type = 'referral_new'
      }
      else if(message.postback) {
        type = 'postback'
      }
      else if(message.account_linking) {
        type = 'account_linking'
      }
      else {
        console.log('Incoming Message Error', msg)
        throw new Error('The type of the Incoming Message could not be determined.')
      }
    }

    return type
}

function extractTypeFromOutgoing(msg) {
  // sender_action (typing_on, typing_off, mark_seen)
  
  const message = msg.message.message
  let type;

  if(message.text) {
    type = 'text'
  }
  else if(message.attachment && message.attachment.type === 'template') {
    type = message.attachment.payload.template_type
  }
  else if(message.attachment) {
    type = message.attachment.type
  }
  else if(message.sender_action) {
    type = message.sender_action
  }
  else {
    console.log('Outgoing Message Error', msg)
    throw new Error('The type of the Outgoing Message could not be determined.')
  }

  return type
}

module.exports = function extractType(msg) {
  const getType = {
    'incoming': msg => extractTypeFromIncoming(msg),
    'outgoing': msg => extractTypeFromOutgoing(msg)
  }[msg.direction]

  try {
    if(msg instanceof Error) {
      return msg
    }

    return Object.assign({ type: getType(msg) }, msg)

  } catch(error) {
    return error
  }
}