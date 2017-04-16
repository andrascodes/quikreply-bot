import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Messages } from './Messages'

describe(`Messages`, () => {

  beforeEach(() => {
    global.localStorage = {
      clear: jest.fn()
    }
  })
  
  test('renders Loading when state.message is undefined', () => {
    const wrapper = mount(
      <Messages
        match={{
          params: {
            id: 1
          }
        }}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders Redirect to /login when state.error.status is 401: Unauthorized', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Messages 
          match={{
            params: {
              id: 1
            }
          }}
          error={{ status: 401 }}
        />
      </MemoryRouter>
    )
    expect(global.localStorage.clear).toHaveBeenCalled()
    expect(wrapper.find('Redirect').prop('to')).toEqual('/login')
  })

  test('renders Error when state.error is truthy', () => {
    const wrapper = mount(
      <Messages 
        match={{
          params: {
            id: 1
          }
        }}
        error={{ status: 500 }}
      />
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })
  
  test('renders messages when state.messages is not empty', () => {
    const wrapper = mount(
      <MemoryRouter>
        <Messages
          match={{
            params: {
              id: 1
            }
          }}
          location={{}}
          id={6}
          participant={"1388594137833781"}
          startDate={"2017-04-12T16:43:18.589Z"}
          endDate={"2017-04-12T16:43:21.408Z"}
          label={"like creators feedback best send bot"}
          messages={[
            {
              id: 1,
              timestamp: '2017-04-10T15:16:55.834Z',
              type: 'text',
              direction: 'outgoing',
              message: {
                message: {
                  text: 'Incoming text message',
                }
              },
              text: 'Text: Incoming text message',
              response: {
                error: {
                  code: 200,
                }
              },
              error: 'OAuthException',
              sentiment: 'neutral',
            }
          ]}
        />
      </MemoryRouter>
    )
    expect(wrapper.find('.MessageHeader').exists()).toBeTruthy()
  })

  /*

  test('renders placeholder text when state.conversations is empty', () => {
    const wrapper = mount(<Conversations />)
    wrapper.setState({ 
      conversations: []
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })
  

  test('redirects to /conversation/:id when row is clicked', () => {
    const push = jest.fn()
    const wrapper = mount(<Conversations history={({ push })}/>)
    wrapper.setState({
      conversations,
      participant: '456'
    })
    const thisState = wrapper.state()
    const route = `/conversations/5`
    wrapper.find('tr[id=5]').simulate('click', { persist: () => {}, preventDefault: () => {} })
    expect(push).toHaveBeenCalledWith(route, thisState)
  })
  
  test('renders filtered conversations when state.participant is set', () => {
    const wrapper = mount(<Conversations />)
    wrapper.setState({
      conversations,
    })
    
    const participantId = '456'
    wrapper.find('input[list="participants"]').simulate('input', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: participantId,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders filtered conversations when state.startDate and endDate is set', () => {
    const wrapper = mount(<Conversations />)
    wrapper.setState({
      conversations,
    })
    
    const startDate = '2017-04-08'
    const endDate = '2017-04-11'
    wrapper.find('input[id="from"]').simulate('input', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: startDate,
      }
    })
    wrapper.find('input[id="to"]').simulate('input', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: endDate,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders filtered conversations when state.label is set', () => {
    const wrapper = mount(<Conversations />)
    wrapper.setState({
      conversations,
    })
    
    const label = "dislike consumers question worst get human"
    wrapper.find('select[name="clusterLabelSelector"]').simulate('change', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: label,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders filtered conversations when state.errorLabel is set', () => {
    const wrapper = mount(<Conversations />)
    wrapper.setState({
      conversations,
    })
    
    const errorLabel = "OAuthException"
    wrapper.find('select[name="errorSelector"]').simulate('change', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: errorLabel,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })*/

})