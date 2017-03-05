'use strict'

module.exports = (bot) => {
  bot.hear('text', (payload, chat, data) => {
    const text = payload.message.text
    if (data.captured) { return }
    chat.say(`Echo: ${text}`)
  })
  
  bot.on('attachment', (payload, chat, data) => {

    function getType(attachment) {
      const typeMap = {
        'image': () => chat.say(`This is an image. (y)`),
        'audio': () => chat.say(`This is some kind of sound. (y)`),
        'file': () => chat.say(`This is a file. (y)`),
        'video': () => chat.say(`This is a video. (y)`),
        'location': () => chat.say(`This is your location. (y)`),
        'fallback': () => chat.say(`This is some kind of fallback URL. (y)`),
      }

      return typeMap[attachment.type]
    }

    const answers = payload.message.attachments.map(getType)
    answers.map(f => f())
    
  })

  bot.on('postback', (payload, chat, data) => {

    chat.say(`This is a POSTBACK with a payload of: ${payload.postback.payload}`)
    
  })

  bot.on('quick_reply', (payload, chat, data) => {

    chat.say(`This is a QUICK REPLY with a payload of: ${payload.message.quick_reply.payload}`)
    
  })
}