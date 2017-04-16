import React from 'react'
import renderer from 'react-test-renderer'

import { ErrorIndicator } from './ErrorIndicator'

describe('ErrorIndicator', () => {

  test('renders correctly', () => {
    const tree = renderer.create(
      <ErrorIndicator
        value={'OAuthException'}
        response={{
          error: {
            code: 200,
          }
        }}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders correctly when value is falsy', () => {
    const tree = renderer.create(
      <ErrorIndicator 
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})