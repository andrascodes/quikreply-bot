import React from 'react'
import renderer from 'react-test-renderer'

import { SelectField } from './SelectField'

describe('SelectField', () => {

  test('renders correctly', () => {
    
    const tree = renderer.create(
      <SelectField 
        options={[
          {
            value: 'label1 label2',
            text: 'label1 label2'
          }, 
          {
            value: 'label3 label4',
            text: 'label3 label4'
          }
        ]}
        name={'selectfield'}
        label={'Label'}
        handleChange={() => {}}
        defaultValue={'null'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders correctly when no defaultValue is set', () => {
    
    const tree = renderer.create(
      <SelectField 
        options={[
          {
            value: 'label1 label2',
            text: 'label1 label2'
          }, 
          {
            value: 'label3 label4',
            text: 'label3 label4'
          }
        ]}
        name={'selectfield'}
        label={'Label'}
        handleChange={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('throws PropType error', () => {
    const render = () => renderer.create(
      <SelectField
        handleChange={() => {}}
      />
    )
    expect(render).toThrowError(`The prop 'options' has to be defined, pass an empty array ([])`)
  })

})