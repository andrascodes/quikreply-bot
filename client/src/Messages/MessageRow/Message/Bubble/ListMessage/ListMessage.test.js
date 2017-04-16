import React from 'react'
import renderer from 'react-test-renderer'

import { ListMessage } from './ListMessage'

describe.only('ListMessage', () => {

  // attachment.payload.elements: array
    // title, subtitle, default_action.url
    // buttons
      // title
    // image_url
  // buttons: title
  test('renders correctly', () => {
    const tree = renderer.create(
      <ListMessage
        attachment={{
          payload: {
            elements: [
              {
                title: 'Title 1',
                subtitle: 'Subtitle 1',
                default_action: {
                  url: 'https://www.google.com'
                },
                image_url: 'https://www.google.com',
                buttons: [
                  {
                    title: 'ElemBtn 1'
                  }
                ]
              },
              {
                title: 'Title 2',
                subtitle: 'Subtitle 2',
                default_action: {
                  url: 'https://www.google.com'
                },
                image_url: 'https://www.google.com',
                buttons: [
                  {
                    title: 'ElemBtn 2'
                  }
                ]
              },
            ],
            buttons: [
              {
                title: 'ListBtn'
              }
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})