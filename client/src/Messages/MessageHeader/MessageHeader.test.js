import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import renderer from 'react-test-renderer'

import { MessageHeader } from './MessageHeader'

describe('MessageHeader', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <MessageHeader 
        />
      </MemoryRouter>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders correctly with props', () => {
    const tree = renderer.create(
      <MemoryRouter>
        <MessageHeader 
          filterState={undefined}
          participant="123"
          startDate="2017-04-28 12:05"
          label="label1 label2 label3"
        />
      </MemoryRouter>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})