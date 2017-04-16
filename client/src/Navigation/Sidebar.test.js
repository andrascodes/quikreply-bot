import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter } from 'react-router-dom'

import { Sidebar } from './Sidebar'

describe('Sidebar', () => {

  test('renders correctly', () => {
    let tree = renderer.create(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})