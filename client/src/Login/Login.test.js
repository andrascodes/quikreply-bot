import React from 'react'
// import { MemoryRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Login } from './Login'

describe(`Login`, () => {

  beforeEach(() => {
    global.localStorage = {

    }
  })

  test('renders correctly', () => {
    const wrapper = mount(<Login />)
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('renders when state.username is changed', () => {
    const wrapper = mount(<Login />)
   
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

  test('renders when state.password is changed', () => {
    const wrapper = mount(<Login />)
   
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
  
  test('renders when state.error is set', () => {
    const wrapper = mount(<Login />)
    
    wrapper.setState({
      error: {
        error: 'Username is incorrect.'
      },
      alertVisible: true
    })
    expect(toJson(wrapper)).toMatchSnapshot()

    wrapper.setState({
      error: {
        toString: () => 'Error: Username is incorrect.'
      },
      alertVisible: true
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

  test('closes the Error Alert panel when close button is clicked', () => {
    const wrapper = mount(<Login />)

    wrapper.setState({
      error: {
        toString: () => 'Error: Username is incorrect.'
      },
      alertVisible: true
    })

    wrapper.find('#errorClose > .close').find('[aria-hidden="true"]').simulate('click', { 
      persist: () => {}, 
      preventDefault: () => {},
    })
    expect(toJson(wrapper)).toMatchSnapshot()
  })

})