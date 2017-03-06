'use strict'

function extractTextFromMessage(msg, type) {
  const convertToText = {
    'echo': msg => 'echo',
    'quick_reply': msg => `Quick Reply: ${msg.message.text}`,
    'text': msg => `Text: ${msg.message.text}`,
    'sticker': msg => 'Sticker',
    'audio': msg => 'Audio',
    'fallback': msg => 'URL',
    'file': msg => 'File',
    'image': msg => 'Image',
    'location': msg => 'Location',
    'video': msg => 'Video',
    'delivery': msg => 'delivery',
    'read': msg => 'read',
    'optin': msg => `Send-to-Messenger plugin: ${msg.optin}`,
    'referral_existing': msg => `Referral for existing user: ${msg.referral.ref}`,
    'referral_new': msg => `Referral for new user: ${msg.postback.payload} ${msg.postback.referral.ref}`,
    'postback': msg => `Postback: ${msg.postback.payload}`,
    'account_linking': msg => `Account Linking: ${msg.account_linking.status}`,
    'button': buttonTemplateToText,
    'generic': genericTemplateToText,
    'list': listTemplateToText,
    'receipt': msg => 'Receipt',
    'mark_seen': msg => 'Marked last message as read',
    'typing_on': msg => 'Turned typing indicators on',
    'typing_off': msg => 'Turned typing indicators off',
    'airline_boardingpass': msg => `Airline boarding pass: ${msg.message.attachment.payload.intro_message}`,
    'airline_checkin': msg => `Airline Checkin: ${msg.message.attachment.payload.intro_message}`,
    'airline_itinerary': msg => `Airline Itinerary: ${msg.message.attachment.payload.intro_message}`,
    'airline_update': msg => `Airline Flight Update: ${msg.message.attachment.payload.intro_message}`
  }[type]

  return convertToText(msg)
}

module.exports = function extractText(msg) {
  // const getText= {
  //   'incoming': msg => extractTextFromMessage(msg.message, msg.type),
  //   'outgoing': msg => extractTextFromMessage(msg.message.message, msg.type)
  // }[msg.direction]
  
  try {
    if(msg instanceof Error) {
      return msg
    }

    return Object.assign({ text: extractTextFromMessage(msg.message, msg.type) }, msg)

  } catch(error) {
    return error
  }
}

const buttonToText = btn => 
  btn.title ? `${btn.title}` : `${btn.type}`

const buttonTemplateToText = msg =>
  `Buttons: ${msg.message.attachment.payload.text} 
            ${msg.message.attachment.payload.buttons.map(buttonToText)}`

const genericTemplateToText = msg => 
  `Generic: ${msg.message.attachment.payload.elements.map(elementToText)}`

const elementToText = elem => 
  `${elem.title} ${elem.subtitle} ${elem.buttons.map(buttonToText)}`

const listTemplateToText = msg => 
  `List: ${msg.message.attachment.payload.elements.map(elementToText)} ` +
         `${msg.message.attachment.payload.buttons.map(buttonToText)}`