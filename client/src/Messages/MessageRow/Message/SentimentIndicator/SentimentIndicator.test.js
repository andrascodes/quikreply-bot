import React from 'react'
import renderer from 'react-test-renderer'

import { SentimentIndicator } from './SentimentIndicator'

describe('SentimentIndicator', () => {

  test('renders correctly', () => {
    let tree = renderer.create(
      <SentimentIndicator
        value={'positive'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    
    tree = renderer.create(
      <SentimentIndicator
        value={'negative'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
    
    tree = renderer.create(
      <SentimentIndicator
        value={'neutral'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders correctly when value is falsy', () => {
    const tree = renderer.create(
      <SentimentIndicator 
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})