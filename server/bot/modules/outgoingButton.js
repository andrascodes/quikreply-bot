'use strict'

module.exports = (bot) => {
  bot.hear('button', (payload, chat, data) => {
    
    chat.sendButtonTemplate(
      'Button template text message...',
      [
        {
            type: 'postback',
            title: 'Postback',
            payload: 'Postback_Button1'
        },
        {
            type: 'web_url',
            title: 'Compact Google',
            url: 'https://www.google.hu/',
            webview_height_ratio: 'compact'
        }
      ],
      {
        quickReplies: [
          {
            content_type: 'location',
          },
          {
            title: 'Red',
            image_url: 'http://homepages.neiu.edu/~asalaza5/cs300/images/redimage.png'
          }
        ]
      })
  })
}