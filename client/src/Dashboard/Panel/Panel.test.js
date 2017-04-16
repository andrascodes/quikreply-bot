import React from 'react'
import renderer from 'react-test-renderer'

import { Panel } from './Panel'

describe('Panel', () => {

  test('renders with panel-info class when previous is not set', () => {
    const tree = renderer.create(
      <Panel
        label="Panel"
        icon="fa-car"
        number="1"
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders with panel-warning class when previous equals number', () => {
    const tree = renderer.create(
      <Panel
        label="Panel"
        icon="fa-car"
        number="1"
        previous="1"
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders with panel-success class when previous is less than number', () => {
    const tree = renderer.create(
      <Panel
        label="Panel"
        icon="fa-car"
        number="1"
        previous="0"
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders with panel-danger class when previous is more than number', () => {
    const tree = renderer.create(
      <Panel
        label="Panel"
        icon="fa-car"
        number="1"
        previous="2"
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})