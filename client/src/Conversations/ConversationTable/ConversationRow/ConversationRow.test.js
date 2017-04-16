import React from 'react'
import renderer from 'react-test-renderer'

import { ConversationRow } from './ConversationRow'

describe('ConversationRow', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <ConversationRow 
        id={1}
        handleRowClick={() => {}}
        participant={'123'}
        start={'2017-04-13 12:00'}
        end={'2017-04-13 12:02'}
        errors={'OAuthException'}
        label={'label1 label2'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})