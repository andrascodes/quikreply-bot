import React from 'react'
import renderer from 'react-test-renderer'

import { Error } from './Error'

describe('Error', () => {

  test('renders correctly with or without specifying props.text', () => {
    let tree = renderer.create(
      <Error 
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()

    tree = renderer.create(
      <Error 
        text="Please try again later!"
      />
    )
    expect(tree).toMatchSnapshot()
  })

})