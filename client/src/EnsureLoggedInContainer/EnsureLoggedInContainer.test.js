import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter, StaticRouter } from 'react-router-dom'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { EnsureLoggedInContainer } from './EnsureLoggedInContainer'

describe('EnsureLoggedInContainer', () => {

  test('redirects to /login if localStorage.apiToken is not set', () => {
    global.localStorage = {
      apiToken: false
    }
    const wrapper = mount(
      <MemoryRouter>
        <EnsureLoggedInContainer>
        </EnsureLoggedInContainer>
      </MemoryRouter>
    )
    expect(wrapper.find('Redirect').prop('to').pathname).toEqual('/login')
  })
  
  test('renders children if authenticated and not on /login', () => {
    global.localStorage = {
      apiToken: true
    }
    const wrapper = mount(
      <MemoryRouter>
        <EnsureLoggedInContainer>
          <h1>Children</h1>
        </EnsureLoggedInContainer>
      </MemoryRouter>
    )
    expect(wrapper.find('h1').text()).toEqual('Children')
  })

  test('redirects to /root if localStorage.apiToken is set and location is /login', () => {
    global.localStorage = {
      apiToken: true
    }
    const wrapper = mount(
      <MemoryRouter initialEntries={['/login']} initialIndex={0}>
        <EnsureLoggedInContainer>
          <h1>Children</h1>
        </EnsureLoggedInContainer>
      </MemoryRouter>
    )
    expect(wrapper.find('h1').text()).toEqual('Children')
  })

})