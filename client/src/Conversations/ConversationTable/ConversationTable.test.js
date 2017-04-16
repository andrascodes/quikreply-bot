import React from 'react'
import renderer from 'react-test-renderer'

import { ConversationTable } from './ConversationTable'

describe('ConversationTable', () => {

  test('renders correctly', () => {
    
    const tree = renderer.create(
      <ConversationTable 
        handleRowClick={(id) => () => {}}
        conversations={[{
          id: 1,
          participant: '123',
          start: '2017-04-13 12:00',
          end: '2017-04-13 12:02',
          errors: 'OAuthException',
          label: 'label1 label2',
        }]}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('throws PropType error', () => {
    const render = () => renderer.create(
      <ConversationTable
        handleRowClick={(id) => () => {}}
      />
    )
    expect(render).toThrowError(`The prop 'conversations' has to be defined, pass an empty array ([])`)
  })

})