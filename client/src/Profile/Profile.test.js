import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Profile } from './Profile'

describe(`Profile`, () => {

  beforeEach(() => {
    global.localStorage = {
      clear: jest.fn(),
      username: 'admin',
      email: 'admin@mail.com'
    }
  })

  test(`renders Redirect to /login when state.error.status is 401: Unauthorized`, () => {
    const wrapper = mount(
      <MemoryRouter>
        <Profile error={{ status: 401 }}/>
      </MemoryRouter>
    )
    expect(global.localStorage.clear).toHaveBeenCalled()
    expect(wrapper.find('Redirect').prop('to').pathname).toEqual('/login')
  })

  test(`renders Redirect to /login when state.statusText is 'changed'`, () => {
    const wrapper = mount(
      <MemoryRouter>
        <Profile error={{ status: 200, statusText: 'changed' }}/>
      </MemoryRouter>
    )
    expect(global.localStorage.clear).toHaveBeenCalled()
    expect(wrapper.find('Redirect').prop('to').pathname).toEqual('/login')
  })
  
  test(`renders Error when state.error is defined to anything else`, () => {
    const wrapper = mount(
      <Profile error={{ status: 500 }}/>
    )
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders correctly', () => {
    const wrapper = mount(<Profile />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders the username when state.username is changed', () => {
    const wrapper = mount(<Profile />)
   
    const username = 'user_1'
    wrapper.find('#usernameInput').simulate('change', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: username,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })
  
  test('renders the email when state.email is changed', () => {
    const wrapper = mount(<Profile />)
   
    const email = 'email@mail.com'
    wrapper.find('#emailInput').simulate('change', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: email,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders when state.password is changed', () => {
    const wrapper = mount(<Profile />)
   
    const password = 'another_password'
    wrapper.find('#passwordInput').simulate('change', { 
      persist: () => {}, 
      preventDefault: () => {},
      target: {
        value: password,
      }
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})