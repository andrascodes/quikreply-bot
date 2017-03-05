'use strict'

module.exports = (bot) => {
  bot.hear('template', (payload, chat, data) => {
    
    chat.sendGenericTemplate([
      {
          title: 'Title 1',
          subtitle: `Subtitle 1`,

          image_url: 'http://i.imgur.com/dORdxei.png',
          buttons: [
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
          ]
      },
      {
          title: 'Title 2',
          subtitle: `Subtitle 2`,

          image_url: 'http://i.imgur.com/dORdxei.png',
          buttons: [
              {
                  type: 'postback',
                  title: 'Postback',
                  payload: 'Postback_Button2'
              },
              {
                  type: 'web_url',
                  title: 'Tall Google',
                  url: 'https://www.google.hu/',
                  webview_height_ratio: 'tall'
              }
          ]
      }
    ], {
      quickReplies: [
        {
          content_type: 'location',
        },
        {
          title: 'Red',
          image_url: 'http://homepages.neiu.edu/~asalaza5/cs300/images/redimage.png'
        }
      ]
    });
  })
}