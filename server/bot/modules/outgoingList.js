'use strict'

module.exports = (bot) => {
  bot.hear('list', (payload, chat, data) => {

    chat.sendListTemplate(
      [
        {
          title: 'List item 1',
          image_url: 'http://homepages.neiu.edu/~asalaza5/cs300/images/redimage.png',
          subtitle: 'Item subtitle 1',
          default_action: {
            type: 'web_url',
            url: 'https://www.google.hu/',
            webview_height_ratio: 'compact',
          },
          buttons: [
            {
              title: 'Web Button',
              type: 'web_url',
              url: 'https://www.google.hu/',
              webview_height_ratio: 'compact',
            }
          ]
        },

        {
          title: 'List item 2',
          image_url: 'http://homepages.neiu.edu/~asalaza5/cs300/images/redimage.png',
          subtitle: 'Item subtitle 2',
          buttons: [
            {
              title: 'Postback Button',
              type: 'postback',
              payload: 'Item2_Button'
            }
          ]
        }
      ], 
      {
        top_element_style: 'large',
        buttons: [
          {
            title: 'Postback Button',
            type: 'postback',
            payload: 'Postback_List'
          }
        ],
        quickReplies: ['Red']
      }
    );
  })
}