import React from 'react'
import renderer from 'react-test-renderer'

import { SearchField } from './SearchField'

describe('SearchField', () => {

  test('renders correctly', () => {
    
    const tree = renderer.create(
      <SearchField 
        options={['123', '456']}
        handleInput={() => {}}
        defaultParticipantValue={'123'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders correctly when no defaultValue is set', () => {
    
    const tree = renderer.create(
      <SearchField 
        options={['123', '456']}
        handleInput={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('throws PropType error', () => {
    const render = () => renderer.create(
      <SearchField
        handleInput={() => {}}
      />
    )
    expect(render).toThrowError(`The prop 'options' has to be defined, pass an empty array ([])`)
  })

})