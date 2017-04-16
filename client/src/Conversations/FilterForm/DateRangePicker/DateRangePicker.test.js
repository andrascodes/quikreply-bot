import React from 'react'
import renderer from 'react-test-renderer'

import { DateRangePicker } from './DateRangePicker'

describe('DateRangePicker', () => {

  test('renders correctly', () => {
    
    const tree = renderer.create(
      <DateRangePicker 
        minStartDate={'2017-04-13'}
        maxEndDate={'2017-05-14'}
        defaultStartValue={'2017-04-15'}
        defaultEndValue={'2017-04-20'}
        handleStartInput={() => {}}
        handleEndInput={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('renders correctly when no defaultValue is set', () => {
    
    const tree = renderer.create(
      <DateRangePicker 
        minStartDate={'2017-04-13'}
        maxEndDate={'2017-05-14'}
        handleStartInput={() => {}}
        handleEndInput={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders correctly when no minDate is set', () => {
    
    const tree = renderer.create(
      <DateRangePicker 
        defaultStartValue={'2017-04-15'}
        defaultEndValue={'2017-04-20'}
        handleStartInput={() => {}}
        handleEndInput={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders correctly when no minDate or defaultValue is set', () => {
    
    const tree = renderer.create(
      <DateRangePicker 
        handleStartInput={() => {}}
        handleEndInput={() => {}}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

})