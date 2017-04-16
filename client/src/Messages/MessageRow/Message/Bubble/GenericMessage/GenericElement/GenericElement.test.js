import React from 'react'
import renderer from 'react-test-renderer'

import { GenericElement } from './GenericElement'

describe.only('GenericElement', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <GenericElement
        element={{
          image_url: 'https://www.google.com',
          title: 'Title',
          subtitle: 'Subtitle',
          default_action: {
            url: 'https://www.google.com'
          },
          buttons: [
            {
              title: 'Btn title1',
            },
            {
              title: 'Btn title2',
            },
          ]
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})