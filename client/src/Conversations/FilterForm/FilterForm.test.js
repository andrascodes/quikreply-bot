import React from 'react'
import renderer from 'react-test-renderer'

import { FilterForm } from './FilterForm'

describe('FilterForm', () => {

  test('renders correctly', () => {
    
    const tree = renderer.create(
      <FilterForm 
        participantList={['123', '456']}
        handleParticipantInput={() => {}}
        defaultParticipantValue={'123'}

        minStartDate={'2017-04-13'}
        maxEndDate={'2017-05-14'}
        defaultStartValue={'2017-04-15'}
        defaultEndValue={'2017-04-20'}
        handleStartInput={() => {}}
        handleEndInput={() => {}}

        labelOptions={[{
          value: 'label1 label2',
          text: 'label1 label2'
        }]}
        handleLabelChange={() => {}}
        defaultLabelValue={'null'}

        errorOptions={[{
          value: 'OAuthException',
          text: 'OAuthException'
        }]}
        handleErrorChange={() => {}}
        defaultErrorValue={'----'}
      />
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  
  test('throws PropType error', () => {
    const render = () => renderer.create(
      <FilterForm
        handleRowClick={(id) => () => {}}
      />
    )
    expect(render).toThrowError(`The prop 'options' has to be defined, pass an empty array ([])`)
  })

})