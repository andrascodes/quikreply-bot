import React from 'react'
import renderer from 'react-test-renderer'

import { Message } from './Message'

describe('Message', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <Message
        timestamp={'2017-04-10T15:16:55.834Z'}
        type={'text'}
        direction={'incoming'} 
        message={{
          message: {
            text: 'Incoming text message'
          }
        }}
        text={'Text: Incoming text message'}
        response={{
          error: {
            code: 200,
          }
        }}
        error={'OAuthException'}
        sentiment={'neutral'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})