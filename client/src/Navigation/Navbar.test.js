import React from 'react'
import renderer from 'react-test-renderer'
import { MemoryRouter, Router } from 'react-router-dom'
import createHistory from 'history/createBrowserHistory'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'

import { Navbar } from './Navbar'

describe('Navbar', () => {

  beforeEach(() => {
    global.localStorage = {
      username: 'admin',
      clear: jest.fn()
    }
  })

  test('renders correctly', () => {
    let tree = renderer.create(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('redirects to /profile when clicking the Profile link', () => {
    const history = createHistory()
    const wrapper = mount(
      <Router history={history}>
        <Navbar/>
      </Router>
    )
    const locationBefore = history.location.pathname
    const expectedLocationAfter = '/profile'
    wrapper.find('.ProfileLink').find('a').simulate('click')
    const actualLocationAfter = history.location.pathname
    expect(actualLocationAfter).not.toEqual(locationBefore)
    expect(actualLocationAfter).toEqual('/profile')
  })

  test('handles SignOut link click', () => {
    const mockedHandleSignoutClick = jest.fn()
    const history = createHistory()
    const wrapper = mount(
      <Router history={history}>
        <Navbar onSignOutClick={mockedHandleSignoutClick}/>
      </Router>
    )
    wrapper.find('.SignOutLink').find('a').simulate('click')
    expect(mockedHandleSignoutClick).toHaveBeenCalled()
  })

})