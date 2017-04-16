import React from 'react'
import renderer from 'react-test-renderer'

import { Main } from './Main'

describe('Main', () => {

  test('renders correctly', () => {
    let tree = renderer.create(
      <Main></Main>
    ).toJSON()
    expect(tree).toMatchSnapshot()
    
    tree = renderer.create(
      <Main>
        <h1>Children</h1>
      </Main>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})