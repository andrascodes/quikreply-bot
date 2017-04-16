import React from 'react'
import renderer from 'react-test-renderer'

import { MessageRow } from './MessageRow'

describe('MessageRow', () => {

  test('renders Incoming Message correctly', () => {
    const tree = renderer.create(
      <MessageRow
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
  
  test('renders Outgoing Message correctly', () => {
    const tree = renderer.create(
      <MessageRow
        timestamp={'2017-04-10T15:16:55.834Z'}
        type={'text'}
        direction={'outgoing'} 
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