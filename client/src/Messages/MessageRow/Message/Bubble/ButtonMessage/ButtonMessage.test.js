import React from 'react'
import renderer from 'react-test-renderer'

import { ButtonMessage } from './ButtonMessage'

describe('ButtonMessage', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <ButtonMessage 
        attachment={{
          payload: {
            text: 'Message Text',
            buttons: [
              {
                title: 'Btn title1',
              },
              {
                title: 'Btn title2',
              },
            ]
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})